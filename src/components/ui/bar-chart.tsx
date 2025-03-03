"use client";

import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import supabase from "@/config/supabase";

interface SalesData {
	name: string;
	sales: number;
}

const BarChartComponent: React.FC = () => {
	const [data, setData] = useState<SalesData[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data: outgoingData, error } = await supabase
					.from("outgoing")
					.select(
						"deliverystatus, dispatchquantity, soldprice, created_at"
					);

				if (error) throw error;

				const monthlySales: { [key: string]: number } = {};
				const months = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];

				outgoingData
					.filter((item) => item.deliverystatus === "Received") // Only process "Received" deliveries
					.forEach((item) => {
						const month = new Date(item.created_at).getMonth();
						const monthName = months[month];
						const sales = item.dispatchquantity * item.soldprice;

						monthlySales[monthName] =
							(monthlySales[monthName] || 0) + sales;
					});

				const chartData = months.map((month) => ({
					name: month,
					sales: monthlySales[month] || 0,
				}));

				setData(chartData);
			} catch (error) {
				console.error("Error fetching sales data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart
				data={data}
				margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
			>
				<CartesianGrid
					strokeDasharray="3 3"
					vertical={false}
					stroke="#E5E7EB"
				/>
				<XAxis
					dataKey="name"
					tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
					axisLine={{ stroke: "#D1D5DB" }}
					tickLine={false}
				/>
				<YAxis
					tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
					axisLine={{ stroke: "#D1D5DB" }}
					tickLine={false}
				/>
				<Tooltip />
				<Legend />
				<defs>
					<linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="0%"
							stopColor="#1F2937"
							stopOpacity={0.8}
						/>
						<stop
							offset="100%"
							stopColor="#4B5563"
							stopOpacity={0.8}
						/>
					</linearGradient>
				</defs>
				<Bar
					dataKey="sales"
					fill="url(#barColor)"
					radius={[8, 8, 0, 0]}
					barSize={50}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default BarChartComponent;
