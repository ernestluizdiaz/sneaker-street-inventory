"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import supabase from "@/config/supabase";
import { useToast } from "@/hooks/use-toast";

const OptionDialog = ({
	option,
}: {
	option: { optionname: string; description: string } | null;
}) => {
	const [name, setName] = useState(option ? option.optionname : "");
	const [description, setDescription] = useState(
		option ? option.description : ""
	);
	const [optionErrorMessage, setOptionErrorMessage] = useState("");
	const [isOptionExisting, setIsOptionExisting] = useState(false);

	const { toast } = useToast();

	useEffect(() => {
		if (option) {
			setName(option.optionname);
			setDescription(option.description);
		}
	}, [option]);

	const checkIfOptionExists = async (optionName: string) => {
		if (optionName) {
			const query = supabase
				.from("options")
				.select("optionname")
				.eq("optionname", optionName);

			// Exclude the current option from the check
			if (option && option.optionname) {
				query.not("optionname", "eq", option.optionname);
			}

			const { data, error } = await query.single();

			if (data) {
				setIsOptionExisting(true);
				setOptionErrorMessage(
					`Option "${data.optionname}" already exists`
				);
			} else {
				setIsOptionExisting(false);
				setOptionErrorMessage("");
			}
		}
	};

	useEffect(() => {
		checkIfOptionExists(name);
	}, [name]);

	const handleSubmit = async () => {
		if (!name || !description) {
			toast({
				title: "Error",
				description: "Please fill in both fields.",
				variant: "destructive",
			});
			return;
		}

		const action = option ? "update" : "add";
		const { data, error } = option
			? await supabase
					.from("options")
					.update({ optionname: name, description: description })
					.eq("optionname", option.optionname)
			: await supabase
					.from("options")
					.insert([{ optionname: name, description: description }]);

		if (error) {
			toast({
				title: "Error",
				description: `Error ${
					action === "update" ? "updating" : "adding"
				} option.`,
				variant: "destructive",
			});
		} else {
			toast({
				title: "Success",
				description: `Option ${
					action === "update" ? "updated" : "added"
				} successfully!`,
				variant: "default",
			});
			setName("");
			setDescription("");

			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	};

	return (
		<div>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="space-y-4 mb-4"
			>
				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="option-name">
						Option Name
					</Label>
					<input
						id="option-name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter option name"
					/>
				</div>

				{optionErrorMessage && (
					<p className="text-red-500 text-sm">{optionErrorMessage}</p>
				)}

				<div className="flex flex-col items-start">
					<Label className="font-bold" htmlFor="description">
						Description
					</Label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full p-1 border mt-1 rounded-md text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter description"
						rows={4}
					/>
				</div>

				<DialogFooter>
					<Button onClick={handleSubmit}>
						{option ? "Update Option" : "Add Option"}
					</Button>
				</DialogFooter>
			</form>
		</div>
	);
};

export default OptionDialog;
