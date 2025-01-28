import supabase from "@/config/supabase";

export const fetchProducts = async () => {
	const { data, error } = await supabase.from("products").select(`
      productid,
      productname,
      brandid,
      brands:brandid(brandname),
      optiondetails
    `);

	if (error) {
		console.error("Error fetching products:", error);
		return [];
	}

	// Transform the data to ensure brand name is properly accessible
	const productsWithBrand =
		data?.map((product) => ({
			...product,
			brandname: product.brands?.brandname, // Assign brandname directly from the nested brands object
		})) || [];

	return productsWithBrand; // Return the transformed data
};
