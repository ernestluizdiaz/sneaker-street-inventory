"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/img/logo.png";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import supabase from "@/config/supabase";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function Nav() {
	const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isUserMenuOpen, setUserMenuOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const [username, setUsername] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getUserMetadata = async () => {
		const { data, error } = await supabase.auth.getUser();

		if (error) {
			console.error("Error fetching user metadata:", error.message);
			return;
		}
		setUsername(data.user?.user_metadata?.userName || "Guest");
	};

	useEffect(() => {
		getUserMetadata();
	}, []);

	const handleMobileMenuToggle = () => {
		setMobileMenuOpen(!isMobileMenuOpen);
	};

	useEffect(() => {
		if (isMobileMenuOpen) {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					event.target &&
					!(event.target as Element).closest("#mobile-menu") &&
					!(event.target as Element).closest("#user-menu-button")
				) {
					setMobileMenuOpen(false);
					setUserMenuOpen(false);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [isMobileMenuOpen, isUserMenuOpen]);

	useEffect(() => {
		const links = document.querySelectorAll("a[href]");

		// Function to handle clicks and update styles
		const handleLinkClick = (event: Event) => {
			links.forEach((link) => link.classList.remove("font-bold"));
			(event.currentTarget as HTMLElement).classList.add("font-bold");
		};

		// Attach event listeners to all links
		links.forEach((link) => {
			link.addEventListener("click", handleLinkClick);

			// Ensure the current active page is bold
			if (link.getAttribute("href") === pathname) {
				link.classList.add("font-bold");
			}
		});

		// Attach event listener to logo click
		const logoLink = document.querySelector('a[href="/dashboard"]');
		if (logoLink) {
			logoLink.addEventListener("click", () => {
				links.forEach((link) => link.classList.remove("font-bold"));
				const dashboardLink = Array.from(links).find(
					(link) => link.getAttribute("href") === "/dashboard"
				);
				if (dashboardLink) {
					dashboardLink.classList.add("font-bold");
				}
			});
		}

		// Cleanup event listeners
		return () => {
			links.forEach((link) =>
				link.removeEventListener("click", handleLinkClick)
			);
			if (logoLink) {
				logoLink.removeEventListener("click", () => {});
			}
		};
	}, [pathname]);

	const handleSignOut = async () => {
		setIsModalOpen(false);
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
							{isMobileMenuOpen && (
								<>
									<span className="sr-only">
										Close main menu
									</span>
									<svg
										className="block size-6"
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
								</>
							)}
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
									href="/settings"
									className="rounded-md px-3 py-2 text-sm text-white hover:bg-gray-700 hover:text-white"
								>
									Settings
								</Link>
							</div>
						</div>
					</div>

					{/* User Menu */}

					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<h2 className="relative text-white">Hi, {username}</h2>
						<div className="relative ml-3 hidden sm:block">
							<button
								className="text-white hover:text-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-110"
								onClick={() => setIsModalOpen(true)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1.5a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 010 17.5v-11A2.5 2.5 0 012.5 4h9A2.5 2.5 0 0114 6.5V8"
									/>
								</svg>
							</button>
						</div>

						{/* Modal for logout confirmation */}
						{isModalOpen && (
							<Dialog
								open={isModalOpen}
								onOpenChange={setIsModalOpen}
							>
								<DialogTrigger asChild>
									{/* Optional additional button */}
								</DialogTrigger>
								<DialogContent className="bg-white p-6 rounded-md shadow-lg mx-auto w-96">
									<DialogHeader className="text-left ">
										<DialogTitle>
											Are you sure you want to logout?
										</DialogTitle>
										<DialogDescription>
											Clicking "Logout" will go back you
											to the login page.
										</DialogDescription>
									</DialogHeader>
									<div className="mt-4 flex justify-end space-x-4">
										<button
											className="px-4 py-2 bg-gray-200 rounded-md text-sm"
											onClick={() =>
												setIsModalOpen(false)
											}
										>
											Cancel
										</button>
										<button
											className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
											onClick={handleSignOut}
										>
											Logout
										</button>
									</div>
								</DialogContent>
							</Dialog>
						)}
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
						href="/settings"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Settings
					</Link>
					<button
						onClick={() => setIsModalOpen(true)}
						className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
