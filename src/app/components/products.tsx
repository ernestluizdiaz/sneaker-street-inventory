"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AddIcon from "@/../public/img/icon.png";
import { fetchProducts } from "@/app/scripts/fetchProducts";
import { fetchOptions } from "@/app/scripts/fetchOptions";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import Brands from "@/app/components/brands";
import Options from "@/app/components/options";
import ProductDialog from "@/app/components/productDialog";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type Option = {
	optionid: number;
	description: string;
};

type OptionDetail = {
	sku: string;
	optionid: number;
	optionname: string;
};

type Product = {
	productid: number;
	brandid: number;
	productname: string;
	brandname: string;
	description: string;
	sku: string;
	optiondetails?: OptionDetail[];
};

const Products = () => {
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);
	const [products, setProducts] = useState<Product[]>([]); // State to store products
	const [options, setOptions] = useState<Option[]>([]); // State to store options
	const [editProduct, setEditProduct] = useState<Product | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		// Fetch products on component mount
		const getProducts = async () => {
			const data = await fetchProducts();
			setProducts(data);
		};

		// Fetch options from options table
		const getOptions = async () => {
			const data = await fetchOptions(); // Replace with actual fetch call
			setOptions(data);
		};

		getProducts();
		getOptions();
	}, []);

	const handleEditClick = (product: Product) => {
		setEditProduct(product);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditProduct(null);
	};

	const getDescription = (optionid: number) => {
		const option = options.find((opt) => opt.optionid === optionid);
		return option ? option.description : "No description available";
	};

	// Handle selection from page size dropdown
	const handleDropdownSelection = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value));
		setCurrentPage(1); // Reset to first page
	};

	// Handle search query change
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1); // Reset to first page when search query changes
	};

	// Filter products by search query
	const filteredProducts = products.filter(
		(product) =>
			product.productname
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			String(product.sku)
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	// Calculate total pages
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

	// Paginated products based on current page
	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
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
						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
							<DialogTrigger asChild>
								<button onClick={() => setEditProduct(null)}>
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
										{editProduct
											? "Edit Product"
											: "Add Product"}
									</DialogTitle>
								</DialogHeader>
								<ProductDialog product={editProduct} />
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
									value={searchQuery}
									onChange={handleSearchChange}
									className="block p-2 ps-10 text-sm text-black border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Search for products"
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
								{paginatedProducts.map((product, index) => (
									<tr
										key={index}
										className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
									>
										<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
											{product.productname}
										</td>
										<td className="px-6 py-4">
											{product.brandname}
										</td>
										<td className="px-6 py-4">
											{product.optiondetails &&
												product.optiondetails
													.map(
														(
															detail: OptionDetail
														) => detail.optionname
													)
													.join(", ")}
										</td>

										<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
											{product.description}
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() =>
													handleEditClick(product)
												}
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
												handlePageChange(
													currentPage - 1
												)
											}
										/>
									</PaginationItem>
								)}
								{Array.from(
									{ length: totalPages },
									(_, index) => (
										<PaginationItem key={index}>
											<PaginationLink
												href="#"
												onClick={() =>
													handlePageChange(index + 1)
												}
												isActive={
													currentPage === index + 1
												}
											>
												{index + 1}
											</PaginationLink>
										</PaginationItem>
									)
								)}
								{currentPage < totalPages && (
									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={() =>
												handlePageChange(
													currentPage + 1
												)
											}
										/>
									</PaginationItem>
								)}
							</PaginationContent>
						</Pagination>
					</div>
				</div>

				{/* Brands Section */}
				<div className="lg:w-1/3">
					<Brands />
					<Options />
				</div>
			</div>
		</div>
	);
};

export default Products;
