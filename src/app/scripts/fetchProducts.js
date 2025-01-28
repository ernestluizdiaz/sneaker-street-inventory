import supabase from "@/config/supabase";

export const fetchProducts = async () => {
	const { data, error } = await supabase.from("products").select(`
      productname,
      brands:brandid(brandname),
      optiondetails
    `); // Include 'optiondetails' in the select statement

	if (error) {
		console.error("Error fetching products:", error);
		return [];
	}

	return data || []; // Ensure data is always an array
};
