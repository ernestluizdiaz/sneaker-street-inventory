"use client";

import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ month: "Jan", sales: 400 },
	{ month: "Feb", sales: 300 },
	{ month: "Mar", sales: 200 },
	{ month: "Apr", sales: 278 },
	{ month: "May", sales: 189 },
	{ month: "Jun", sales: 239 },
	{ month: "Jul", sales: 349 },
];

export const Component = () => {
	return (
		<div className="bg-[#f8f8f8] p-4">
			<h3 className="text-lg font-semibold mb-4">Sales Over Time</h3>
			<div className="w-full h-[300px] md:h-[400px]">
				<ResponsiveContainer>
					<LineChart
						data={data}
						margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="sales"
							stroke="#8884d8"
							strokeWidth={2}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default Component;
