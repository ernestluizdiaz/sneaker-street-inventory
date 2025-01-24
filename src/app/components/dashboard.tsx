"use client";

import React from "react";
import dynamic from "next/dynamic";

const LineChartComponent = dynamic(() => import("@/components/ui/line-chart"), {
	ssr: false, // Disable server-side rendering
});

const DropdownButton = dynamic(() => import("../scripts/dashboard"), {
	ssr: false,
});

const Dashboard = () => {
	return (
		<div className="px-3 sm:px-6 lg:px-12">
			<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
				Dashboard
			</h1>

			{/* First Row */}
			<div className="flex flex-wrap gap-4 sm:pl-3 pl-0">
				{/* First container */}
				<div className="flex-1 sm:w-full md:w-1/3 border border-black rounded-lg p-5 pb-16 bg-[#F8F8F8]">
					<div className="flex items-center justify-between space-x-2">
						<h2 className="font-bold text-md">Total Sales:</h2>
						<DropdownButton label="Total Sales" />
					</div>
					<div className="flex flex-col items-center mt-4">
						<p className="font-extrabold text-3xl">$392,312.00</p>
						<p className="font-extrabold text-md">500 units sold</p>
					</div>
				</div>

				{/* Second container */}
				<div className="flex-1 sm:w-full md:w-1/3 border border-black rounded-lg p-5 pb-16 bg-[#F8F8F8]">
					<div className="flex items-center justify-between space-x-2">
						<h2 className="font-bold text-md">Projected Sales:</h2>
						<DropdownButton label="Projected Sales" />
					</div>
					<div className="flex flex-col items-center mt-4">
						<p className="font-extrabold text-3xl">$392,312.00</p>
						<p className="font-extrabold text-md">500 units sold</p>
					</div>
				</div>

				{/* Third container */}
				<div className="flex-1 sm:w-full md:w-1/3 border border-black rounded-lg p-5 pb-16 bg-[#F8F8F8]">
					<div className="flex items-center justify-between space-x-2">
						<h2 className="font-bold text-md">Total Inventory:</h2>
						<DropdownButton label="Total Inventory" />
					</div>
					<div className="flex flex-col items-center mt-4">
						<p className="font-extrabold text-3xl">$392,312.00</p>
						<p className="font-extrabold text-md">500 units sold</p>
					</div>
				</div>
			</div>

			{/* Second Row */}
			<div className="flex flex-wrap gap-4 sm:pl-3 pl-0 my-8">
				{/* First container */}
				<div className="flex-1 sm:w-full md:w-1/3 min-w-[237px] border border-black rounded-lg p-5 bg-[#F8F8F8]">
					<LineChartComponent />
				</div>

				{/* Second container */}
				<div className="flex-1 sm:w-full md:w-1/3 min-w-[237px] border border-black rounded-lg p-5 bg-[#F8F8F8]">
					<div className="flex items-center justify-between space-x-2">
						<h2 className="font-bold text-md">Recent Sales:</h2>
						<DropdownButton label="Projected Sales" />
					</div>
					<p className="text-xs">You made 265 sales this month.</p>
					<div className="flex flex-col mt-10">
						<div className="flex items-center justify-between space-x-2 mb-4">
							<div className="flex items-center space-x-2">
								<img
									className="w-8 h-8 rounded-full"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt="User Avatar"
								/>
								<p className="font-semibold">Ernest Diaz</p>
							</div>
							<p className="font-semibold">+${"123,321.00"}</p>
						</div>

						<div className="flex items-center justify-between space-x-2">
							<div className="flex items-center space-x-2">
								<img
									className="w-8 h-8 rounded-full"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt="User Avatar"
								/>
								<p className="font-semibold">Ernest Diaz</p>
							</div>
							<p className="font-semibold">+${"123,321.00"}</p>
						</div>
					</div>
				</div>

				{/* Third container */}
				<div className="flex-1 sm:w-full md:w-1/3 min-w-[237px] border border-black rounded-lg p-5 bg-[#F8F8F8]">
					<div className="flex items-center justify-between space-x-2">
						<h2 className="font-bold text-md">Team Sales:</h2>
						<DropdownButton label="Projected Sales" />
					</div>
					<p className="text-xs">Order by most sales this month.</p>
					<div className="flex flex-col mt-10">
						<div className="flex items-centr justify-between space-x-2 mb-4">
							{" "}
							{/* Added mb-4 here for the gap */}
							<div className="flex items-center space-x-2">
								<img
									className="w-8 h-8 rounded-full"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt="User Avatar"
								/>
								<p className="font-semibold">Ernest Diaz</p>
							</div>
							<p className="font-semibold">${"123,321.00"}</p>
						</div>

						<div className="flex items-center justify-between space-x-2">
							<div className="flex items-center space-x-2">
								<img
									className="w-8 h-8 rounded-full"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt="User Avatar"
								/>
								<p className="font-semibold">Ernest Diaz</p>
							</div>
							<p className="font-semibold">${"123,321.00"}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
