"use client";
import { useState } from "react";
import supabase from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(""); // Clear any previous errors

		// Attempt to sign in
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			// If error occurs, set error message
			setError(error.message);
		} else if (data?.user) {
			// If login is successful, redirect to dashboard
			console.log("Login successful:", data);
			console.log(password);
			router.push("/dashboard"); // Redirect to dashboard
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			<h2 className="text-xl font-bold mb-4">Login</h2>
			<form onSubmit={handleLogin} className="space-y-4">
				<div>
					<label className="block text-sm font-medium">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full p-2 border rounded-md"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">
						Password
					</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full p-2 border rounded-md"
					/>
				</div>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded-md"
				>
					Login
				</button>
			</form>
		</div>
	);
}
