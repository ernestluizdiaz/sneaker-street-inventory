"use client";
import { useState } from "react";
import supabase from "@/config/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/../public/img/logo_black.png";

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
		<div className="flex items-center justify-center min-h-screen ">
			<div className="max-w-sm w-full rounded-xl border bg-card text-card-foreground shadow p-6">
				{/* <h1 className="font-bold mb-4 text-left text-2xl">Login</h1> */}
				<div className="py-5">
					<Image
						src={Logo}
						width={100}
						height={100}
						alt={""}
						className="mx-auto"
					/>
				</div>

				<form onSubmit={handleLogin} className="space-y-4 ">
					<div>
						<label className="block text-sm font-bold">
							Email:
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm font-bold">
							Password:
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<button
						type="submit"
						className="w-full bg-black text-white text-sm font-bold p-2 rounded-md transition-transform transform hover:scale-105"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
