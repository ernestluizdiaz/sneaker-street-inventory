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
import Brands from "@/app/components/brands";
import Options from "@/app/components/options";
import ProductDialog from "@/app/components/productDialog"; // Import your ProductDialog component
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const products = () => {
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [stockFilter, setStockFilter] = useState("all"); // State to track stock status

	// Handle selection from page size dropdown
	const handleDropdownSelection = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value));
	};

	return (
		<div className="px-3 sm:px-6 lg:px-12">
			{/* Products and Brands Section */}
			<div className="flex flex-col lg:flex-row lg:space-x-4">
				{/* Products */}
				<div className="lg:w-2/3">
					<div className="flex space-x-4">
						<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
							Products
						</h1>
						<Dialog>
							<DialogTrigger asChild>
								<button>
									<Image
										src={AddIcon}
										alt="Add Icon"
										width={18}
										height={18}
									/>
								</button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add Product</DialogTitle>
								</DialogHeader>
								<ProductDialog />
								<DialogFooter>
									<Button type="submit">Save changes</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					{/* Table Section */}
					<div className="relative overflow-x-auto px-3">
						{/* Filter Controls */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 space-y-4 sm:space-y-0">
							<div className="flex items-center space-x-4">
								<select
									value={itemsPerPage}
									onChange={handleDropdownSelection}
									className="text-black bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-black dark:focus:ring-black"
								>
									<option value={5}>Show: 5 items</option>
									<option value={10}>Show: 10 items</option>
									<option value={15}>Show: 15 items</option>
									<option value={20}>Show: 20 items</option>
								</select>
							</div>

							{/* Search Input */}
							<div className="relative">
								<label
									htmlFor="table-search"
									className="sr-only"
								>
									Search
								</label>
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
										Product Name
									</th>
									<th scope="col" className="px-6 py-3">
										Brand
									</th>
									<th scope="col" className="px-6 py-3">
										Option
									</th>
									<th scope="col" className="px-6 py-3">
										Description
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
									<td className="px-6 py-4">
										<a
											href="#"
											className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
										>
											Edit
										</a>
									</td>
								</tr>
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

				{/* Brands and Options */}
				<div className="lg:w-1/3 mt-6 lg:mt-0">
					<div className="pb-6">
						<Brands />
					</div>
					<div>
						<Options />
					</div>
				</div>
			</div>
		</div>
	);
};

export default products;
