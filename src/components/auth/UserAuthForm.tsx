"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
// import type * as z from "zod"; // Removed unused import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signinSchema, signupSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useSigninMutation, useSignupMutation } from "@/services/authApi";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import type { AllauthResponse, AuthError, Flow } from "@/types/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	mode: "signin" | "signup";
}

interface AuthFormValues {
	email: string;
	password: string;
	name?: string;
	confirmPassword?: string;
}

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [signin] = useSigninMutation();
	const [signup] = useSignupMutation();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();

	const schema = mode === "signin" ? signinSchema : signupSchema;

	const form = useForm<AuthFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
			confirmPassword: "",
		},
	});

	function handleGoogleLogin() {
		setIsLoading(true);
		try {
			// As per allauth headless documentation/official client:
			// "As calling this endpoint results in a user facing redirect (302),
			// this call is only available in a browser, and must be called in a
			// synchronous (non-XHR) manner."

			// The callback URL must match exactly what is configured in Google Cloud Console
			const callbackUrl = "http://localhost:3001/account/provider/callback/";
			const action = "/allauth/browser/v1/auth/provider/redirect";

			// Create a form and submit it synchronously
			const form = document.createElement("form");
			form.method = "POST";
			form.action = action;

			const csrfToken = document.cookie
				.split("; ")
				.find((row) => row.startsWith("csrftoken="))
				?.split("=")[1];

			const data: Record<string, string> = {
				provider: "google",
				process: "login",
				callback_url: callbackUrl,
			};

			if (csrfToken) {
				data.csrfmiddlewaretoken = csrfToken;
			}

			for (const [key, value] of Object.entries(data)) {
				const input = document.createElement("input");
				input.type = "hidden";
				input.name = key;
				input.value = value;
				form.appendChild(input);
			}

			document.body.appendChild(form);
			form.submit();
		} catch (error) {
			console.error("Google Login Error:", error);
			toast.error("Failed to initiate Google login");
			setIsLoading(false);
		}
	}

	async function onSubmit(data: AuthFormValues) {
		setIsLoading(true);

		try {
			console.log(`Attempting ${mode} with:`, { email: data.email });

			let response: AllauthResponse;
			if (mode === "signin") {
				response = await signin({
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
				// Extract user and tokens from Allauth Headless response structure
				if (response.data?.user) {
					const user = response.data.user;
					const sessionToken = response.meta?.session_token;
					const accessToken = response.meta?.access_token;
					const refreshToken = response.meta?.refresh_token;

					console.log("Auth Successful, setting credentials...");
					dispatch(
						setCredentials({
							user,
							sessionToken,
							accessToken,
							refreshToken,
						}),
					);
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
				} else if (error.status === 401) {
					let data = error.data;
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
					if (mode === "signin") {
						toast.error("You are already signed in.");
					} else {
						toast.error(
							"Account already exists with this email. Please Sign In or reset your password.",
						);
					}
				} else if ((error as { status: unknown }).status === "FETCH_ERROR") {
					toast.error("Network error: Unable to reach the server.");
				}
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("--- SUBMISSION EXCEPTION END ---");

			if (error?.data?.errors) {
				error.data.errors.forEach((err: AuthError) => {
					if (err.param) {
						form.setError(err.param as keyof AuthFormValues, {
							message: err.message,
						});
					}
				});
			} else if (error?.errors) {
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
					{mode === "signup" && (
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
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
							{mode === "signin" && (
								<Link
									href="/forgot-password"
									className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
								>
									Forgot password?
								</Link>
							)}
						</div>
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
					{mode === "signup" && (
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
						{mode === "signin" ? "Sign In" : "Sign Up"}
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
			<Button
				variant="outline"
				type="button"
				disabled={isLoading}
				onClick={handleGoogleLogin}
			>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.google className="mr-2 h-4 w-4" />
				)}
				Google
			</Button>
		</div>
	);
}
