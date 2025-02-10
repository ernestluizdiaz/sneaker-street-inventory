import supabase from "@/config/supabase";

export const fetchIncoming = async () => {
	const { data, error } = await supabase.from("incoming").select(`
		incomingid,
		eta,
		deliverystatus,
		remarks,
		incomingdetails,
		product:products (
			productname,
			optiondetails,
			brand:brands (
				brandname
			)
		)
	`);

	if (error) {
		console.error("Error fetching incoming items with details:", error);
		return [];
	}

	// Process data to extract SKU only if optionid matches
	return data.map((item) => ({
		...item,
		sku: Array.isArray(item.incomingdetails)
			? item.incomingdetails
					.map((detail) => {
						const matchedOption = item.product?.optiondetails?.find(
							(opt) => opt.optionid === detail.optionid
						);
						return matchedOption ? matchedOption.sku : "N/A";
					})
					.join(", ")
			: "N/A",
		optionname: Array.isArray(item.incomingdetails)
			? item.incomingdetails
					.map((detail) => {
						const matchedOption = item.product?.optiondetails?.find(
							(opt) => opt.optionid === detail.optionid
						);
						return matchedOption ? matchedOption.optionname : "N/A";
					})
					.join(", ")
			: "N/A",
	}));
};
