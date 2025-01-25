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

const OptionDialog = () => {
	// State for the form fields
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");

	return (
		<div>
			<div className="space-y-4 mb-4">
				{/* Brand Name with Textbox */}
				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="brand-name">
						Option Name
					</Label>
					<input
						id="brand-name"
						type="text"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter brand name"
					/>
				</div>

				{/* Brand Code with Textbox */}
				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="brand-code">
						Description
					</Label>
					<textarea
						id="brand-code"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter description"
						rows={4} // You can adjust the number of rows as needed
					/>
				</div>
			</div>
		</div>
	);
};

export default OptionDialog;
