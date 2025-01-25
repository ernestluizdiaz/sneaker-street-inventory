"use client";
import React, { useState } from "react";
import Image from "next/image";
import AddIcon from "@/../public/img/icon.png";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

const outgoing = () => {
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [stockFilter, setStockFilter] = useState("all"); // State to track stock status

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
								onClick={() => handleStockFilter("inStock")}
								className={`px-6 py-2 text-sm font-medium ${
									stockFilter === "inStock"
										? "bg-blue-500 text-white"
										: "bg-white text-black"
								} border-r`}
							>
								Pending
							</button>
							<button
								onClick={() => handleStockFilter("outOfStock")}
								className={`px-6 py-2 text-sm font-medium ${
									stockFilter === "outOfStock"
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
						{/* Example row */}
						<tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
							<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
								Apple MacBook Pro 17"
							</td>
							<td className="px-6 py-4">Silver</td>
							<td className="px-6 py-4">Laptop</td>
							<td className="px-6 py-4">$2999</td>
							<td className="px-6 py-4">123456</td>
							<td className="px-6 py-4">$2500</td>
							<td className="px-6 py-4">$2999</td>
							<td className="px-6 py-4">
								<select
									className="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
									onChange={(e) =>
										console.log(
											`Selected status: ${e.target.value}`
										)
									}
									defaultValue="pending" // Set a default value
								>
									<option value="pending">Pending</option>
									<option value="ongoing">Ongoing</option>
									<option value="received">Received</option>
								</select>
							</td>
							<td className="px-6 py-4">
								<a
									href="#"
									className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
								>
									Edit
								</a>
							</td>
						</tr>
						{/* Add more rows here */}
					</tbody>
				</table>
			</div>
			<div className="flex justify-between items-center py-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">2</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">3</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
};

export default outgoing;
