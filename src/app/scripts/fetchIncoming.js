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
				brand:brands (
					brandname
				)
			)
		`);

	if (error) {
		console.error("Error fetching incoming items with details:", error);
		return [];
	}

	return data;
};
