"use client";
import React, { useEffect, useState } from "react";
import { fetchOutgoing } from "../scripts/fetchOutgoing";

interface Brand {
	brandname: string;
}

interface Option {
	optionid: number;
	optionname: string;
	sku: string;
}

interface Product {
	productname: string;
	brand: Brand;
	optiondetails: Option[];
}

interface IncomingDetail {
	optionid: number;
	landedcost: number;
	grossprice: number;
}

interface IncomingItem {
	incomingid: number;
	product: Product;
	incomingdetails: IncomingDetail[];
}

interface OutgoingItem {
	outgoingid: number;
	optionid: number;
	dispatchquantity: number;
	soldprice: number;
	deliverystatus: string;
	date: string;
	incoming: IncomingItem;
}

const Outgoing = () => {
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [stockFilter, setStockFilter] = useState("all");
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [editStatus, setEditStatus] = useState<string>("");
	const [outgoing, setOutgoing] = useState<OutgoingItem[]>([]);

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

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchOutgoing();
			setOutgoing(data);
			console.log(data);
		};
		fetchData();
	}, []);

	const handleEditClick = (index: number, currentStatus: string) => {
		setEditIndex(index);
		setEditStatus(currentStatus);
	};

	const handleStatusChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setEditStatus(event.target.value);
	};

	const handleSaveClick = (index: number) => {
		const updatedOutgoing = [...outgoing];
		updatedOutgoing[index].deliverystatus = editStatus;
		setOutgoing(updatedOutgoing);
		setEditIndex(null);
	};

	return (
		<div className="px-3 sm:px-6 lg:px-12">
			<div>
				<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
					Outgoing
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
								onClick={() => handleStockFilter("pending")}
								className={`px-6 py-2 text-sm font-medium ${
									stockFilter === "pending"
										? "bg-blue-500 text-white"
										: "bg-white text-black"
								} border-r`}
							>
								Pending
							</button>
							<button
								onClick={() => handleStockFilter("ongoing")}
								className={`px-6 py-2 text-sm font-medium ${
									stockFilter === "ongoing"
										? "bg-blue-500 text-white"
										: "bg-white text-black"
								} border-r`}
							>
								Ongoing
							</button>
							<button
								onClick={() => handleStockFilter("received")}
								className={`px-6 py-2 text-sm font-medium ${
									stockFilter === "received"
										? "bg-blue-500 text-white"
										: "bg-white text-black"
								}`}
							>
								Received
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
						/>
					</div>
				</div>

				{/* Table */}
				<table className="w-full text-sm text-left rtl:text-right text-black dark:text-black">
					<thead className="text-xs text-black bg-[#e5e5e5] dark:bg-gray-700 dark:text-black">
						<tr>
							<th scope="col" className="px-6 py-3">
								Outgoing ID
							</th>
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
								Dispatch Qty
							</th>
							<th scope="col" className="px-6 py-3">
								Sold Price
							</th>
							<th scope="col" className="px-6 py-3">
								Status
							</th>
							<th scope="col" className="px-6 py-3">
								Courier
							</th>
							<th>Date</th>

							<th scope="col" className="px-6 py-3">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{outgoing.map((item: OutgoingItem, index: number) => {
							// To find a specific detail object within the incomingdetails array.
							// const outgoingDetail =
							// 	item.incoming.incomingdetails.find(
							// 		(detail: any) =>
							// 			detail.optionid === item.optionid
							// 	);

							const matchedOption =
								item.incoming.product.optiondetails.find(
									(opt: Option) =>
										opt.optionid === item.optionid
								);

							return (
								<tr
									key={item.outgoingid}
									className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
								>
									<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
										{item.outgoingid}
									</td>
									<td className="px-6 py-4">
										{item.incoming.product.productname}
									</td>
									<td className="px-6 py-4">
										{item.incoming.product.brand.brandname}
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
										{item.dispatchquantity}
									</td>
									<td className="px-6 py-4">
										{item.soldprice}
									</td>
									<td className="px-6 py-4">
										{editIndex === index ? (
											<select
												value={editStatus || ""}
												onChange={handleStatusChange}
												className="text-black bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-black dark:focus:ring-black"
											>
												<option value="pending">
													Pending
												</option>
												<option value="ongoing">
													Ongoing
												</option>
												<option value="received">
													Received
												</option>
											</select>
										) : (
											item.deliverystatus || "N/A"
										)}
									</td>
									<td className="px-6 py-4"></td>
									<td>
										{new Date(item.date).toLocaleString(
											"en-US"
										)}
									</td>
									<td className="px-6 py-4">
										{editIndex === index ? (
											<button
												onClick={() =>
													handleSaveClick(index)
												}
											>
												Save
											</button>
										) : (
											<button
												onClick={() =>
													handleEditClick(
														index,
														item.deliverystatus
													)
												}
											>
												Edit
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Pagination */}
			</div>
		</div>
	);
};

export default Outgoing;
