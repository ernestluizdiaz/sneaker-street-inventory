import supabase from "@/config/supabase";

export const fetchOptions = async () => {
	const { data, error } = await supabase
		.from("options") // Replace with your table name
		.select("optionid, optionname, description");

	if (error) {
		console.error("Error fetching options:", error);
		return [];
	}

	return data;
};
