"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/img/logo.png";
import { useEffect } from "react";
import { toggleMenu } from "../scripts/nav";

export default function Nav() {
	useEffect(() => {
		toggleMenu();
	}, []);

	return (
		<nav className="bg-black">
			<div className="px-3 sm:px-6 lg:px-12">
				<div className="relative flex h-16 items-center justify-between">
					{/* Mobile Menu Button */}
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						<button
							type="button"
							className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span className="absolute -inset-0.5"></span>
							<span className="sr-only">Open main menu</span>
							<svg
								className="block size-6"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
							<svg
								className="hidden size-6"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								aria-hidden="true"
								data-slot="icon"
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
							<a href="/" className="flex items-center">
								<Image
									className="h-8 w-auto"
									src={Logo}
									alt="Your Company"
									width={100}
									height={100}
								/>
							</a>
						</div>

						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								<a
									href="#"
									className="rounded-md px-3 py-2 text-sm font-medium text-white"
									aria-current="page"
								>
									Dashboard
								</a>
								<a
									href="#"
									className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
								>
									Inventory
								</a>
								<a
									href="#"
									className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
								>
									Incoming
								</a>
								<a
									href="#"
									className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
								>
									Outgoing
								</a>
								<a
									href="#"
									className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
								>
									Products
								</a>
								<a
									href="#"
									className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
								>
									Settings
								</a>
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
									className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
									id="user-menu-button"
									aria-expanded="false"
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
								className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden hidden"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu-button"
								tabIndex={-1}
							>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-0"
								>
									Your Profile
								</a>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-1"
								>
									Settings
								</a>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-2"
								>
									Sign out
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div className="sm:hidden hidden" id="mobile-menu">
				<div className="space-y-1 px-2 pt-2 pb-3">
					<a
						href="#"
						className="block rounded-md px-3 py-2 text-base font-medium text-white"
						aria-current="page"
					>
						Dashboard
					</a>
					<a
						href="#"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Inventory
					</a>
					<a
						href="#"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Incoming
					</a>
					<a
						href="#"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Outgoing
					</a>
					<a
						href="#"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Products
					</a>
					<a
						href="#"
						className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
					>
						Settings
					</a>
				</div>
			</div>
		</nav>
	);
}
