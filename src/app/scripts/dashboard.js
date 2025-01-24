"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Settings from "../../../public/img/settings.png";

const DropdownButton = ({ label }) => {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);
	};

	// Close the dropdown if clicked outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setDropdownVisible(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		// Cleanup the event listener on component unmount
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button onClick={toggleDropdown}>
				<Image
					className="h-8 w-auto"
					src={Settings}
					alt="Settings Icon"
					width={100}
					height={100}
				/>
			</button>

			{/* Dropdown Menu */}
			{dropdownVisible && (
				<div className="absolute right-1 w-auto bg-white border border-gray-300 rounded-lg shadow-md z-10">
					<ul className="text-sm">
						<li className="px-4 py-2 cursor-pointer hover:bg-gray-200">
							Daily
						</li>
						<li className="px-4 py-2 cursor-pointer hover:bg-gray-200">
							Monthly
						</li>
						<li className="px-4 py-2 cursor-pointer hover:bg-gray-200">
							Annually
						</li>
						<li className="px-4 py-2 cursor-pointer hover:bg-gray-200">
							Custom Date
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default DropdownButton;
