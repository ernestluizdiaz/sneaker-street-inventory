import supabase from "@/config/supabase";

export const fetchInventory = async () => {
	const { data, error } = await supabase.from("inventory").select(
		`
			inventoryid,
			onhandqty,
			availableqty,
			optionid,
			incoming:incomingid (
				incomingid,
				product:productid (
					productname,
					optiondetails,
					brand:brandid (
						brandname
					)
				),
				incomingdetails
			)
		`
	);

	if (error) {
		console.error("Error fetching inventory:", error);
		return [];
	}

	const mappedData = data
		.map((item) => ({
			inventoryid: item.inventoryid,
			onhandqty: item.onhandqty,
			optionid: item.optionid,
			availableqty: item.availableqty,
			incoming: {
				incomingid: item.incoming.incomingid,
				product: {
					productname: item.incoming.product.productname,
					brand: {
						brandname: item.incoming.product.brand.brandname,
					},
					optiondetails: item.incoming.product.optiondetails,
				},
				incomingdetails: item.incoming.incomingdetails,
			},
		}))
		.flat();

	return mappedData;
};
