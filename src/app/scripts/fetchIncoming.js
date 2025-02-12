import supabase from "@/config/supabase";

export const fetchIncoming = async () => {
	const { data, error } = await supabase.from("incoming").select(`
		incomingid,
		eta,
		deliverystatus,
		remarks,
		incomingdetails,
		product:products (
			productid, 
			productname,
			optiondetails,
			brand:brands (
				brandname
			)
		)
	`);

	if (error) {
		console.error("Error fetching incoming items:", error);
		return [];
	}

	// Ensure product includes productid and optiondetails
	return data.map((item) => {
		// Extract SKU and option name by matching optionid from incomingdetails and optiondetails
		const skuList = [];
		const optionNameList = [];

		if (Array.isArray(item.incomingdetails)) {
			item.incomingdetails.forEach((detail) => {
				const matchedOption = item.product?.optiondetails?.find(
					(opt) => opt.optionid === detail.optionid
				);
				if (matchedOption) {
					skuList.push(matchedOption.sku);
					optionNameList.push(matchedOption.optionname);
				}
			});
		}

		return {
			incomingid: item.incomingid,
			eta: item.eta,
			deliverystatus: item.deliverystatus,
			remarks: item.remarks,
			incomingdetails: Array.isArray(item.incomingdetails)
				? item.incomingdetails.map((detail) => ({
						optionid: detail.optionid || "",
						suppliercost: detail.suppliercost || 0,
						landedcost: detail.landedcost || 0,
						incomingqty: detail.incomingqty || 0,
						grossprice: detail.grossprice || 0,
				  }))
				: [],
			sku: skuList.length > 0 ? skuList.join(", ") : "N/A",
			optionname:
				optionNameList.length > 0 ? optionNameList.join(", ") : "N/A",
			product: {
				productid: item.product?.productid ?? "", // Ensure productid exists
				productname: item.product?.productname ?? "Unknown",
				optiondetails: Array.isArray(item.product?.optiondetails)
					? item.product.optiondetails.map((opt) => ({
							optionid: opt.optionid ?? "",
							optionname: opt.optionname ?? "Unknown",
							sku: opt.sku ?? "Unknown",
					  }))
					: [],
				brand: {
					brandname: item.product?.brand?.brandname ?? "Unknown",
				},
			},
		};
	});
};
