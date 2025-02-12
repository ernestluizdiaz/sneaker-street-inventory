import supabase from "@/config/supabase";

export const fetchProducts = async () => {
	const { data, error } = await supabase.from("products").select(`
		productid,
		productname,
		brandid,
		brands:brandid(brandname),
		optiondetails,
		description
	`);

	if (error) {
		console.error("Error fetching products:", error);
		return [];
	}

	// Transform the data to ensure brand name and sku are properly accessible
	const productsWithBrand =
		data?.map((product) => ({
			productid: product.productid,
			productname: product.productname,
			brandid: product.brandid,
			brandname: product.brands?.brandname, // Assign brandname directly from the nested brands object
			optiondetails: product.optiondetails,
			description: product.description,
			sku: product.optiondetails?.sku, // Extract sku from optiondetails
		})) || [];

	return productsWithBrand; // Return the transformed data
};
