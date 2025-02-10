"use client";
import React, { useState, useEffect } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchInventory } from "../scripts/fetchInventory";
import supabase from "@/config/supabase";

const Inventory = () => {
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [stockFilter, setStockFilter] = useState("all");
	const [inventory, setInventory] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [isFirstPage, setIsFirstPage] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);
	const [selectedItems, setSelectedItems] = useState<any[]>([]); // State to store selected items

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchInventory();
			setInventory(data);
			console.log(data);
		};
		fetchData();
	}, []);

	// Handle selection from page size dropdown
	const handleDropdownSelection = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value));
	};

	// Handle selection from stock filter
	const handleStockFilter = (filter: string) => {
		// Toggle the selection (unselect if already selected)
		setStockFilter((prevFilter) => (prevFilter === filter ? "" : filter));
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setIsFirstPage(page === 1);
		setIsLastPage(page === totalPages);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const filteredInventory = inventory
		.filter((item) => {
			if (stockFilter === "inStock") {
				return item.onhandqty > 0;
			} else if (stockFilter === "outOfStock") {
				return item.onhandqty === 0;
			}
			return true;
		})
		.filter((item) => {
			return (
				item.incoming.product.productname
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				item.incoming.product.brand.brandname
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			);
		});

	const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
	const paginatedInventory = filteredInventory.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleAddToDispatch = (item: any) => {
		setSelectedItems((prevItems) => {
			const existingItemIndex = prevItems.findIndex(
				(i) =>
					i.optionid === item.optionid &&
					i.incoming.product.brand.brandname ===
						item.incoming.product.brand.brandname &&
					i.incoming.product.productname ===
						item.incoming.product.productname
			);

			if (existingItemIndex !== -1) {
				const updatedItems = [...prevItems];
				const maxQty = item.availableqty;
				updatedItems[existingItemIndex] = {
					...updatedItems[existingItemIndex],
					quantity: Math.min(
						updatedItems[existingItemIndex].quantity + 1,
						maxQty
					),
				};
				return updatedItems;
			}

			return [
				...prevItems,
				{ ...item, quantity: 1, deliverystatus: "Pending" },
			];
		});
	};

	const handleIncrement = (
		optionid: any,
		brandname: string,
		productname: string,
		availableStock: number
	) => {
		setSelectedItems((prevItems) =>
			prevItems.map((item) =>
				item.optionid === optionid &&
				item.incoming.product.brand.brandname === brandname &&
				item.incoming.product.productname === productname
					? {
							...item,
							quantity: Math.min(
								item.quantity + 1,
								availableStock
							),
					  }
					: item
			)
		);
	};

	const handleDecrement = (
		optionid: any,
		brandname: string,
		productname: string
	) => {
		setSelectedItems((prevItems) =>
			prevItems.map((item) =>
				item.optionid === optionid &&
				item.incoming.product.brand.brandname === brandname &&
				item.incoming.product.productname === productname &&
				item.quantity > 1
					? { ...item, quantity: item.quantity - 1 }
					: item
			)
		);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		optionid: any,
		brandname: string,
		productname: string,
		availableStock: number
	) => {
		let value = parseInt(e.target.value, 10) || 1;
		value = Math.min(Math.max(value, 1), availableStock);

		setSelectedItems((prevItems) =>
			prevItems.map((item) =>
				item.optionid === optionid &&
				item.incoming.product.brand.brandname === brandname &&
				item.incoming.product.productname === productname
					? { ...item, quantity: value }
					: item
			)
		);
	};

	const handleSubmit = async () => {
		if (selectedItems.length === 0) {
			alert("No items selected for dispatch.");
			return;
		}

		// Format data for dispatch
		const dispatchItems = selectedItems
			.map((item) => ({
				incomingid: item.incoming.incomingid,
				inventoryid: item.inventoryid,
				optionid: item.optionid,
				dispatchquantity: item.quantity,
				deliverystatus: item.deliverystatus,
				soldprice: item.soldprice,
				created_at: new Date(),
			}))
			.filter((item) => item.dispatchquantity > 0);

		if (dispatchItems.length === 0) {
			alert(
				"Please add a valid quantity for at least one item before dispatching."
			);
			return;
		}

		console.log("Dispatching items:", dispatchItems);

		try {
			const { data, error } = await supabase
				.from("outgoing")
				.insert(dispatchItems);

			if (error) {
				console.error("Error inserting data:", error.message);
				alert("Failed to dispatch items. Please try again.");
				return;
			}

			console.log("Items dispatched successfully:", data);

			// Update availableqty in inventory
			for (const item of dispatchItems) {
				// Fetch current availableqty
				const { data: inventoryData, error: fetchError } =
					await supabase
						.from("inventory")
						.select("availableqty")
						.eq("inventoryid", item.inventoryid)
						.single();

				if (fetchError) {
					console.error(
						"Error fetching inventory:",
						fetchError.message
					);
					continue;
				}

				const newAvailableQty =
					(inventoryData?.availableqty || 0) - item.dispatchquantity;

				// Update availableqty
				const { error: updateError } = await supabase
					.from("inventory")
					.update({ availableqty: newAvailableQty })
					.eq("inventoryid", item.inventoryid);

				if (updateError) {
					console.error(
						"Error updating inventory:",
						updateError.message
					);
				}
			}

			alert("Items dispatched successfully, and inventory updated!");
		} catch (err) {
			console.error("Unexpected error:", err);
			alert("An unexpected error occurred. Please try again.");
		}
	};

	return (
		<div className="flex">
			<div className="flex-1 px-3 sm:px-6 lg:px-12">
				<div className="flex items-center space-x-4">
					<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
						Inventory
					</h1>
				</div>

				{/* Table Section */}
				<div className="relative overflow-x-auto px-3">
					<div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
						<div className="flex space-x-4 items-center">
							{/* Dropdown for selecting items per page */}
							<select
								value={itemsPerPage}
								onChange={handleDropdownSelection}
								className="text-black bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-black dark:focus:ring-black"
							>
								<option value={5}>Page Size : 5 items</option>
								<option value={10}>Page Size : 10 items</option>
								<option value={15}>Page Size : 15 items</option>
								<option value={20}>Page Size : 20 items</option>
							</select>

							{/* Buttons for stock filter */}
							<div className="inline-flex border border-black rounded-full overflow-hidden">
								<button
									onClick={() => handleStockFilter("inStock")}
									className={`px-6 py-2 text-sm font-medium ${
										stockFilter === "inStock"
											? "bg-blue-500 text-white"
											: "bg-white text-black"
									} border-r`}
								>
									In Stock
								</button>
								<button
									onClick={() =>
										handleStockFilter("outOfStock")
									}
									className={`px-6 py-2 text-sm font-medium ${
										stockFilter === "outOfStock"
											? "bg-blue-500 text-white"
											: "bg-white text-black"
									}`}
								>
									Out of Stock
								</button>
							</div>
						</div>

						<label htmlFor="table-search" className="sr-only">
							Search
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
								<svg
									className="w-5 h-5 text-black dark:text-black"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<input
								type="text"
								id="table-search"
								className="block p-2 ps-10 text-sm text-black border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Search for items"
								value={searchQuery}
								onChange={handleSearchChange}
							/>
						</div>
					</div>

					{/* Table */}
					<table className="w-full text-sm text-left rtl:text-right text-black dark:text-black">
						<thead className="text-xs text-black bg-[#e5e5e5] dark:bg-gray-700 dark:text-black">
							<tr>
								<th scope="col" className="px-6 py-3">
									Item
								</th>
								<th scope="col" className="px-6 py-3">
									Brand
								</th>
								<th scope="col" className="px-6 py-3">
									Option
								</th>
								<th scope="col" className="px-6 py-3">
									SKU
								</th>
								<th scope="col" className="px-6 py-3">
									Landed Cost
								</th>
								<th scope="col" className="px-6 py-3">
									Gross Price
								</th>
								<th scope="col" className="px-6 py-3">
									On-hand QTY
								</th>
								<th scope="col" className="px-6 py-3">
									Available QTY
								</th>
								<th scope="col" className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{paginatedInventory.map(
								(item: any, index: number) => {
									const incomingDetail =
										item.incoming.incomingdetails.find(
											(detail: any) =>
												detail.optionid ===
												item.optionid
										);

									const matchedOption =
										item.incoming.product.optiondetails.find(
											(opt: any) =>
												opt.optionid === item.optionid
										);

									return (
										<tr
											key={item.inventoryid}
											className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
										>
											<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
												{
													item.incoming.product
														.productname
												}
											</td>
											<td className="px-6 py-4">
												{
													item.incoming.product.brand
														.brandname
												}
											</td>
											<td className="px-6 py-4">
												{matchedOption
													? matchedOption.optionname
													: "N/A"}
											</td>
											<td className="px-6 py-4">
												{matchedOption
													? matchedOption.sku
													: "N/A"}
											</td>
											<td className="px-6 py-4">
												{incomingDetail
													? incomingDetail.landedcost
													: "N/A"}
											</td>
											<td className="px-6 py-4">
												{incomingDetail
													? incomingDetail.grossprice
													: "N/A"}
											</td>
											<td className="px-6 py-4">
												{item.onhandqty}
											</td>
											<td className="px-6 py-4">
												{item.availableqty}
											</td>
											<td className="px-6 py-4">
												<button
													className="text-blue-500"
													onClick={() =>
														handleAddToDispatch(
															item
														)
													}
												>
													Add to Dispatch
												</button>
											</td>
										</tr>
									);
								}
							)}
						</tbody>
					</table>
				</div>
				<div className="flex justify-between items-center py-4">
					<Pagination>
						<PaginationContent>
							{currentPage > 1 && (
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={() =>
											handlePageChange(currentPage - 1)
										}
									/>
								</PaginationItem>
							)}
							{Array.from({ length: totalPages }, (_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										href="#"
										onClick={() =>
											handlePageChange(index + 1)
										}
										isActive={currentPage === index + 1}
									>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							{currentPage < totalPages && (
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={() =>
											handlePageChange(currentPage + 1)
										}
									/>
								</PaginationItem>
							)}
						</PaginationContent>
					</Pagination>
				</div>
			</div>

			{/* Sidebar */}
			{selectedItems.length > 0 && (
				<section className="relative">
					<div className="w-full ">
						<div className="border border-gray-200 rounded-b-lg p-4 max-w-xl mx-auto lg:max-w-full">
							<h1 className="font-extrabold text-2xl text-center p-4">
								Dispatch Summary
							</h1>
							<div className="px-3">
								{Object.values(
									selectedItems.reduce(
										(acc: any, item: any) => {
											const key = `${item.incoming.product.productname}-${item.incoming.product.brand.brandname}`;
											const matchedOption =
												item.incoming.product.optiondetails.find(
													(opt: any) =>
														opt.optionid ===
														item.optionid
												);

											if (!acc[key]) {
												acc[key] = {
													productname:
														item.incoming.product
															.productname,
													brandname:
														item.incoming.product
															.brand.brandname,
													options: [],
												};
											}

											acc[key].options.push({
												optionid: item.optionid,
												optionname: matchedOption
													? matchedOption.optionname
													: "N/A",
												availableqty: item.availableqty,
												quantity: item.quantity,
												deliverystatus:
													item.deliverystatus,
												soldprice: item.soldprice,
											});

											return acc;
										},
										{}
									)
								).map((groupedItem: any, index) => (
									<div
										key={index}
										className="flex flex-col lg:flex-row items-center py-4 border-b border-gray-200 gap-4 w-full"
									>
										<div className="flex flex-row items-center w-full">
											<div className="">
												<div>
													<h2 className="font-semibold text-lg text-black mb-2">
														{
															groupedItem.productname
														}
													</h2>
													<p className="text-sm text-gray-500 mb-2">
														By:{" "}
														{groupedItem.brandname}
													</p>
													{groupedItem.options.map(
														(
															opt: any,
															optIndex: number
														) => (
															<div
																key={optIndex}
																className="flex items-center mb-2"
															>
																{/* Option Name */}
																<p className="text-sm text-black pr-4 mr-4 border-r border-gray-200">
																	Option:{" "}
																	<span className="text-gray-500">
																		{
																			opt.optionname
																		}
																	</span>
																</p>

																{/* Quantity Button */}
																<div className="flex items-center space-x-1">
																	<button
																		type="button"
																		onClick={() =>
																			handleDecrement(
																				opt.optionid,
																				groupedItem.brandname,
																				groupedItem.productname
																			)
																		}
																		className="shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
																	>
																		<svg
																			className="w-2.5 h-2.5 text-gray-900 dark:text-white"
																			aria-hidden="true"
																			xmlns="http://www.w3.org/2000/svg"
																			fill="none"
																			viewBox="0 0 18 2"
																		>
																			<path
																				stroke="currentColor"
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth="2"
																				d="M1 1h16"
																			/>
																		</svg>
																	</button>
																	<input
																		type="text"
																		value={
																			opt.quantity
																		}
																		onChange={(
																			e
																		) =>
																			handleChange(
																				e,
																				opt.optionid,
																				groupedItem.brandname,
																				groupedItem.productname,
																				opt.availableqty
																			)
																		}
																		className="shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
																		required
																	/>
																	<button
																		type="button"
																		onClick={() =>
																			handleIncrement(
																				opt.optionid,
																				groupedItem.brandname,
																				groupedItem.productname,
																				opt.availableqty
																			)
																		}
																		className="shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
																	>
																		<svg
																			className="w-2.5 h-2.5 text-gray-900 dark:text-white"
																			aria-hidden="true"
																			xmlns="http://www.w3.org/2000/svg"
																			fill="none"
																			viewBox="0 0 18 18"
																		>
																			<path
																				stroke="currentColor"
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth="2"
																				d="M9 1v16M1 9h16"
																			/>
																		</svg>
																	</button>
																	<p className="text-xs text-gray-500">
																		(Max:{" "}
																		{
																			opt.availableqty
																		}
																		)
																	</p>
																</div>

																{/* Sold Price */}
																<input
																	type="number"
																	placeholder="Sold Price"
																	value={
																		opt.soldprice ||
																		""
																	}
																	onChange={(
																		e
																	) => {
																		const updatedPrice =
																			e
																				.target
																				.value;
																		setSelectedItems(
																			(
																				prevItems
																			) =>
																				prevItems.map(
																					(
																						item
																					) =>
																						item.optionid ===
																						opt.optionid
																							? {
																									...item,
																									soldprice:
																										updatedPrice,
																							  }
																							: item
																				)
																		);
																	}}
																	className="ml-4 p-1 text-xs border rounded w-20"
																/>

																{/* Delivery Status */}
																<select
																	value={
																		opt.deliverystatus
																	}
																	onChange={(
																		e
																	) => {
																		const updatedStatus =
																			e
																				.target
																				.value;
																		setSelectedItems(
																			(
																				prevItems
																			) =>
																				prevItems.map(
																					(
																						item
																					) =>
																						item.optionid ===
																						opt.optionid
																							? {
																									...item,
																									deliverystatus:
																										updatedStatus,
																							  }
																							: item
																				)
																		);
																	}}
																	className="text-sm ml-4 p-1 border rounded"
																>
																	<option value="Pending">
																		Pending
																	</option>
																	<option value="Ongoing">
																		Ongoing
																	</option>
																	<option value="Received">
																		Received
																	</option>
																</select>
															</div>
														)
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="flex justify-end">
								<button
									className="bg-black text-white px-4 py-2 rounded-lg mt-4 text-sm"
									onClick={handleSubmit}
								>
									Dispatch
								</button>
							</div>
						</div>
					</div>
				</section>
			)}
		</div>
	);
};

export default Inventory;
