"use client";
import React, { useState, useEffect } from "react";
import { fetchBrands } from "@/app/scripts/fetchBrands";
import Image from "next/image";
import AddIcon from "@/../public/img/icon.png";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import BrandDialog from "@/app/components/brandDialog";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const Brands = () => {
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);
	const [brands, setBrands] = useState<
		{ brandname: string; brandcode: string }[]
	>([]);
	const [editBrand, setEditBrand] = useState<{
		brandname: string;
		brandcode: string;
	} | null>(null);

	const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

	useEffect(() => {
		const loadBrands = async () => {
			const data = await fetchBrands();
			setBrands(data);
		};
		loadBrands();
	}, []);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleEditClick = (brand: {
		brandname: string;
		brandcode: string;
	}) => {
		setEditBrand(brand); // Set the brand to be edited
		setDialogOpen(true); // Open the dialog
	};

	const totalPages = Math.ceil(brands.length / itemsPerPage);
	const paginatedBrands = brands.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<div className="flex items-center space-x-4">
				<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
					Brands
				</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					{" "}
					{/* Control dialog open state */}
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
							<DialogTitle>
								{editBrand ? "Edit Brand" : "Add Brand"}
							</DialogTitle>
						</DialogHeader>
						<BrandDialog brand={editBrand} />
					</DialogContent>
				</Dialog>
			</div>

			<div className="relative overflow-x-auto px-3">
				<table className="w-full text-sm text-left rtl:text-right text-black dark:text-black">
					<thead className="text-xs text-black bg-[#e5e5e5] dark:bg-gray-700 dark:text-black">
						<tr>
							<th scope="col" className="px-6 py-3">
								Brand Name
							</th>
							<th scope="col" className="px-6 py-3">
								Brand Code
							</th>
							<th scope="col" className="px-6 py-3">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedBrands.map((brand) => (
							<tr
								key={brand.brandcode}
								className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
							>
								<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
									{brand.brandname}
								</td>
								<td className="px-6 py-4">{brand.brandcode}</td>
								<td className="px-6 py-4">
									<button
										onClick={() => handleEditClick(brand)} // Handle Edit Click
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										Edit
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex justify-between items-center py-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							{currentPage > 1 ? (
								<PaginationPrevious
									href="#"
									onClick={() =>
										handlePageChange(currentPage - 1)
									}
								/>
							) : (
								<span className="pagination-previous-disabled">
									Previous
								</span>
							)}
						</PaginationItem>
						{[...Array(totalPages)].map((_, index) => (
							<PaginationItem key={index}>
								<PaginationLink
									href="#"
									onClick={() => handlePageChange(index + 1)}
									className={
										currentPage === index + 1
											? "text-blue-500"
											: ""
									}
								>
									{index + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							{currentPage < totalPages ? (
								<PaginationNext
									href="#"
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
								/>
							) : (
								<span className="pagination-next-disabled">
									Next
								</span>
							)}
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</>
	);
};

export default Brands;
