"use client";

import { useState, useEffect } from "react";
import supabase from "@/config/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true); // Add loading state
	const router = useRouter();
	const pathname = usePathname(); // Get the current pathname using usePathname

	useEffect(() => {
		// Only run this logic on the client-side
		if (typeof window !== "undefined") {
			// Fetch session on initial load
			supabase.auth.getSession().then(({ data: { session } }) => {
				setSession(session);
				setLoading(false); // Once session is fetched, stop loading
			});

			// Listen for changes to authentication state
			const { data: authListener } = supabase.auth.onAuthStateChange(
				(_event, session) => {
					setSession(session);
					setLoading(false); // Once session is fetched, stop loading
				}
			);

			// Cleanup listener on unmount
			return () => {
				authListener.subscription.unsubscribe();
			};
		}
	}, []);

	// If session does not exist, redirect to login
	useEffect(() => {
		// If not logged in, redirect to login page
		if (!session && !loading) {
			router.push("/"); // Redirect to login if user is not logged in
		}
	}, [session, loading, router]);

	// Don't render Nav and main content until session is determined
	if (loading) {
		return (
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					{/* Optional: You can show a loading spinner or message here */}
					<p>Loading...</p>
				</body>
			</html>
		);
	}

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{/* Show Nav only if the user is logged in */}
				{session && <Nav />}
				<main>{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
