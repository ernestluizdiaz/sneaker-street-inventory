"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/../public/img/logo_black.png";
import supabase from "@/config/supabase";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [emailExists, setEmailExists] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();

	// Check if the reset token is present in the URL (user is resetting password)
	const isResetMode = searchParams?.get("type") === "recovery";

	const handlePasswordResetRequest = async (e: {
		preventDefault: () => void;
	}) => {
		e.preventDefault();

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo:
				"https://sneaker-street-inventory.vercel.app/reset-password?type=recovery", // Redirect user with query param
		});

		if (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		} else {
			setEmailExists(true);
		}
	};

	const handleNewPasswordSubmit = async (e: {
		preventDefault: () => void;
	}) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast({
				title: "Error",
				description: "Passwords do not match!",
				variant: "destructive",
			});
			return;
		}

		// Update password using Supabase
		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		} else {
			toast({
				title: "Success",
				description:
					"Password successfully reset. Redirecting to login...",
				variant: "default",
			});
			await supabase.auth.signOut(); // Sign out user
			router.push("/"); // Redirect to login page
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="max-w-sm w-full rounded-xl border bg-card text-card-foreground shadow p-6">
				<div className="py-2">
					<Image
						src={Logo}
						width={100}
						height={100}
						alt=""
						className="mx-auto"
					/>
				</div>

				{isResetMode ? (
					// Password Reset Form
					<form
						className="space-y-4"
						onSubmit={handleNewPasswordSubmit}
					>
						<p className="text-sm text-center">
							Enter your new password.
						</p>
						<div>
							<label className="block text-sm font-bold">
								New Password:
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full rounded-md border px-3 py-1 text-base shadow-sm"
							/>
						</div>
						<div>
							<label className="block text-sm font-bold">
								Confirm Password:
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
								className="w-full rounded-md border px-3 py-1 text-base shadow-sm"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-black text-white text-sm font-bold p-2 rounded-md"
						>
							Reset Password
						</button>
					</form>
				) : !emailExists ? (
					// Email input form
					<form
						className="space-y-4"
						onSubmit={handlePasswordResetRequest}
					>
						<p className="text-sm text-center">
							Enter your email address to reset your password.
						</p>
						<div>
							<label className="block text-sm font-bold">
								Email:
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full rounded-md border px-3 py-1 text-base shadow-sm"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-black text-white text-sm font-bold p-2 rounded-md"
						>
							Submit
						</button>
					</form>
				) : (
					// Reset password confirmation message
					<div className="text-center">
						<p className="text-sm">
							Check your email for a password reset link.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
