import supabase from "@/config/supabase";

export const fetchProducts = async () => {
	const { data, error } = await supabase.from("products") // Replace with your table name
		.select(`
      productname, 
      brands:brandid(brandname), 
      options:optionid(optionname), 
			sku,
      description
    `); // Use aliases for joined tables

	console.log(data);

	if (error) {
		console.error("Error fetching products:", error);
		return [];
	}

	return data;
};
