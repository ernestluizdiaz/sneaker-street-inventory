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

const receivingDialog = () => {
	// State for the form fields
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");

	return (
		<div>
			<div className="space-y-4 mb-4">
				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="remarks">
						Remarks
					</Label>
					<textarea
						id="remarks"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter remarks"
						rows={4}
					></textarea>
				</div>

				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="date">
						Date
					</Label>
					<input
						type="date"
						id="date"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
			<table className="w-full text-sm text-left rtl:text-right text-black dark:text-black">
				<thead className="text-xs text-black bg-[#e5e5e5] dark:bg-gray-700 dark:text-black">
					<tr>
						<th scope="col" className="px-6 py-3">
							Item
						</th>
						<th scope="col" className="px-6 py-3">
							Options
						</th>
						<th scope="col" className="px-6 py-3">
							SKU
						</th>
						<th scope="col" className="px-6 py-3">
							Incoming QTY
						</th>
						<th scope="col" className="px-6 py-3">
							Landed Cost (Per Unit)
						</th>
						<th scope="col" className="px-6 py-3">
							Gross Price (Per Unit)
						</th>
					</tr>
				</thead>
				<tbody>
					{/* Example row */}
					<tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
						<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
							<select
								className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
								defaultValue=""
							>
								<option value="" disabled>
									Select Item
								</option>
								<option value="macbook">
									Apple MacBook Pro 17
								</option>
								<option value="ipad">Apple iPad Air</option>
								<option value="iphone">Apple iPhone 14</option>
							</select>
						</td>
						<td className="px-6 py-4">
							<select
								className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
								defaultValue=""
							>
								<option value="" disabled>
									Select Option
								</option>
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</select>
						</td>
						<td className="px-6 py-4">MBP-17</td>
						<td className="px-6 py-4">
							<input
								type="number"
								className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
							/>
						</td>
						<td className="px-6 py-4">
							<input
								type="number"
								className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
							/>
						</td>
						<td className="px-6 py-4">
							<input
								type="number"
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

export default receivingDialog;
