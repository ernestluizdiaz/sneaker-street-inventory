"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { fetchProducts } from "../scripts/fetchProducts";
import supabase from "@/config/supabase";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { parse } from "path";

interface Option {
	optionid: string;
	optionname: string;
	sku: string;
}

interface Product {
	productid: string;
	productname: string;
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

interface IncomingDialogProps {
	incoming?: IncomingItem | null;
}

const ReceivingDialog = ({ incoming }: IncomingDialogProps) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [options, setOptions] = useState<Option[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<string>("");
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [selectedSKU, setSelectedSKU] = useState<{ [key: string]: string }>(
		{}
	);
	const [incomingDetails, setIncomingDetails] = useState<
		Partial<IncomingItem>
	>({});
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [incomingDetailsMap, setIncomingDetailsMap] = useState<
		Record<string, IncomingDetail>
	>({});
	const { toast } = useToast();

	useEffect(() => {
		fetchProducts().then((data) => setProducts(data));
	}, []);

	const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const productName = e.target.value;
		const selectedProduct = products.find(
			(product) => product.productname === productName
		);

		if (selectedProduct) {
			setOptions(selectedProduct.optiondetails);
			setSelectedProduct(selectedProduct.productname);
			setSelectedOptions([]);
			setIncomingDetails((prevDetails) => ({
				...prevDetails,
				product: {
					...(prevDetails.product || {}),
					productid: selectedProduct.productid, // ✅ Corrected
					productname: selectedProduct.productname,
					optiondetails: selectedProduct.optiondetails || [],
				},
			}));
		}
	};

	const handleOptionChange = (optionId: string) => {
		const selectedOption = options.find(
			(option) => option.optionid === optionId
		);
		if (selectedOption) {
			const newSelectedOptions = selectedOptions.includes(optionId)
				? selectedOptions.filter((id) => id !== optionId)
				: [...selectedOptions, optionId];

			setSelectedOptions(newSelectedOptions);

			const newSelectedSKUs = newSelectedOptions.reduce(
				(acc: Record<string, string>, optionId) => {
					const option = options.find(
						(opt) => opt.optionid === optionId
					);
					if (option) {
						acc[optionId] = option.sku;
					}
					return acc;
				},
				{}
			);

			setSelectedSKU(newSelectedSKUs);

			const newOptionNames = newSelectedOptions
				.map(
					(id) =>
						options.find((option) => option.optionid === id)
							?.optionname
				)
				.join(", ");

			setIncomingDetails((prevDetails) => ({
				...prevDetails,
				optionname: newOptionNames,
				sku: Object.values(newSelectedSKUs).join(", "),
			}));
		}
	};

	useEffect(() => {
		if (incoming) {
			setSelectedProduct(incoming.product.productname);

			const selectedOptionIds = incoming.incomingdetails.map(
				(detail) => detail.optionid
			);
			setSelectedOptions(selectedOptionIds);

			setIncomingDetails({
				...incoming,
				deliverystatus: incoming.deliverystatus || "Pending",
			});

			const selectedProduct = products.find(
				(product) =>
					product.productname === incoming.product.productname
			);

			if (selectedProduct) {
				setOptions(selectedProduct.optiondetails);

				if (selectedOptionIds.length === 0) {
					const defaultOption = selectedProduct.optiondetails.find(
						(option) =>
							option.optionid ===
							incoming.incomingdetails[0]?.optionid
					);
					setSelectedOptions(
						defaultOption ? [defaultOption.optionid] : []
					);
				}

				const selectedSKUs = incoming.incomingdetails.reduce(
					(acc: Record<string, string>, detail) => {
						const matchedOption =
							selectedProduct.optiondetails.find(
								(option) => option.optionid === detail.optionid
							);
						acc[detail.optionid] = matchedOption
							? matchedOption.sku
							: "No SKU";
						return acc;
					},
					{}
				);
				setSelectedSKU(selectedSKUs);
			}

			const detailsMap: Record<string, IncomingDetail> = {};
			incoming.incomingdetails.forEach((detail) => {
				detailsMap[detail.optionid] = {
					optionid: detail.optionid,
					suppliercost: detail.suppliercost || 0,
					incomingqty: detail.incomingqty || 0,
					landedcost: detail.landedcost || 0,
					grossprice: detail.grossprice || 0,
				};
			});
			setIncomingDetailsMap(detailsMap);
		}
	}, [incoming, products]);

	const handleSubmit = async () => {
		const incomingData = {
			productid: incomingDetails.product?.productid,
			remarks: (document.getElementById("remarks") as HTMLTextAreaElement)
				?.value,
			eta: (document.getElementById("date") as HTMLInputElement)?.value,
			deliverystatus: (
				document.getElementById("deliverystatus") as HTMLSelectElement
			)?.value,
			incomingdetails: selectedOptions.map((optionId) => ({
				optionid: optionId,
				suppliercost: parseFloat(
					(
						document.getElementById(
							`suppliercost-${optionId}`
						) as HTMLInputElement
					)?.value
				),
				incomingqty: parseFloat(
					(
						document.getElementById(
							`incomingqty-${optionId}`
						) as HTMLInputElement
					)?.value
				),
				grossprice: parseFloat(
					(
						document.getElementById(
							`grossprice-${optionId}`
						) as HTMLInputElement
					)?.value
				),
				landedcost: parseFloat(
					(
						document.getElementById(
							`landedcost-${optionId}`
						) as HTMLInputElement
					)?.value
				),
			})),
		};

		try {
			let transactionSuccessful = false;
			let incomingid = incomingDetails.incomingid; // Store incoming ID

			if (incomingid) {
				// Update existing incoming product
				const { error } = await supabase
					.from("incoming")
					.update(incomingData)
					.eq("incomingid", incomingid);

				if (error) throw error;
				transactionSuccessful = true;
			} else {
				// Insert new incoming product and retrieve its ID
				const { data, error } = await supabase
					.from("incoming")
					.insert([incomingData])
					.select("incomingid") // Get the inserted ID
					.single();

				if (error) throw error;
				incomingid = data.incomingid;
				transactionSuccessful = true;
			}

			if (
				transactionSuccessful &&
				incomingData.deliverystatus === "Received"
			) {
				for (const detail of incomingData.incomingdetails) {
					const { error: inventoryError } = await supabase
						.from("inventory")
						.insert([
							{
								incomingid: incomingid,
								optionid: detail.optionid,
								onhandqty: detail.incomingqty,
								availableqty: detail.incomingqty,
							},
						]);

					if (inventoryError) {
						console.error(
							"Error inserting into inventory:",
							inventoryError
						);
						toast({
							title: "Error",
							description: "Failed to move product to inventory",
							variant: "destructive",
						});
						return;
					}
				}

				toast({
					title: "Product moved to inventory",
					description:
						"Your product has been successfully added to inventory.",
					variant: "default",
				});
			} else {
				toast({
					title: "Success",
					description: "Incoming product updated successfully",
					variant: "default",
				});
			}

			// Wait for the toast to be shown before reloading
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error) {
			console.error("Error handling product:", error);
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
								const selectedStatus = e.target.value;
								setIncomingDetails({
									...incomingDetails,
									deliverystatus: selectedStatus,
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
							Incoming QTY
						</th>
						<th scope="col" className="px-6 py-3">
							Supplier Cost
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
													incomingqty:
														parseFloat(
															e.target.value
														) || 0,
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
													suppliercost: parseFloat(
														e.target.value
													),
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
													landedcost: parseFloat(
														e.target.value
													),
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
													grossprice: parseFloat(
														e.target.value
													),
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

export default ReceivingDialog;
