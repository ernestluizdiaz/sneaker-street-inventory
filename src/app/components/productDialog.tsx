"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductDialog = () => {
	// State for the form fields
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");

	return (
		<div>
			<div className="flex space-x-4 mb-4">
				<div className="w-1/2">
					<Label className="font-bold" htmlFor="product">
						Product
					</Label>
					<input
						id="product"
						type="text"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter product name"
					/>
				</div>

				<div className="w-1/2">
					<Label className="font-bold" htmlFor="brand">
						Brand
					</Label>
					<select
						id="brand"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						defaultValue=""
					>
						<option value="" disabled>
							Select a brand
						</option>{" "}
						<option value="apple">Apple</option>
						<option value="samsung">Samsung</option>
						<option value="xiaomi">Xiaomi</option>
					</select>
				</div>
			</div>

			<table className="w-full text-sm text-left rtl:text-right text-black dark:text-black">
				<thead className="text-xs text-black bg-[#e5e5e5] dark:bg-gray-700 dark:text-black">
					<tr>
						<th scope="col" className="px-6 py-3">
							<input
								type="checkbox"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full"
							/>
						</th>
						<th scope="col" className="px-6 py-3">
							Option
						</th>
						<th scope="col" className="px-6 py-3">
							SKU
						</th>
					</tr>
				</thead>
				<tbody>
					{/* Example row */}
					<tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
						<td className="px-6 py-4">
							<input
								type="checkbox"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full"
							/>
						</td>
						<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
							Apple MacBook Pro 17"
						</td>
						<td className="px-6 py-4">
							<input
								type="text"
								className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
							/>
						</td>
					</tr>
					{/* Add more rows here */}
				</tbody>
			</table>
		</div>
	);
};

export default ProductDialog;
