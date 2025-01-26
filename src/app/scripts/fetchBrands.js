import supabase from "@/config/supabase";

export const fetchBrands = async () => {
	const { data, error } = await supabase
		.from("brands") // Replace with your table name
		.select("brandname, brandcode");

	if (error) {
		console.error("Error fetching brands:", error);
		return [];
	}

	return data;
};
