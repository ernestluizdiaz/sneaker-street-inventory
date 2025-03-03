"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AddIcon from "@/../public/img/icon.png";
import { fetchIncoming } from "@/app/scripts/fetchIncoming";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import ReceivingDialog from "@/app/components/receivingDialog";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface Option {
	optionid: string;
	optionname: string;
	sku: string;
}

interface Product {
	productid: string;
	productname: string;
	brand: {
		brandname: string;
	};
	optiondetails: Option[];
}

interface IncomingDetail {
	optionid: string;
	suppliercost: number;
	incomingqty: number;
	landedcost: number;
	grossprice: number;
}

interface IncomingItem {
	optionname: string;
	sku: string;
	product: Product;
	incomingid: string;
	remarks: string;
	eta: string;
	deliverystatus: string;
	incomingdetails: IncomingDetail[];
}

const Incoming = () => {
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [stockFilter, setStockFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [editIncoming, setEditIncoming] = useState<IncomingItem | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [incomingItems, setIncomingItems] = useState<IncomingItem[]>([]); // State to store incoming data

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchIncoming();
			setIncomingItems(data);
			console.log(data);
		};
		fetchData();
	}, []);

	const handleDropdownSelection = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value));
		setCurrentPage(1); // Reset to first page when items per page changes
	};

	const handleStockFilter = (filter: string) => {
		setStockFilter((prevFilter) =>
			prevFilter === filter ? "all" : filter
		);
		setCurrentPage(1); // Reset to first page when filter changes
	};
	const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1); // Reset to first page when search query changes
	};

	const filteredItems = incomingItems.filter((item) => {
		const matchesSearchQuery =
			item.product?.productname
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.product?.brand?.brandname
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.eta?.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStockFilter =
			stockFilter === "all" ||
			item.deliverystatus.toLowerCase() === stockFilter.toLowerCase();

		return matchesSearchQuery && matchesStockFilter;
	});

	const paginatedItems = filteredItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

	function handlePageChange(pageNumber: number) {
		setCurrentPage(pageNumber);
	}

	const handleEditClick = (product: IncomingItem) => {
		setEditIncoming(product);
		setDialogOpen(true);
	};

	return (
		<div className="px-3 sm:px-6 lg:px-12">
			<div className="flex items-center space-x-4">
				<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
					Incoming
				</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<button onClick={() => setEditIncoming(null)}>
							<Image
								src={AddIcon}
								alt="Add Icon"
								width={18}
								height={18}
							/>
						</button>
					</DialogTrigger>
					<DialogContent className="max-w-7xl w-full p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-auto">
						<DialogHeader>
							<DialogTitle>
								{editIncoming
									? "Edit Receiving Incoming"
									: "Receive Incoming"}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<ReceivingDialog incoming={editIncoming} />
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Table Section */}
			<div className="relative overflow-x-auto px-3">
				<div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
					<div className="flex space-x-4 items-center">
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

					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
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
							value={searchQuery}
							onChange={handleSearchQuery}
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
								Incoming ID
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
								Supplier Cost
							</th>
							<th scope="col" className="px-6 py-3">
								ETA
							</th>
							<th scope="col" className="px-6 py-3">
								Delivery Status
							</th>
							<th scope="col" className="px-6 py-3">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedItems.length > 0 ? (
							paginatedItems.map((item) => (
								<tr
									key={item.incomingid}
									className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
								>
									{/* Incoming ID */}
									<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
										{item.incomingid}
									</td>

									{/* Item */}
									<td className="px-6 py-4">
										{item.product?.productname}
									</td>

									{/* Brand */}
									<td className="px-6 py-4">
										{item.product?.brand?.brandname}
									</td>

									{/* Option Name (from optionid) */}
									<td className="px-6 py-4">
										{item.optionname || "N/A"}
									</td>

									{/* SKU */}
									<td className="px-6 py-4">
										{item.sku || "N/A"}
									</td>

									{/* Supplier Cost */}
									<td className="px-6 py-4">
										{item.incomingdetails
											.map((detail) =>
												detail.suppliercost
													? `₱${Number(
															detail.suppliercost
													  ).toLocaleString()}` // Add peso sign before the formatted number
													: ""
											)
											.join(", ")}
									</td>

									{/* ETA */}
									<td className="px-6 py-4">
										{new Date(item.eta).toLocaleDateString(
											"en-US",
											{
												month: "2-digit",
												day: "2-digit",
												year: "2-digit",
											}
										)}
									</td>

									{/* Delivery Status */}
									<td className="px-6 py-4">
										{item.deliverystatus}
									</td>

									<td className="px-6 py-4">
										<a
											href="#"
											onClick={() =>
												handleEditClick(item)
											}
											className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
										>
											Edit
										</a>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={9} className="text-center py-4">
									No data available
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
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
									onClick={() => handlePageChange(index + 1)}
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
	);
};

export default Incoming;
