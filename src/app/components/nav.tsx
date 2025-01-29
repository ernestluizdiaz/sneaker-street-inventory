"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/img/logo.png";
import { useRouter } from "next/navigation";
import supabase from "@/config/supabase";

export default function Nav() {
	const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isUserMenuOpen, setUserMenuOpen] = useState(false);
	const router = useRouter();
	// Toggle mobile menu
	const handleMobileMenuToggle = () => {
		setMobileMenuOpen(!isMobileMenuOpen);
	};

	// Toggle user menu
	const handleUserMenuToggle = () => {
		setUserMenuOpen(!isUserMenuOpen);
	};

	// useEffect to handle adding font-bold class to active links
	useEffect(() => {
		const links = document.querySelectorAll("a[href]");

		// Set the default link (Dashboard) to have the font-bold class on page load
		links.forEach((link) => {
			if (link.textContent?.trim() === "Dashboard") {
				link.classList.add("font-bold");
			}

			link.addEventListener("click", () => {
				// Remove font-bold class from all links
				links.forEach((item) => item.classList.remove("font-bold"));
				// Add font-bold class to the clicked link
				link.classList.add("font-bold");
			});
		});

		// Make the Dashboard link bold when the logo is clicked
		const logoLink = document.querySelector('a[href="/dashboard"]');
		if (logoLink) {
			logoLink.addEventListener("click", () => {
				// Remove font-bold class from all links
				links.forEach((item) => item.classList.remove("font-bold"));
				// Add font-bold class to the Dashboard link
				const dashboardLink = Array.from(links).find(
					(link) => link.textContent?.trim() === "Dashboard"
				);
				if (dashboardLink) {
					dashboardLink.classList.add("font-bold");
				}
			});
		}

		// Cleanup event listeners on unmount
		return () => {
			links.forEach((link) => {
				link.removeEventListener("click", () => {});
			});
		};
	}, []); // Empty dependency array to run only once when the component mounts

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/"); // Redirect to login page after sign out
	};

	return (
		<nav className="bg-black">
			<div className="px-3 sm:px-6 lg:px-12">
				<div className="relative flex h-16 items-center justify-between">
					{/* Mobile Menu Button */}
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						<button
							type="button"
							onClick={handleMobileMenuToggle}
							className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
							aria-controls="mobile-menu"
							aria-expanded={isMobileMenuOpen ? "true" : "false"}
						>
							<span className="sr-only">Open main menu</span>
							<svg
								className={
									isMobileMenuOpen ? "hidden" : "block size-6"
								}
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
							<svg
								className={
									isMobileMenuOpen ? "block size-6" : "hidden"
								}
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Main Content */}
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex shrink-0 items-center">
							<Link
								href="/dashboard"
								className="flex items-center"
							>
								<Image
									className="h-8 w-auto"
									src={Logo}
									alt="Your Company"
									width={100}
									height={100}
								/>
							</Link>
						</div>

						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								<Link
									href="/dashboard"
									className="rounded-md px-3 py-2 text-sm text-white"
									aria-current="page"
								>
									Dashboard
								</Link>
								<Link
									href="/inventory"
									className="rounded-md px-3 py-2 text-sm text-white hover:bg-gray-700 hover:text-white"
								>
									Inventory
								</Link>
								<Link
									href="/incoming"
									className="rounded-md px-3 py-2 text-sm text-white hover:bg-gray-700 hover:text-white"
								>
									Incoming
								</Link>
								<Link
									href="/outgoing"
									className="rounded-md px-3 py-2 text-sm text-white hover:bg-gray-700 hover:text-white"
								>
									Outgoing
								</Link>
								<Link
									href="/products"
									className="rounded-md px-3 py-2 text-sm text-white hover:bg-gray-700 hover:text-white"
								>
									Products
								</Link>
								<Link
									href="#"
									className="rounded-md px-3 py-2 text-sm text-white hover:bg-gray-700 hover:text-white"
								>
									Settings
								</Link>
							</div>
						</div>
					</div>

					{/* User Menu */}
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<h2 className="relative text-white">Hi, Admin</h2>
						<div className="relative ml-3">
							<div>
								<button
									type="button"
									onClick={handleUserMenuToggle}
									className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
									id="user-menu-button"
									aria-expanded={
										isUserMenuOpen ? "true" : "false"
									}
									aria-haspopup="true"
								>
									<span className="absolute -inset-1.5"></span>
									<span className="sr-only">
										Open user menu
									</span>
									<img
										className="w-8 h-8 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt="User Avatar"
									/>
								</button>
							</div>

							<div
								className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden ${
									isUserMenuOpen ? "block" : "hidden"
								}`}
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu-button"
								tabIndex={-1}
							>
								<Link
									href="#"
									className="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-0"
								>
									Your Profile
								</Link>
								<Link
									href="#"
									className="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-1"
								>
									Settings
								</Link>
								<Link
									onClick={handleSignOut}
									className="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-2"
									href={""}
								>
									Sign out
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
				id="mobile-menu"
			>
				<div className="space-y-1 px-2 pt-2 pb-3">
					<Link
						href="/dashboard"
						className="block rounded-md px-3 py-2 text-base font-medium text-white"
						aria-current="page"
					>
						Dashboard
					</Link>
					<Link
						href="/inventory"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Inventory
					</Link>
					<Link
						href="/incoming"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Incoming
					</Link>
					<Link
						href="/outgoing"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Outgoing
					</Link>
					<Link
						href="/products"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Products
					</Link>
					<Link
						href="#"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Settings
					</Link>
				</div>
			</div>
		</nav>
	);
}
