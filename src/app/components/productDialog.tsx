import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import supabase from "@/config/supabase";
import { toast } from "@/hooks/use-toast";

interface Brands {
	brandid: number;
	brandname: string;
}

interface Options {
	optionid: number;
	optionname: string;
}

interface ProductDialogProps {
	product: any; // Add the appropriate type for your product object here
}

const ProductDialog = ({ product }: ProductDialogProps) => {
	const [brands, setBrands] = useState<Brands[]>([]);
	const [options, setOptions] = useState<Options[]>([]);
	const [productName, setProductName] = useState<string>("");
	const [sku, setSku] = useState<{ [key: number]: string }>({});
	const [selectedBrand, setSelectedBrand] = useState<number | string>("");
	const [selectedOptions, setSelectedOptions] = useState<{
		[key: number]: boolean;
	}>({});

	const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data: brandData, error: brandError } = await supabase
					.from("brands")
					.select("brandid, brandname");
				if (brandError) throw brandError;
				setBrands(brandData);

				const { data: optionData, error: optionError } = await supabase
					.from("options")
					.select("optionid, optionname");
				if (optionError) throw optionError;
				setOptions(optionData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	// Populate the form with product data when editing
	useEffect(() => {
		if (product) {
			setProductName(product.productname);
			setSelectedBrand(product.brandid);
			const selectedSku: { [key: number]: string } = {};
			const selectedOpt: { [key: number]: boolean } = {};
			product.optiondetails.forEach((option: any) => {
				selectedSku[option.optionid] = option.sku;
				selectedOpt[option.optionid] = true;
			});
			setSku(selectedSku);
			setSelectedOptions(selectedOpt);
		}
	}, [product]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate fields
		if (!productName || !selectedBrand) {
			toast({
				title: "Error",
				description: "Please fill in all fields.",
				variant: "destructive",
			});
			return;
		}

		// Ensure at least one option is selected
		if (
			Object.keys(selectedOptions).filter(
				(key) => selectedOptions[parseInt(key)]
			).length === 0
		) {
			toast({
				title: "Error",
				description: "Please select at least one option.",
				variant: "destructive",
			});
			return;
		}

		// Combine selected options into a JSON object
		const optionDetails = Object.keys(selectedOptions)
			.filter((key) => selectedOptions[parseInt(key)]) // Only include selected options
			.map((key) => ({
				optionid: parseInt(key), // Option ID
				optionname: options.find((o) => o.optionid === parseInt(key))
					?.optionname, // Option name
				sku: sku[parseInt(key)], // SKU for the option
			}));

		// Prepare product data for insertion or update
		const productData = {
			productname: productName, // Product name
			brandid: selectedBrand, // Selected brand ID
			optiondetails: optionDetails, // JSON object containing options and SKUs
		};

		try {
			let response;
			if (product && product.productid) {
				// If editing, update the existing product
				response = await supabase
					.from("products")
					.update(productData)
					.eq("productid", product.productid); // Use the product ID to find the specific product
			} else {
				// If adding a new product, insert it
				response = await supabase
					.from("products")
					.insert([productData]);
			}

			const { data, error } = response;
			if (error) throw error;

			// Success notification and form reset
			toast({
				title: "Success",
				description: product
					? "Product updated successfully!"
					: "Product added successfully!",
				variant: "default",
			});
			setProductName("");
			setSku({});
			setSelectedBrand("");
			setSelectedOptions({});
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error) {
			console.error("Error saving product:", error);
			toast({
				title: "Error",
				description: "Error saving product.",
				variant: "destructive",
			});
		}
	};

	const handleCheckboxChange = (optionId: number) => {
		setSelectedOptions((prevState) => ({
			...prevState,
			[optionId]: !prevState[optionId],
		}));
	};

	const handleSkuChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		optionId: number
	) => {
		setSku((prevState) => ({
			...prevState,
			[optionId]: e.target.value,
		}));
	};

	// Handle "Select All" checkbox change
	const handleSelectAllChange = () => {
		setSelectAll((prevState) => !prevState);
		const newSelectedOptions: { [key: number]: boolean } = {};
		options.forEach((option) => {
			newSelectedOptions[option.optionid] = !selectAll;
		});
		setSelectedOptions(newSelectedOptions);
	};

	useEffect(() => {
		// Synchronize "Select All" checkbox state with individual options
		if (options.length > 0) {
			setSelectAll(
				options.every((option) => selectedOptions[option.optionid])
			);
		}
	}, [selectedOptions, options]);

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
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
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
						value={selectedBrand}
						onChange={(e) => setSelectedBrand(e.target.value)}
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
					>
						<option value="" disabled>
							Select a brand
						</option>
						{brands.map((brand) => (
							<option key={brand.brandid} value={brand.brandid}>
								{brand.brandname}
							</option>
						))}
					</select>
				</div>
			</div>

			<table className="w-full text-sm text-left rtl:text-right text-black dark:text-black">
				<thead className="text-xs text-black bg-[#e5e5e5] dark:bg-gray-700 dark:text-black">
					<tr>
						<th scope="col" className="px-6 py-3">
							<input
								type="checkbox"
								checked={selectAll}
								onChange={handleSelectAllChange}
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
					{options.map((option) => (
						<tr
							key={option.optionid}
							className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
						>
							<td className="px-6 py-4">
								<input
									type="checkbox"
									checked={
										selectedOptions[option.optionid] ||
										false
									}
									onChange={() =>
										handleCheckboxChange(option.optionid)
									}
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full"
								/>
							</td>
							<td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
								{option.optionname}
							</td>
							<td className="px-6 py-4">
								<input
									type="text"
									className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
									value={sku[option.optionid] || ""}
									onChange={(e) =>
										handleSkuChange(e, option.optionid)
									}
									disabled={!selectedOptions[option.optionid]}
									placeholder="Enter SKU"
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<DialogFooter className="mt-4">
				<Button type="submit" onClick={handleSubmit}>
					Submit
				</Button>
			</DialogFooter>
		</div>
	);
};

export default ProductDialog;
