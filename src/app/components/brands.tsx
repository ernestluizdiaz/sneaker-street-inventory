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
		{
			brandname: string;
			brandcode: string;
		}[]
	>([]);
	const [editBrand, setEditBrand] = useState<{
		brandname: string;
		brandcode: string;
	} | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const loadBrands = async () => {
			const data = await fetchBrands();
			setBrands(data);
		};
		loadBrands();
	}, []);

	const [isFirstPage, setIsFirstPage] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setIsFirstPage(page === 1);
		setIsLastPage(page === totalPages);
	};

	const handleEditClick = (brand: {
		brandname: string;
		brandcode: string;
	}) => {
		setEditBrand(brand);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditBrand(null);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const handleDropdownSelection = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(parseInt(event.target.value, 10));
		setCurrentPage(1); // Reset to first page when items per page changes
	};

	const filteredBrands = brands.filter(
		(brand) =>
			brand.brandname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			String(brand.brandcode)
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
	const paginatedBrands = filteredBrands.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<div className="flex items-center space-x-4">
				<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
					Brands
				</h1>
				<Dialog
					open={dialogOpen}
					onOpenChange={(open) => {
						setDialogOpen(open);
						if (!open) handleDialogClose();
					}}
				>
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

					<div className="relative">
						<label htmlFor="table-search" className="sr-only">
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
							value={searchQuery}
							onChange={handleSearchChange}
						/>
					</div>
				</div>

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
										onClick={() => handleEditClick(brand)}
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
		</>
	);
};

export default Brands;
