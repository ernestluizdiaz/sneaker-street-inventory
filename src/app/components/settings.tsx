"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import supabase from "@/config/supabase";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
	const [activeTab, setActiveTab] = useState("account");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// To get the user's metadata
	useEffect(() => {
		const fetchUserMetadata = async () => {
			const { data, error } = await supabase.auth.getUser();
			if (error) {
				console.error("Error fetching user metadata:", error.message);
				return;
			}

			const userMetadata = data.user?.user_metadata || {};

			// Set initial values only once when the component mounts
			setFirstName(userMetadata.firstName || "");
			setLastName(userMetadata.lastName || "");
			setUserName(userMetadata.userName || "");
			setEmail(data.user?.email || "");
			setRole(userMetadata.role || "");
		};

		fetchUserMetadata();
	}, []);

	// To update the user's metadata
	const handleSave = async () => {
		const { data, error } = await supabase.auth.updateUser({
			data: {
				firstName,
				lastName,
				userName,
				role,
			},
		});

		if (error) {
			console.error("Error updating user metadata:", error.message);
			toast({
				title: "Error",
				description: "Failed to update profile.",
				variant: "destructive",
			});
		} else {
			toast({
				title: "Success",
				description: "Profile updated successfully!",
				variant: "default",
			});
			console.log("Updated user metadata:", data);
		}
	};

	// To change the password of the user
	const handleChangePassword = async () => {
		setError(null);
		setSuccess(null);

		if (!currentPassword) {
			setError("Please enter your current password.");
			return;
		}

		if (!newPassword || newPassword !== confirmPassword) {
			setError("New passwords do not match.");
			return;
		}

		const { data: user, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			setError("Failed to retrieve user. Please re-login.");
			return;
		}

		// Step 1: Re-authenticate user
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: user.user.email || "", // Get user's email
			password: currentPassword, // Check current password
		});

		if (signInError) {
			setError("Current password is incorrect.");
			return;
		}

		// Step 2: Update password after successful authentication
		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (updateError) {
			setError(updateError.message);
		} else {
			setSuccess("Password updated successfully.");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		}
	};

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "",
	});

	const [emailError, setEmailError] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		if (name === "email") {
			const emailExists = users.some((user) => user.email === value);
			if (emailExists) {
				setEmailError("Email is already registered.");
			} else {
				setEmailError("");
			}
		}

		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	// Display the list of users
	interface User {
		id: string;
		email: string;
		user_metadata?: {
			firstName?: string;
			lastName?: string;
			role?: string;
		};
	}

	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("/api/getUsers"); // Ensure this returns an array of users
				const data = await response.json();
				setUsers(data.users || []);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	// Submit function for the registration of a new user
	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		const {
			email,
			password,
			confirmPassword,
			firstName,
			lastName,
			userName,
			role,
		} = formData;

		// Check if email already exists
		const emailExists = users.some((user) => user.email === email);
		if (emailExists) {
			toast({
				title: "Error",
				description: "Email is already registered.",
				variant: "destructive",
			});
			return;
		}

		// Password validation
		if (password.length < 8) {
			toast({
				title: "Error",
				description: "Password must be at least 8 characters long.",
				variant: "destructive",
			});
			return;
		}

		if (password !== confirmPassword) {
			toast({
				title: "Error",
				description: "Passwords do not match.",
				variant: "destructive",
			});
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					firstName,
					lastName,
					userName,
					role,
				},
			},
		});

		if (error) {
			console.error("Error signing up:", error.message);
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
			return;
		}

		console.log("User created:", data);
		toast({
			title: "Success",
			description: "User registered successfully!",
			variant: "default",
		});
	};

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
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-bold text-gray-700">
											First Name
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											value={firstName}
											onChange={(e) =>
												setFirstName(e.target.value)
											}
										/>
									</div>
									<div>
										<label className="block text-sm font-bold text-gray-700">
											Last Name
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											value={lastName}
											onChange={(e) =>
												setLastName(e.target.value)
											}
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-bold text-gray-700">
											Username
										</label>
										<input
											type="text"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											value={userName}
											onChange={(e) =>
												setUserName(e.target.value)
											}
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-bold text-gray-700">
											Email Address
										</label>
										<input
											type="email"
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-bold text-gray-700">
											Role
										</label>
										<select
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
											name="role"
											required
											value={role}
											onChange={(e) =>
												setRole(e.target.value)
											}
										>
											<option value="" disabled>
												Select a Role
											</option>
											<option value="Admin">Admin</option>
											<option value="Manager">
												Manager
											</option>
											<option value="Sales">Sales</option>
										</select>
									</div>
								</div>
								<div className="flex justify-end">
									<button
										className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm"
										onClick={handleSave}
									>
										Update Info
									</button>
								</div>
							</div>
						</div>
						{/* Password Settings */}
						<div className="w-full border-t border-gray-300 my-6 pt-6">
							<div className="flex flex-col md:flex-row md:gap-40 gap-10">
								{/* Change Password Section */}
								<div className="md:w-1/3">
									<h2 className="font-bold text-lg">
										Change Password
									</h2>
									<p className="text-gray-600 text-sm">
										Update your password associated with
										your account.
									</p>
								</div>

								{/* Change Password Input Fields */}
								<div className="md:w-2/3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												Current Password
											</label>
											<input
												type="password"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
												value={currentPassword}
												onChange={(e) =>
													setCurrentPassword(
														e.target.value
													)
												}
											/>
											{error && (
												<p className="text-red-500 text-sm mt-2">
													{error}
												</p>
											)}
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												New Password
											</label>
											<input
												type="password"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
												value={newPassword}
												onChange={(e) =>
													setNewPassword(
														e.target.value
													)
												}
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												Confirm New Password
											</label>
											<input
												type="password"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
												value={confirmPassword}
												onChange={(e) =>
													setConfirmPassword(
														e.target.value
													)
												}
											/>
										</div>

										{(newPassword || confirmPassword) && (
											<div className="md:col-span-2">
												<ul>
													<li className="flex items-center py-1">
														<div
															className={`rounded-full p-1 fill-current text-sm ${
																newPassword.length >
																7
																	? "text-green-700"
																	: "text-red-700"
															}`}
														>
															{newPassword.length >
															7 ? (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-green-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
																		clipRule="evenodd"
																	/>
																</svg>
															) : (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-red-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
																		clipRule="evenodd"
																	/>
																</svg>
															)}
														</div>
														<span
															className={`font-medium text-sm ml-3 ${
																newPassword.length >
																7
																	? "text-green-700"
																	: "text-red-700"
															}`}
														>
															{newPassword.length >
															7
																? "The minimum length is reached"
																: "At least 8 characters required"}
														</span>
													</li>
													<li className="flex items-center py-1">
														<div
															className={`rounded-full p-1 fill-current text-sm ${
																newPassword ===
																	confirmPassword &&
																newPassword.length >
																	0
																	? "text-green-700"
																	: "text-red-700"
															}`}
														>
															{newPassword ===
																confirmPassword &&
															newPassword.length >
																0 ? (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-green-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
																		clipRule="evenodd"
																	/>
																</svg>
															) : (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-red-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
																		clipRule="evenodd"
																	/>
																</svg>
															)}
														</div>
														<span
															className={`font-medium text-sm ml-3 ${
																newPassword ===
																	confirmPassword &&
																newPassword.length >
																	0
																	? "text-green-700"
																	: "text-red-700"
															}`}
														>
															{newPassword ===
																confirmPassword &&
															newPassword.length >
																0
																? "Passwords match"
																: "Passwords do not match"}
														</span>
													</li>
												</ul>
											</div>
										)}
									</div>

									{/* Error & Success Messages */}
									{success && (
										<p className="text-green-500 text-sm mt-2">
											{success}
										</p>
									)}

									<div className="flex justify-end">
										<button
											className={`mt-4 px-4 py-2 rounded-lg text-sm ${
												!newPassword ||
												!confirmPassword ||
												newPassword.length < 8 ||
												newPassword !== confirmPassword
													? "bg-gray-300 text-gray-700 cursor-not-allowed"
													: "bg-black text-white"
											}`}
											onClick={handleChangePassword}
											disabled={
												!newPassword ||
												!confirmPassword ||
												newPassword.length < 8 ||
												newPassword !== confirmPassword
											}
										>
											Change Password
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
						<form onSubmit={handleSubmit}>
							<div className="flex flex-col md:flex-row md:gap-40 gap-10">
								{/* Team Member Info */}
								<div className="md:w-1/3">
									<h2 className="font-bold text-lg ">
										Team Member Information
									</h2>
									<p className="text-gray-600 text-sm">
										Create an account to manage the roles
										and access levels of your team members.
									</p>
								</div>

								{/* Team Member Input */}
								<div className="md:w-2/3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-bold text-gray-700">
												First Name
											</label>
											<input
												type="text"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
												name="firstName"
												onChange={handleChange}
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-bold text-gray-700">
												Last Name
											</label>
											<input
												type="text"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
												name="lastName"
												onChange={handleChange}
												required
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												Username
											</label>
											<input
												type="text"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
												name="userName"
												onChange={handleChange}
												required
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												Email Address
											</label>
											<input
												type="email"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
												name="email"
												onChange={handleChange}
												required
											/>
											{emailError && (
												<p className="text-red-500 text-xs mt-1">
													{emailError}
												</p>
											)}
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												Password
											</label>
											<input
												type="password"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
												name="password"
												onChange={handleChange}
												required
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												Confirm Password
											</label>
											<input
												type="password"
												name="confirmPassword"
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
												onChange={handleChange}
												required
											/>
										</div>
										{(formData.password ||
											formData.confirmPassword) && (
											<div className="md:col-span-2">
												<ul>
													<li className="flex items-center py-1">
														<div
															className={`rounded-full p-1 fill-current text-sm ${
																formData
																	.password
																	.length > 7
																	? "text-green-700"
																	: "text-red-700"
															}`}
														>
															{formData.password
																.length > 7 ? (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-green-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
																		clipRule="evenodd"
																	/>
																</svg>
															) : (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-red-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
																		clipRule="evenodd"
																	/>
																</svg>
															)}
														</div>
														<span
															className={`font-medium text-sm ml-3 ${
																formData
																	.password
																	.length > 7
																	? "text-green-700"
																	: "text-red-700"
															}`}
														>
															{formData.password
																.length > 7
																? "The minimum length is reached"
																: "At least 8 characters required"}
														</span>
													</li>
													<li className="flex items-center py-1">
														<div
															className={`rounded-full p-1 fill-current text-sm ${
																formData.password ===
																	formData.confirmPassword &&
																formData
																	.password
																	.length > 0
																	? " text-green-700"
																	: " text-red-700"
															}`}
														>
															{formData.password ===
																formData.confirmPassword &&
															formData.password
																.length > 0 ? (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-green-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
																		clipRule="evenodd"
																	/>
																</svg>
															) : (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5 text-red-700"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
																		clipRule="evenodd"
																	/>
																</svg>
															)}
														</div>
														<span
															className={`font-medium text-sm ml-3 ${
																formData.password ===
																	formData.confirmPassword &&
																formData
																	.password
																	.length > 0
																	? "text-green-700"
																	: "text-red-700"
															}`}
														>
															{formData.password ===
																formData.confirmPassword &&
															formData.password
																.length > 0
																? "Passwords match"
																: "Passwords do not match"}
														</span>
													</li>
												</ul>
											</div>
										)}
										<div className="md:col-span-2">
											<label className="block text-sm font-bold text-gray-700">
												Role
											</label>
											<select
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
												name="role"
												onChange={handleChange}
												required
												value={formData.role}
											>
												<option value="" disabled>
													Select a Role
												</option>
												<option value="Admin">
													Admin
												</option>
												<option value="Manager">
													Manager
												</option>
												<option value="Sales">
													Sales
												</option>
											</select>
										</div>
									</div>

									<div className="flex justify-end">
										<button
											type="submit"
											className={`mt-4 px-4 py-2 rounded-lg text-sm ${
												!formData.firstName ||
												!formData.lastName ||
												!formData.userName ||
												!formData.email ||
												!formData.password ||
												!formData.confirmPassword ||
												formData.password.length < 8 ||
												formData.password !==
													formData.confirmPassword ||
												emailError !== ""
													? "bg-gray-300 text-gray-700 cursor-not-allowed"
													: "bg-black text-white"
											}`}
											disabled={
												!formData.firstName ||
												!formData.lastName ||
												!formData.userName ||
												!formData.email ||
												!formData.password ||
												!formData.confirmPassword ||
												formData.password.length < 8 ||
												formData.password !==
													formData.confirmPassword ||
												emailError !== ""
											}
										>
											Create an account
										</button>
									</div>
								</div>
							</div>
						</form>

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
									<table className="min-w-full divide-y divide-gray-200 ">
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
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{users.length > 0 ? (
												users.map((user) => (
													<tr key={user.id}>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
															{user.user_metadata
																?.firstName ||
																"N/A"}{" "}
															{user.user_metadata
																?.lastName ||
																"N/A"}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{user.email}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{user.user_metadata
																?.role || "N/A"}
														</td>
													</tr>
												))
											) : (
												<tr>
													<td
														colSpan={5}
														className="px-6 py-4 text-center text-gray-500"
													>
														No users found.
													</td>
												</tr>
											)}
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
