"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
// import type * as z from "zod"; // Removed unused import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useLoginMutation, useSignupMutation } from "@/services/authApi";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import type { AllauthResponse, AuthError, Flow } from "@/types/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	mode: "login" | "register";
}

interface AuthFormValues {
	email: string;
	password: string;
	name?: string;
	confirmPassword?: string;
}

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [login] = useLoginMutation();
	const [signup] = useSignupMutation();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();

	const schema = mode === "login" ? loginSchema : registerSchema;

	const form = useForm<AuthFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: AuthFormValues) {
		setIsLoading(true);

		try {
			console.log(`Attempting ${mode} with:`, { email: data.email });

			let response: AllauthResponse;
			if (mode === "login") {
				response = await login({
					email: data.email,
					password: data.password,
				}).unwrap();
			} else {
				response = await signup({
					email: data.email,
					password: data.password,
					name: data.name,
					confirmPassword: data.confirmPassword,
				}).unwrap();
			}

			console.log("Auth Response Raw:", response);

			if (response.status === 200 || response.status === 201) {
				// Extract user and token from Allauth Headless response structure
				if (response.data?.user && response.meta?.session_token) {
					const user = response.data.user;
					const token = response.meta.session_token;
					console.log("Auth Successful, setting credentials...");
					dispatch(setCredentials({ user, token }));
					const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
					router.push(callbackUrl);
				} else {
					console.warn("Auth status OK but no user data found in response.");
				}
			} else if (response.errors) {
				console.warn("Auth Response contains errors:", response.errors);
				response.errors.forEach((err: AuthError) => {
					if (err.param) {
						form.setError(err.param as keyof AuthFormValues, {
							message: err.message,
						});
					}
				});
			}
		} catch (err: unknown) {
			const error = err as AllauthResponse;
			console.error("--- SUBMISSION EXCEPTION START ---");
			console.error("Error Object (Raw):", error);
			if (error && typeof error === "object") {
				console.error("Error Status:", error.status);
				console.error("Error Data:", JSON.stringify(error.data));

				if (error.status === 400 || error.status === 429) {
					// 400 Bad Request, 429 Too Many Requests
					// Handled below via error.data.errors or error.errors
				} else if (error.status === 401) {
					// Check for Allauth Headless "verify_email" flow
					let data = error.data;

					// Handle case where data might be a JSON string (as seen in logs)
					if (typeof data === "string") {
						try {
							data = JSON.parse(data);
						} catch (e) {
							console.error("Failed to parse error data string:", e);
						}
					}

					const flows = data?.flows || [];
					const verifyEmailFlow = Array.isArray(flows)
						? flows.find((f: Flow) => f.id === "verify_email")
						: null;

					if (verifyEmailFlow?.is_pending) {
						toast.info(
							"Verification email sent! Please check your inbox to continue.",
						);
					} else {
						toast.error(
							"Unauthorized: Please check your email or credentials.",
						);
					}
				} else if (error.status === 409) {
					toast.error(
						"Account already exists with this email. Please sign in or reset your password.",
					);
				} else if ((error as { status: unknown }).status === "FETCH_ERROR") {
					console.error(
						"NETWORK ERROR DETECTED: This usually means CORS issues or the Backend is not running/reachable at the configured URL.",
					);
					toast.error("Network error: Unable to reach the server.");
				}
			} else {
				console.error("Error is not an object:", error);
				toast.error("An unexpected error occurred.");
			}
			console.error("--- SUBMISSION EXCEPTION END ---");

			if (error?.data?.errors) {
				console.warn("Mapped Errors from API (Data):", error.data.errors);
				error.data.errors.forEach((err: AuthError) => {
					if (err.param) {
						form.setError(err.param as keyof AuthFormValues, {
							message: err.message,
						});
					}
				});
			} else if (error?.errors) {
				// Handle case where errors might be directly on the error object
				console.warn("Mapped Errors from API (Direct):", error.errors);
				error.errors.forEach((err: AuthError) => {
					if (err.param) {
						form.setError(err.param as keyof AuthFormValues, {
							message: err.message,
						});
					}
				});
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-4">
					{mode === "register" && (
						<div className="grid gap-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								placeholder="John Doe"
								type="text"
								autoCapitalize="none"
								autoComplete="name"
								autoCorrect="off"
								disabled={isLoading}
								{...form.register("name")}
							/>
							{form.formState.errors.name && (
								<p className="text-sm text-red-500">
									{form.formState.errors.name.message as string}
								</p>
							)}
						</div>
					)}
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							placeholder="name@example.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoading}
							{...form.register("email")}
						/>
						{form.formState.errors.email && (
							<p className="text-sm text-red-500">
								{form.formState.errors.email.message as string}
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							placeholder="Password"
							type="password"
							autoCapitalize="none"
							autoCorrect="off"
							disabled={isLoading}
							{...form.register("password")}
						/>
						{form.formState.errors.password && (
							<p className="text-sm text-red-500">
								{form.formState.errors.password.message as string}
							</p>
						)}
					</div>
					{mode === "register" && (
						<div className="grid gap-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								placeholder="Confirm Password"
								type="password"
								autoCapitalize="none"
								autoCorrect="off"
								disabled={isLoading}
								{...form.register("confirmPassword")}
							/>
							{form.formState.errors.confirmPassword && (
								<p className="text-sm text-red-500">
									{form.formState.errors.confirmPassword.message as string}
								</p>
							)}
						</div>
					)}
					<Button disabled={isLoading} variant="unicorn">
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{mode === "login" ? "Sign In" : "Create Account"}
					</Button>
				</div>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<Button variant="outline" type="button" disabled={isLoading}>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<svg
						className="mr-2 h-4 w-4"
						aria-hidden="true"
						focusable="false"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
							fill="#EA4335"
						/>
					</svg>
				)}
				Google
			</Button>
		</div>
	);
}
