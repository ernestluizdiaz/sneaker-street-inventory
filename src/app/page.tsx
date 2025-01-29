"use client"; // This marks the file as a client-side component

import { useState, useEffect } from "react";
import supabase from "@/config/supabase";
import { Session } from "@supabase/supabase-js"; // Import the Session type
import Dashboard from "./components/dashboard";
import Login from "@/app/login/login-form";

export default function Home() {
	// Define the session state with the correct type (Session | null)
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState<boolean>(true); // State for loading

	useEffect(() => {
		// Check the session on component mount
		const fetchSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSession(session);
			setLoading(false); // Set loading to false after session is fetched
		};

		// Fetch session initially
		fetchSession();

		// Listen to changes in the authentication state
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setLoading(false); // Set loading to false when session changes
			}
		);

		// Cleanup the listener on component unmount
		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	if (loading) {
		return <div>Loading...</div>; // Show loading state until session is fetched
	}

	return (
		<div>
			{session ? <Dashboard /> : <Login />}{" "}
			{/* Render Dashboard or Login based on session */}
		</div>
	);
}
