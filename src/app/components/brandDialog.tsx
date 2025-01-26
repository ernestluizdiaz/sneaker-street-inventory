"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import supabase from "@/config/supabase";
import { useToast } from "@/hooks/use-toast";

const BrandDialog = ({
	brand,
}: {
	brand: { brandname: string; brandcode: string } | null;
}) => {
	const [name, setName] = useState(brand ? brand.brandname : "");
	const [brandCode, setBrandCode] = useState(brand ? brand.brandcode : "");
	const [errorMessage, setErrorMessage] = useState("");
	const [isBrandExisting, setIsBrandExisting] = useState(false);

	const { toast } = useToast();

	useEffect(() => {
		if (brand) {
			setName(brand.brandname);
			setBrandCode(brand.brandcode);
		}
	}, [brand]);

	const checkIfBrandExists = async (brandName: string) => {
		if (brandName) {
			const query = supabase
				.from("brands")
				.select("brandname")
				.eq("brandname", brandName);

			// Exclude the current brand from the check
			if (brand && brand.brandcode) {
				query.not("brandcode", "eq", brand.brandcode);
			}

			const { data, error } = await query.single();

			if (data) {
				setIsBrandExisting(true);
				setErrorMessage(`Brand "${data.brandname}" already exists`);
			} else {
				setIsBrandExisting(false);
				setErrorMessage("");
			}
		}
	};

	useEffect(() => {
		checkIfBrandExists(name);
	}, [name]);

	const handleSubmit = async () => {
		if (!name || !brandCode) {
			toast({
				title: "Error",
				description: "Please fill in both fields.",
				variant: "destructive",
			});
			return;
		}

		const action = brand ? "update" : "add";
		const { data, error } = brand
			? await supabase
					.from("brands")
					.update({ brandname: name, brandcode: brandCode })
					.eq("brandcode", brand.brandcode)
			: await supabase
					.from("brands")
					.insert([{ brandname: name, brandcode: brandCode }]);

		if (error) {
			toast({
				title: "Error",
				description: `Error ${
					action === "update" ? "updating" : "adding"
				} brand.`,
				variant: "destructive",
			});
		} else {
			toast({
				title: "Success",
				description: `Brand ${
					action === "update" ? "updated" : "added"
				} successfully!`,
				variant: "default",
			});
			setName("");
			setBrandCode("");

			setTimeout(() => {
				window.location.reload();
			}, 1500);
		}
	};

	return (
		<div>
			<div className="space-y-4 mb-4">
				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="brand-name">
						Brand Name
					</Label>
					<input
						id="brand-name"
						type="text"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter brand name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				{isBrandExisting && (
					<p className="text-red-500 text-sm">{errorMessage}</p>
				)}

				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="brand-code">
						Brand Code
					</Label>
					<input
						id="brand-code"
						type="text"
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter brand code"
						value={brandCode}
						onChange={(e) => setBrandCode(e.target.value)}
					/>
				</div>
			</div>

			<DialogFooter className="flex justify-end">
				<Button onClick={handleSubmit} disabled={isBrandExisting}>
					{brand ? "Update Brand" : "Add Brand"}
				</Button>
			</DialogFooter>
		</div>
	);
};

export default BrandDialog;
