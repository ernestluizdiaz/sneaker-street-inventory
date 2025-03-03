"use client";
import { useEffect, useState } from "react";
import React from "react";
import supabase from "@/config/supabase";
import BarChartComponent from "@/components/ui/bar-chart";

const Dashboard = () => {
	// State variables
	const [totalIncome, setTotalIncome] = useState(0);
	const [lastMonthIncome, setLastMonthIncome] = useState(0);
	const [percentageChange, setPercentageChange] = useState(0);
	const [totalOutcome, setTotalOutcome] = useState(0);
	const [totalProfit, setTotalProfit] = useState(0);
	const [outcomePercentageChange, setOutcomePercentageChange] = useState(0);
	const [profitPercentageChange, setProfitPercentageChange] = useState(0);
	const [recentSalesData, setRecentSalesData] = useState<
		{ productName: string; optionName: string; soldPrice: number }[]
	>([]);

	// Function to calculate total income
	const calculateTotalIncome = (
		data: {
			deliverystatus: string;
			soldprice: number;
			dispatchquantity: number;
		}[]
	) => {
		return data
			.filter((item) => item.deliverystatus === "Received")
			.reduce(
				(total, item) => total + item.soldprice * item.dispatchquantity,
				0
			);
	};

	// Function to calculate total outcome
	const calculateTotalOutcome = (
		data: { landedcost: number; incomingqty: number }[]
	) => {
		return data.reduce(
			(total, item) => total + item.incomingqty * item.landedcost,
			0
		);
	};

	// Function to calculate percentage change
	const calculatePercentageChange = (current: number, previous: number) => {
		if (previous === 0) return 100; // If no previous data, assume 100% increase
		return ((current - previous) / previous) * 100;
	};

	const calculateTotalProfit = (
		totalIncome: number,
		totalOutcome: number
	) => {
		return totalIncome - totalOutcome;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch outgoing data
				const { data: outgoingData, error: outgoingError } =
					await supabase
						.from("outgoing")
						.select(
							"deliverystatus, dispatchquantity, soldprice, created_at, incomingid, optionid, inventoryid"
						);

				if (outgoingError) throw outgoingError;

				// Fetch incoming data and details to calculate landed cost and incoming quantity
				const { data: incomingData, error: incomingError } =
					await supabase
						.from("incoming")
						.select("incomingid, incomingdetails, productid");

				if (incomingError) throw incomingError;

				// Fetch product data
				const { data: productsData, error: productsError } =
					await supabase
						.from("products")
						.select("productid, productname");

				if (productsError) throw productsError;

				const { data: optionsData, error: optionsError } =
					await supabase
						.from("options")
						.select("optionid, optionname");

				if (optionsError) throw optionsError;

				// Merge incoming details and product name into outgoing data
				const mergedData = outgoingData.map((outgoingItem) => {
					const incomingItem = incomingData.find(
						(incoming) =>
							incoming.incomingid === outgoingItem.incomingid
					);

					const matchedDetail = incomingItem?.incomingdetails?.find(
						(detail: { optionid: string }) =>
							detail.optionid === outgoingItem.optionid
					);

					// Get product name ussing productid
					const productItem = productsData.find(
						(product) =>
							product.productid === incomingItem?.productid
					);

					const optionItem = optionsData.find(
						(option) => option.optionid === outgoingItem.optionid
					);

					return {
						...outgoingItem,
						incomingDetails: incomingItem || null,
						productid: incomingItem?.productid || null,
						productname: productItem?.productname || "Unknown",
						optionname: optionItem?.optionname || "Unknown",
						landedcost: matchedDetail
							? matchedDetail.landedcost
							: 0,
						incomingqty: matchedDetail
							? matchedDetail.incomingqty
							: 0,
					};
				});
				const recentSalesData = mergedData
					.filter((item) => item.deliverystatus === "Received")
					.sort(
						(a, b) =>
							new Date(b.created_at).getTime() -
							new Date(a.created_at).getTime()
					)
					.map((item) => ({
						productName: item.productname,
						optionName: item.optionname,
						soldPrice: item.soldprice,
					}));

				// Continue with your existing state updates and calculations
				const currentMonth = new Date().getMonth();
				const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

				const currentMonthData = mergedData.filter(
					(item) =>
						new Date(item.created_at).getMonth() === currentMonth
				);
				const lastMonthData = mergedData.filter(
					(item) => new Date(item.created_at).getMonth() === lastMonth
				);

				const currentMonthIncome =
					calculateTotalIncome(currentMonthData);
				const lastMonthIncome = calculateTotalIncome(lastMonthData);
				const totalIncome = calculateTotalIncome(mergedData);

				const currentMonthOutcome =
					calculateTotalOutcome(currentMonthData);
				const lastMonthOutcome = calculateTotalOutcome(lastMonthData);
				const totalOutcome = calculateTotalOutcome(mergedData);

				const currentMonthProfit = calculateTotalProfit(
					currentMonthIncome,
					currentMonthOutcome
				);
				const lastMonthProfit = calculateTotalProfit(
					lastMonthIncome,
					lastMonthOutcome
				);
				const totalProfit = calculateTotalProfit(
					totalIncome,
					totalOutcome
				);

				setTotalIncome(totalIncome);
				setLastMonthIncome(lastMonthIncome);
				setPercentageChange(
					calculatePercentageChange(
						currentMonthIncome,
						lastMonthIncome
					)
				);
				setTotalOutcome(totalOutcome);
				setTotalProfit(totalProfit);

				setOutcomePercentageChange(
					calculatePercentageChange(
						currentMonthOutcome,
						lastMonthOutcome
					)
				);
				setProfitPercentageChange(
					calculatePercentageChange(
						currentMonthProfit,
						lastMonthProfit
					)
				);

				setRecentSalesData(recentSalesData);
				console.log(setRecentSalesData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="px-4 sm:px-6 lg:px-12">
			<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
				Inventory
			</h1>

			{/* First Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:pl-3 pl-0 mb-8	 ">
				{/* Total Income */}
				<div className="bg-white rounded-lg p-6 shadow-md border">
					<div className="flex items-center text-gray-500">
						<svg
							className="w-6 h-6"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								fillRule="evenodd"
								d="M9 15a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm3.8-1.9c.3-.5.7-1 1.2-1.2a1 1 0 0 1 2 0c.5.1.8.4 1.1.7a1 1 0 1 1-1.4 1.4l-.4-.2h-.1a.4.4 0 0 0-.4 0l.4.3a3 3 0 0 1 1.5.9 2 2 0 0 1 .5 1.9c-.3.5-.7 1-1.2 1.2a1 1 0 0 1-2 0c-.4 0-.8-.3-1.2-.7a1 1 0 1 1 1.6-1.3l.3.2h.1a.4.4 0 0 0 .4 0 1 1 0 0 0-.4-.3 3 3 0 0 1-1.5-.9 2 2 0 0 1-.5-2Zm2 .6Zm.5 2.6ZM4 14c.6 0 1 .4 1 1v4a1 1 0 1 1-2 0v-4c0-.6.4-1 1-1Zm3-2c.6 0 1 .4 1 1v6a1 1 0 1 1-2 0v-6c0-.6.4-1 1-1Zm6.5-8c0-.6.4-1 1-1H18c.6 0 1 .4 1 1v3a1 1 0 1 1-2 0v-.8l-2.3 2a1 1 0 0 1-1.3.1l-2.9-2-3.9 3a1 1 0 1 1-1.2-1.6l4.5-3.5a1 1 0 0 1 1.2 0l2.8 2L15.3 5h-.8a1 1 0 0 1-1-1Z"
								clipRule="evenodd"
							></path>
						</svg>
					</div>
					<h2 className="text-gray-600 font-medium mt-2">
						Total Income
					</h2>
					<p className="text-3xl font-bold mt-1">
						${totalIncome.toLocaleString()}
					</p>
					<p className="text-sm mt-2 font-medium flex items-center">
						<span
							className={
								percentageChange >= 0
									? "text-green-600"
									: "text-red-600"
							}
						>
							{percentageChange >= 0 ? "↑" : "↓"}{" "}
							{Math.abs(percentageChange).toFixed(1)}%
						</span>
						<span className="text-gray-500 ml-1">
							vs last month
						</span>
					</p>
				</div>

				{/* Total Outcome */}
				<div className="bg-white rounded-lg p-6 shadow-md border">
					<div className="flex items-center text-gray-500">
						<svg
							className="w-6 h-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 4.5V19c0 .6.4 1 1 1h15M7 10l4 4 4-4 5 5m0 0h-3.2m3.2 0v-3.2"
							/>
						</svg>
					</div>
					<h2 className="text-gray-600 font-medium mt-2">
						Total Outcome
					</h2>
					<p className="text-3xl font-bold mt-1">
						${totalOutcome.toLocaleString()}
					</p>
					<p className="text-sm mt-2 font-medium flex items-center">
						<span
							className={
								outcomePercentageChange >= 0
									? "text-green-600"
									: "text-red-600"
							}
						>
							{outcomePercentageChange >= 0 ? "↑" : "↓"}{" "}
							{Math.abs(outcomePercentageChange).toFixed(1)}%
						</span>
						<span className="text-gray-500 ml-1">
							vs last month
						</span>
					</p>
				</div>

				{/* Total Profit */}
				<div className="bg-white rounded-lg p-6 shadow-md border">
					<div className="flex items-center text-gray-500">
						<svg
							className="w-6 h-6"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M8 17.3a5 5 0 0 0 2.6 1.7c2.2.6 4.5-.5 5-2.3.4-2-1.3-4-3.6-4.5-2.3-.6-4-2.7-3.5-4.5.5-1.9 2.7-3 5-2.3 1 .2 1.8.8 2.5 1.6m-3.9 12v2m0-18v2.2"
							/>
						</svg>
					</div>
					<h2 className="text-gray-600 font-medium mt-2">
						Total Profit
					</h2>
					<p className="text-3xl font-bold mt-1">
						${totalProfit.toLocaleString()}
					</p>

					<p className="text-sm mt-2 font-medium flex items-center">
						<span
							className={
								profitPercentageChange >= 0
									? "text-green-600"
									: "text-red-600"
							}
						>
							{profitPercentageChange >= 0 ? "↑" : "↓"}{" "}
							{Math.abs(profitPercentageChange).toFixed(1)}%
						</span>
						<span className="text-gray-500 ml-1">
							vs last month
						</span>
					</p>
				</div>
			</div>

			{/* Second Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:pl-3 pl-0 ">
				{/* First container */}
				<div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
					<BarChartComponent />
				</div>

				{/* Second container */}
				<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-semibold text-lg">Recent Sales</h2>
					</div>
					<p className="text-xs text-gray-500">
						{recentSalesData.length} sales made this month.
					</p>
					<div className="mt-4">
						{recentSalesData.map((sale, index) => (
							<div
								key={index}
								className="flex items-center justify-between mb-4"
							>
								<div className="flex items-center space-x-2">
									<p className="font-semibold text-lg">
										{sale.productName}
									</p>
									<span className="text-sm text-gray-500">
										({sale.optionName})
									</span>
								</div>
								<p className="font-semibold text-lg text-green-500">
									+${sale.soldPrice.toLocaleString()}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
