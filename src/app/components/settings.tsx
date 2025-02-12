"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Profile from "@/../public/img/profile.png";

const Settings = () => {
	const [activeTab, setActiveTab] = useState("account");

	return (
		<div className="px-3 sm:px-6 lg:px-12">
			<div className="flex space-x-4">
				<h1 className="font-extrabold text-2xl py-8 sm:pl-3 pl-0">
					Settings
				</h1>
			</div>
			<div>
				{/* Tabs */}
				<div className="ml-10 space-x-8 border-b border-gray-300">
					{["account", "teams"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`pb-2 font-bold text-sm transition-all ${
								activeTab === tab
									? "text-black border-b-2 border-black"
									: "text-gray-500"
							}`}
						>
							<Link href="#">
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</Link>
						</button>
					))}
				</div>

				{/* Account Settings */}
				{activeTab === "account" && (
					<div className="mt-6 bg-white p-6 mx-auto max-w-[85rem]">
						{/* Account Info */}
						<div className="flex flex-col md:flex-row md:gap-40 gap-10">
							{/* Personal Info */}
							<div className="md:w-1/3">
								<h2 className="font-bold text-lg ">
									Personal Information
								</h2>
								<p className="text-gray-600 text-sm">
									Use a permanent address where you can
									receive mail.
								</p>
							</div>

							{/* Personal Info Input */}
							<div className="md:w-2/3">
								<div className="flex items-center space-x-8 mb-6">
									<Image
										src={Profile}
										alt="Add Icon"
										width={100}
										height={100}
										className="rounded-full"
									/>
									<div>
										<button className="bg-gray-200 p-2 font-bold rounded-lg text-sm">
											Change Avatar
										</button>
										<p className="text-sm pt-2">
											JPG or PNG. 5MB Max
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											First Name
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Last Name
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700">
											Username
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700">
											Email Address
										</label>
										<input
											type="email"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
										/>
									</div>
								</div>
								<div className="flex justify-end">
									<button className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm  ">
										Save
									</button>
								</div>
							</div>
						</div>
						{/* Password Settings */}
						<div className="w-full border-t border-gray-300 my-6 pt-6">
							<div className="flex flex-col md:flex-row md:gap-40 gap-10">
								{/* Change Password */}
								<div className="md:w-1/3">
									<h2 className="font-bold text-lg ">
										Change Password
									</h2>
									<p className="text-gray-600 text-sm">
										Update your password associated with
										your account.
									</p>
								</div>

								{/* Change Password Input */}
								<div className="md:w-2/3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="md:col-span-2">
											<label className="block text-sm font-medium text-gray-700">
												Current Passowrd
											</label>
											<input
												type="password"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm font-medium text-gray-700">
												New Password
											</label>
											<input
												type="password"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm font-medium text-gray-700">
												Confirm New Password
											</label>
											<input
												type="password"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											/>
										</div>
									</div>
									<div className="flex justify-end">
										<button className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm  ">
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === "teams" && (
					<div className="mt-6 bg-white p-6 mx-auto max-w-[85rem]">
						{/* Register Team */}
						<div className="flex flex-col md:flex-row md:gap-40 gap-10">
							{/* Team Member Info */}
							<div className="md:w-1/3">
								<h2 className="font-bold text-lg ">
									Team Member Information
								</h2>
								<p className="text-gray-600 text-sm">
									Create an account to manage the roles and
									access levels of your team members.
								</p>
							</div>

							{/* Team Member Input */}
							<div className="md:w-2/3">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											First Name
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Last Name
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700">
											Email Address
										</label>
										<input
											type="email"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700">
											Role
										</label>
										<select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
											<option value="admin">Admin</option>
											<option value="manager">
												Manager
											</option>
											<option value="sales">Sales</option>
										</select>
									</div>
								</div>

								<div className="flex justify-end">
									<button className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm  ">
										Create an account
									</button>
								</div>
							</div>
						</div>

						{/* Roles of the team members */}
						<div className="w-full border-t border-gray-300 my-6 pt-6">
							<div className="flex flex-col md:flex-row md:gap-40 gap-10">
								{/* Team Members List */}
								<div className="md:w-1/3">
									<h2 className="font-bold text-lg ">
										Team Members
									</h2>
									<p className="text-gray-600 text-sm">
										List of team members and their roles.
									</p>
								</div>

								{/* Team Members Table */}
								<div className="md:w-2/3">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th
													scope="col"
													className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
												>
													Name
												</th>
												<th
													scope="col"
													className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
												>
													Email
												</th>
												<th
													scope="col"
													className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
												>
													Role
												</th>
												<th
													scope="col"
													className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
												>
													Edit
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											<tr>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													John Doe
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													john.doe@example.com
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													<select className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
														<option value="admin">
															Admin
														</option>
														<option value="manager">
															Manager
														</option>
														<option value="sales">
															Sales
														</option>
													</select>
												</td>
											</tr>
											<tr>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													Jane Smith
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													jane.smith@example.com
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													Manager
												</td>
											</tr>
											<tr>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													Bob Johnson
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													bob.johnson@example.com
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													Sales
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Settings;
