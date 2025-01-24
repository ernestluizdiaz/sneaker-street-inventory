import React from "react";
import DropdownButton from "../scripts/dashboard";

const Dashboard = () => {
	return (
		<div className="px-3 sm:px-6 lg:px-12">
			<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
				Dashboard
			</h1>

			{/* First  Row */}
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
		</div>
	);
};

export default Dashboard;
