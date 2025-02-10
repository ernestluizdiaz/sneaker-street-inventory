import supabase from "@/config/supabase";

export const fetchOutgoing = async () => {
	const { data, error } = await supabase.from("outgoing").select(
		`
			outgoingid,
			inventoryid,
			dispatchquantity, 
			deliverystatus,
			optionid,
			soldprice,
			created_at,
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
			outgoingid: item.outgoingid,
			inventoryid: item.inventoryid,
			optionid: item.optionid,
			dispatchquantity: item.dispatchquantity,
			deliverystatus: item.deliverystatus,
			soldprice: item.soldprice,
			date: item.created_at,
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
