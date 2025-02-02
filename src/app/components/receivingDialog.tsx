"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { fetchProducts } from "../scripts/fetchProducts";
import supabase from "@/config/supabase";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface IncomingDialogProps {
	incoming: any;
}

const receivingDialog = ({ incoming }: IncomingDialogProps) => {
	interface Product {
		productid: any;
		productname: any;
		optiondetails: any;
	}

	const [products, setProducts] = useState<Product[]>([]);
	const [options, setOptions] = useState<any[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<string>(""); // Store selected product name
	const [selectedOptions, setSelectedOptions] = useState<any[]>([]); // Store selected options
	const [selectedSKU, setSelectedSKU] = useState<string>("");
	const [incomingDetails, setIncomingDetails] = useState<any>({}); // Object to store incoming details
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // State to manage dropdown open/close
	const [incomingDetailsMap, setIncomingDetailsMap] = useState<{
		[key: string]: any;
	}>({});
	const { toast } = useToast();

	// Fetch products on component mount and set the products state with the data
	useEffect(() => {
		fetchProducts().then((data) => {
			setProducts(data);
		});
	}, []);

	// If product selected, display the Options
	const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const productName = e.target.value;
		console.log("Selected Product Name:", productName);

		// Find the selected product by name
		const selectedProduct = products.find(
			(product) => product.productname === productName
		);

		// If a product is selected, update the options state and log optiondetails
		if (selectedProduct) {
			console.log(
				"Option Details for Product Name:",
				productName,
				selectedProduct.optiondetails
			);
			setOptions(selectedProduct.optiondetails); // Update the options state
			setSelectedProduct(selectedProduct.productname); // Set the selected product name
			setSelectedOptions([]); // Reset selected options when product changes
			console.log("Selected Product:", selectedProduct.productname);

			// Update incoming details with the corresponding productid
			setIncomingDetails({
				...incomingDetails,
				productid: selectedProduct.productid,
				productname: selectedProduct.productname,
			});
		} else {
			console.log("Product not found");
		}
	};

	// If Option selected, display the SKU
	const handleOptionChange = (optionId: any) => {
		const selectedOption = options.find(
			(option) => option.optionid === optionId
		);

		if (selectedOption) {
			const isSelected = selectedOptions.includes(optionId);
			const newSelectedOptions = isSelected
				? selectedOptions.filter((id) => id !== optionId)
				: [...selectedOptions, optionId];

			setSelectedOptions(newSelectedOptions);
			console.log("Selected Options:", newSelectedOptions);

			// Update the selected SKU for each option, ensuring it's stored individually for each option
			const newSelectedSKUs = newSelectedOptions.reduce(
				(acc: any, optionId) => {
					const option = options.find(
						(opt) => opt.optionid === optionId
					);
					if (option) {
						acc[optionId] = option.sku; // Store SKU for each selected option
					}
					return acc;
				},
				{}
			);

			setSelectedSKU(newSelectedSKUs); // Update selected SKUs with the new structure

			// Update incoming details to include selected option names and their respective SKUs
			const newOptionNames = newSelectedOptions.map(
				(id) =>
					options.find((option) => option.optionid === id)?.optionname
			);
			setIncomingDetails((prevDetails: any) => ({
				...prevDetails,
				optionname: newOptionNames.join(", "), // Join option names for display
				sku: Object.values(newSelectedSKUs).join(", "), // Ensure only one SKU per data entry
			}));
		}
	};

	useEffect(() => {
		if (incoming) {
			console.log("This data:", incoming);
			setSelectedProduct(incoming.product.productname); // Pre-fill the product name

			// Pre-fill the selected options
			const selectedOptionIds = incoming.incomingdetails.map(
				(detail: { optionid: any }) => detail.optionid
			);
			setSelectedOptions(selectedOptionIds);

			setIncomingDetails({
				...incoming,
				deliverystatus: incoming.deliverystatus || "Pending",
			});

			// Find the selected product correctly
			const selectedProduct = products.find(
				(product) =>
					product.productname === incoming.product.productname
			);

			if (selectedProduct) {
				setOptions(selectedProduct.optiondetails);

				// Ensure selected options are updated
				if (selectedOptionIds.length === 0) {
					const defaultOption = selectedProduct.optiondetails.find(
						(option: { optionid: any }) =>
							option.optionid ===
							incoming.incomingdetails[0]?.optionid
					);
					setSelectedOptions(
						defaultOption ? [defaultOption.optionid] : []
					);
				}

				// Update the selected SKU for each option and pre-fill the sku
				const selectedSKUs = incoming.incomingdetails.reduce(
					(acc: any, detail: any) => {
						acc[detail.optionid] = detail.sku;
						return acc;
					},
					{}
				);
				setSelectedSKU(selectedSKUs);
			}

			// Pre-fill the supplier cost, incoming qty, landed cost, and gross price
			const detailsMap: { [key: string]: any } = {};
			incoming.incomingdetails.forEach((detail: any) => {
				detailsMap[detail.optionid] = {
					suppliercost: detail.suppliercost || "",
					incomingqty: detail.incomingqty || "",
					landedcost: detail.landedcost || "",
					grossprice: detail.grossprice || "",
				};
			});
			setIncomingDetailsMap(detailsMap);
		}
	}, [incoming, products]);

	const handleSubmit = async () => {
		const incomingData = {
			productid: incomingDetails.productid,
			remarks: (document.getElementById("remarks") as HTMLTextAreaElement)
				?.value,
			eta: (document.getElementById("date") as HTMLInputElement)?.value,
			deliverystatus: (
				document.getElementById("deliverystatus") as HTMLSelectElement
			)?.value,
			incomingdetails: selectedOptions.map((optionId) => {
				const option = options.find((opt) => opt.optionid === optionId); // Get the option object
				return {
					productname: selectedProduct,
					optionid: optionId,
					optionname: option ? option.optionname : "", // Option name for each selected option
					sku: selectedSKU[optionId], // Pass SKU for the selected option
					suppliercost: (
						document.getElementById(
							`suppliercost-${optionId}`
						) as HTMLInputElement
					)?.value,
					incomingqty: (
						document.getElementById(
							`incomingqty-${optionId}`
						) as HTMLInputElement
					)?.value,
					grossprice: (
						document.getElementById(
							`grossprice-${optionId}`
						) as HTMLInputElement
					)?.value,
					landedcost: (
						document.getElementById(
							`landedcost-${optionId}`
						) as HTMLInputElement
					)?.value,
				};
			}),
		};

		try {
			if (incomingDetails.incomingid) {
				// Update existing product
				const { data, error } = await supabase
					.from("incoming")
					.update(incomingData)
					.eq("incomingid", incomingDetails.incomingid);

				if (error) {
					throw error;
				}

				toast({
					title: "Success",
					description: "Incoming product updated successfully",
					variant: "default",
				});

				// Wait for the toast to be shown before reloading
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			} else {
				// Insert new product
				const { data, error } = await supabase
					.from("incoming")
					.insert([incomingData]);

				if (error) {
					// Show error toast if insert fails
					toast({
						title: "Error",
						description: "Error adding incoming product",
						variant: "destructive",
					});
					return; // Exit the function if there's an error
				}

				// Show success toast only if insert succeeds
				toast({
					title: "Success",
					description: "Product added successfully",
					variant: "default",
				});

				// Wait for the toast to be shown before reloading
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			// Catch and display any other errors
			console.error("Error handling product:", error); // Log the actual error
			toast({
				title: "Error",
				description:
					(error as Error).message ||
					"Error handling incoming product",
				variant: "destructive",
			});
		}
	};

	const selectedOptionNames = options
		.filter((option) => selectedOptions.includes(option.optionid))
		.map((option) => option.optionname)
		.join(", ");

	return (
		<div>
			<div className="space-y-4 mb-4">
				{/* Remarks */}
				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="remarks">
						Remarks
					</Label>
					<textarea
						id="remarks"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter remarks"
						rows={4}
						defaultValue={incomingDetails.remarks || ""}
					></textarea>
				</div>

				{/* ETA and Delivery Status Side by Side */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 w-full">
					{/* ETA Input */}
					<div className="flex-1">
						<Label className="font-bold" htmlFor="date">
							ETA
						</Label>
						<input
							type="date"
							id="date"
							className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
							defaultValue={incomingDetails.eta || ""}
						/>
					</div>

					{/* Delivery Status Dropdown */}
					<div className="flex-1">
						<Label className="font-bold" htmlFor="status">
							Delivery Status
						</Label>
						<select
							id="deliverystatus"
							className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
							value={incomingDetails.deliverystatus || "Pending"} // Set the value dynamically
							onChange={(e) => {
								setIncomingDetails({
									...incomingDetails,
									deliverystatus: e.target.value,
								});
							}}
						>
							<option value="Pending">Pending</option>
							<option value="Ongoing">Ongoing</option>
							<option value="Received">Received</option>
						</select>
					</div>
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
							Supplier Cost
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
					<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
						{/* Item Selection */}
						<td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
							<select
								className="w-full p-2 border rounded-md text-sm bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
								value={selectedProduct || ""}
								onChange={handleProductChange}
							>
								<option value="" disabled>
									Select Item
								</option>
								{products.map((product) => (
									<option
										key={product.productid}
										value={product.productname}
									>
										{product.productname}
									</option>
								))}
							</select>
						</td>

						{/* Option Selection */}
						<td className="px-6 py-4">
							<div className="relative w-full">
								<button
									onClick={() =>
										setIsDropdownOpen(!isDropdownOpen)
									}
									className="w-full text-left p-2 border rounded-md bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
								>
									{selectedOptionNames.length > 0
										? selectedOptionNames
										: "Select Options"}
								</button>
								{isDropdownOpen && (
									<div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-10 mt-1 dark:bg-gray-700 dark:border-gray-600">
										{options.map((option) => (
											<div
												key={option.optionid}
												className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
											>
												<input
													type="checkbox"
													id={`option-${option.optionid}`}
													checked={selectedOptions.includes(
														option.optionid
													)}
													onChange={() =>
														handleOptionChange(
															option.optionid
														)
													}
													className="mr-2 rounded-sm border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
												/>
												<label
													htmlFor={`option-${option.optionid}`}
													className="text-sm text-gray-900 dark:text-white"
												>
													{option.optionname}
												</label>
											</div>
										))}
									</div>
								)}
							</div>
						</td>

						{/* SKU  */}
						<td className="px-6 py-4">
							{selectedOptions.length > 0
								? selectedOptions.map((optionId) => {
										const sku =
											selectedSKU[optionId] || "No SKU"; // Ensure a default value
										return (
											<div key={optionId}>
												<span>{sku}</span>
											</div>
										);
								  })
								: "Select Option"}
						</td>

						{/* Supplier Cost */}
						<td className="px-6 py-4">
							{selectedOptions.map((optionId) => {
								const selectedOption = options.find(
									(option) => option.optionid === optionId
								);
								return (
									<input
										key={`suppliercost-${optionId}`}
										id={`suppliercost-${optionId}`}
										value={
											incomingDetailsMap[optionId]
												?.suppliercost || ""
										}
										onChange={(e) =>
											setIncomingDetailsMap((prev) => ({
												...prev,
												[optionId]: {
													...prev[optionId],
													suppliercost:
														e.target.value,
												},
											}))
										}
										type="number"
										placeholder={`Supplier Cost for ${
											selectedOption?.optionname ||
											optionId
										}`}
										className="w-full p-2 mb-1 border rounded-md text-sm bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
									/>
								);
							})}
						</td>

						{/* Incoming QTY */}
						<td className="px-6 py-4">
							{selectedOptions.map((optionId) => {
								const selectedOption = options.find(
									(option) => option.optionid === optionId
								);
								return (
									<input
										key={`incomingqty-${optionId}`}
										id={`incomingqty-${optionId}`}
										value={
											incomingDetailsMap[optionId]
												?.incomingqty || ""
										}
										onChange={(e) =>
											setIncomingDetailsMap((prev) => ({
												...prev,
												[optionId]: {
													...prev[optionId],
													incomingqty: e.target.value,
												},
											}))
										}
										type="number"
										placeholder={`Incoming QTY for ${
											selectedOption?.optionname ||
											optionId
										}`}
										required
										className="w-full p-2 mb-1 border rounded-md text-sm bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
									/>
								);
							})}
						</td>

						{/* Landed Cost */}
						<td className="px-6 py-4">
							{selectedOptions.map((optionId) => {
								const selectedOption = options.find(
									(option) => option.optionid === optionId
								);
								return (
									<input
										key={`landedcost-${optionId}`}
										id={`landedcost-${optionId}`}
										value={
											incomingDetailsMap[optionId]
												?.landedcost || ""
										}
										onChange={(e) =>
											setIncomingDetailsMap((prev) => ({
												...prev,
												[optionId]: {
													...prev[optionId],
													landedcost: e.target.value,
												},
											}))
										}
										type="number"
										placeholder={`Landed Cost for ${
											selectedOption?.optionname ||
											optionId
										}`}
										className="w-full p-2 mb-1 border rounded-md text-sm bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
									/>
								);
							})}
						</td>

						{/* Gross Price */}
						<td className="px-6 py-4">
							{selectedOptions.map((optionId) => {
								const selectedOption = options.find(
									(option) => option.optionid === optionId
								);
								return (
									<input
										key={`grossprice-${optionId}`}
										id={`grossprice-${optionId}`}
										value={
											incomingDetailsMap[optionId]
												?.grossprice || ""
										}
										onChange={(e) =>
											setIncomingDetailsMap((prev) => ({
												...prev,
												[optionId]: {
													...prev[optionId],
													grossprice: e.target.value,
												},
											}))
										}
										type="number"
										placeholder={`Gross Price for ${
											selectedOption?.optionname ||
											optionId
										}`}
										className="w-full p-2 mb-1 border rounded-md text-sm bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
									/>
								);
							})}
						</td>
					</tr>
				</tbody>
			</table>

			<DialogFooter className="flex justify-end mt-4">
				<Button onClick={handleSubmit}>
					{incoming ? "Edit Incoming" : "Add Incoming"}
				</Button>
			</DialogFooter>
		</div>
	);
};

export default receivingDialog;
