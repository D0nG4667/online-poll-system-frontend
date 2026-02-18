"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
// import type * as z from "zod"; // Removed unused import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCSRFToken } from "@/lib/csrf";
import { signinSchema, signupSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import {
	authApi,
	useSigninMutation,
	useSignupMutation,
} from "@/services/authApi";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import type { AllauthResponse, AuthenticatedMeta } from "@/types/auth";

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

	async function handleGoogleLogin() {
		setIsLoading(true);
		try {
			// As per allauth headless documentation/official client:
			// "As calling this endpoint results in a user facing redirect (302),
			// this call is only available in a browser, and must be called in a
			// synchronous (non-XHR) manner."

			// If CSRF token is missing (incognito mode/first visit), prime the session
			let csrfToken = getCSRFToken();
			if (!csrfToken) {
				console.log("No CSRF token found. Priming session...");
				// Trigger a session request to get the cookie from backend
				// We don't unwrap here because a 401 is expected but it still sets the cookie
				try {
					await dispatch(authApi.endpoints.getSession.initiate()).unwrap();
					// Small wait to ensure browser processes the Set-Cookie header
					await new Promise((resolve) => setTimeout(resolve, 100));
				} catch (_e) {
					// 401 is expected for guest users, cookie should still be set
					console.log("Session primed (ignore expected 401)");
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
				csrfToken = getCSRFToken();
				console.log(
					"CSRF Token after priming:",
					csrfToken ? "Found" : "Missing",
				);
			}

			// The callback URL must match exactly what is configured in Google Cloud Console
			const frontendUrl =
				process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001";
			const callbackUrl = `${frontendUrl}/account/provider/callback`;
			const action = "/_allauth/browser/v1/auth/provider/redirect";

			// Create a form and submit it synchronously
			const form = document.createElement("form");
			form.method = "POST";
			form.action = action;

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

			try {
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
			} catch (err: unknown) {
				const error = err as {
					status?: string | number;
					originalStatus?: number;
					data?: unknown;
				};

				// Hotfix: Handle PARSING_ERROR
				if (
					error.status === "PARSING_ERROR" &&
					error.originalStatus === 200 &&
					typeof error.data === "string"
				) {
					try {
						const parsed = JSON.parse(error.data) as AllauthResponse;
						if (parsed.status === 200 || parsed.status === 201) {
							console.log("Recovered from PARSING_ERROR:", parsed);
							response = parsed;
						} else {
							throw err;
						}
					} catch {
						throw err;
					}
				} else {
					throw err;
				}
			}

			console.log("Auth Response:", response);

			if (response.status === 200 || response.status === 201) {
				toast.success(
					mode === "signin"
						? "Signed in successfully"
						: "Account created successfully",
				);

				const meta = response.meta;
				const user = response.data?.user;

				if (user) {
					let sessionToken: string | undefined;
					let accessToken: string | undefined;
					let refreshToken: string | undefined;

					if (
						meta &&
						"is_authenticated" in meta &&
						(meta as AuthenticatedMeta).is_authenticated
					) {
						const authenticatedMeta = meta as AuthenticatedMeta;
						sessionToken = authenticatedMeta.session_token;
						accessToken = authenticatedMeta.access_token;
						refreshToken = authenticatedMeta.refresh_token;
					}

					dispatch(
						setCredentials({
							user,
							sessionToken,
							accessToken,
							refreshToken,
						}),
					);
				}

				router.push("/dashboard");
				router.refresh();
			} else if (response.errors && response.errors.length > 0) {
				response.errors.forEach((err) => {
					if (err.param) {
						form.setError(err.param as keyof AuthFormValues, {
							message: err.message,
						});
					} else {
						toast.error(err.message || "An error occurred");
					}
				});
			} else {
				toast.error("An unexpected error occurred.");
			}
		} catch (err: unknown) {
			console.error("Auth Submission Error", err);

			// Handle RTK Query Error structure
			const rtkError = err as {
				status: number | string;
				data?: AllauthResponse;
			};

			if (rtkError.data?.errors) {
				rtkError.data.errors.forEach((authErr) => {
					if (authErr.param) {
						form.setError(authErr.param as keyof AuthFormValues, {
							message: authErr.message,
						});
					} else {
						toast.error(authErr.message || "An error occurred");
					}
				});
			} else if (rtkError.status === 401) {
				toast.error("Invalid credentials.");
			} else if (rtkError.status === 400) {
				toast.error("Bad request. Please check your inputs.");
			} else if (rtkError.status === 405) {
				toast.error(
					"API configuration error (405). Please contact support. (Trailing slash issue resolved?)",
				);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
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
