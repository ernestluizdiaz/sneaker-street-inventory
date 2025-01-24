// nav.js
export const toggleMenu = () => {
	const mobileMenuButton = document.querySelector(
		'[aria-controls="mobile-menu"]'
	);
	const mobileMenu = document.getElementById("mobile-menu");
	const userMenuButton = document.getElementById("user-menu-button");
	const userMenu = document.querySelector('[role="menu"]');
	const links = document.querySelectorAll(
		".sm\\:block .space-x-4 a, .sm\\:hidden #mobile-menu a"
	); // Get all the links in both mobile and desktop menus.

	// Toggle mobile menu visibility
	if (mobileMenuButton) {
		mobileMenuButton.addEventListener("click", () => {
			mobileMenu.classList.toggle("hidden");
		});
	}

	// Toggle user menu visibility
	if (userMenuButton) {
		userMenuButton.addEventListener("click", () => {
			userMenu.classList.toggle("hidden");
		});
	}

	// Add the font-bold class to the current page link
	links.forEach((link) => {
		// Set the default link (Dashboard) to have the font-bold class on page load
		if (link.textContent.trim() === "Dashboard") {
			link.classList.add("font-bold");
		}

		link.addEventListener("click", () => {
			// Remove font-bold class from all links
			links.forEach((item) => item.classList.remove("font-bold"));
			// Add font-bold class to the clicked link
			link.classList.add("font-bold");
		});
	});
};
