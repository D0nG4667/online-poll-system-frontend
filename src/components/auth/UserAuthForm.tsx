"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFirstErrorMessage, mapAllauthErrors } from "@/lib/auth-errors";
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
import type {
	AllauthResponse,
	AuthenticatedData,
	AuthenticatedMeta,
	AuthenticationRequiredData,
} from "@/types/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	mode: "signin" | "signup";
}

/**
 * Redirects the user to a social provider for authentication.
 */
function redirectToProvider(
	provider: string,
	authProcess: "login" | "connect" = "login",
) {
	const csrfToken = getCSRFToken();
	const frontendUrl =
		process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001";
	const callbackUrl = `${frontendUrl}/account/provider/callback`;
	const action = "/_allauth/browser/v1/auth/provider/redirect";

	const form = document.createElement("form");
	form.method = "POST";
	form.action = action;

	const data: Record<string, string> = {
		provider,
		process: authProcess,
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
			// Prime or check session state
			console.log("Checking session state before Google login...");
			try {
				const session = await dispatch(
					authApi.endpoints.getSession.initiate(),
				).unwrap();

				if (session.meta?.is_authenticated || session.data?.user) {
					console.log("User already authenticated. Redirecting to dashboard.");
					const data = session.data as AuthenticatedData;
					const user = data?.user;
					if (user) {
						dispatch(
							setCredentials({
								user,
								sessionToken: session.meta?.session_token,
								accessToken: session.meta?.access_token,
								refreshToken: session.meta?.refresh_token,
							}),
						);
					}
					router.push("/dashboard");
					return;
				}
			} catch (_e) {
				// 401 is fine, proceed to redirect
			}

			redirectToProvider("google");
		} catch (error) {
			console.error("Google Login Error:", error);
			toast.error("Failed to initiate Google login");
			setIsLoading(false);
		}
	}

	async function onSubmit(data: AuthFormValues) {
		setIsLoading(true);

		try {
			// Prime session and check for existing auth state
			console.log("Checking session state before form submission...");
			try {
				const session = await dispatch(
					authApi.endpoints.getSession.initiate(),
				).unwrap();

				if (session.meta?.is_authenticated || session.data?.user) {
					console.log("User already authenticated. Redirecting to dashboard.");
					const authData = session.data as AuthenticatedData;
					const user = authData?.user;
					if (user) {
						dispatch(
							setCredentials({
								user,
								sessionToken: session.meta?.session_token,
								accessToken: session.meta?.access_token,
								refreshToken: session.meta?.refresh_token,
							}),
						);
					}
					router.push("/dashboard");
					return;
				}
			} catch (_e) {
				// 401 is expected for guests, proceed
			}

			console.log(`Attempting ${mode} with:`, { email: data.email });

			let response: AllauthResponse;

			try {
				if (mode === "signin") {
					response = await signin({
						email: data.email,
						password: data.password,
					}).unwrap();
				} else {
					// Some Allauth configs require 'username' or custom fields.
					// We'll send what we have and let the mapping utility handle errors.
					response = await signup({
						email: data.email,
						password: data.password,
						username: data.email.split("@")[0], // Fallback username
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

				// HANDLE 409 CONFLICT (Already Logged In)
				if (error.status === 409 || error.originalStatus === 409) {
					console.log("Conflict 409: Already logged in. Syncing session...");
					try {
						const session = await dispatch(
							authApi.endpoints.getSession.initiate(),
						).unwrap();
						const authData = session.data as AuthenticatedData;
						if (authData?.user) {
							dispatch(
								setCredentials({
									user: authData.user,
									sessionToken: session.meta?.session_token,
									accessToken: session.meta?.access_token,
									refreshToken: session.meta?.refresh_token,
								}),
							);
						}
					} catch (_e) {
						// Session sync failed
					}
					toast.success("Signed in successfully");
					router.push("/dashboard");
					return;
				}

				// Handle PARSING_ERROR (common workaround for 200/201 string responses)
				if (
					error.status === "PARSING_ERROR" &&
					error.originalStatus === 200 &&
					typeof error.data === "string"
				) {
					response = JSON.parse(error.data);
				} else {
					// Handle RTK Query Error structure
					const rtkError = err as {
						status: number | string;
						data?: AllauthResponse;
					};

					if (rtkError.data) {
						mapAllauthErrors(
							rtkError.data as AllauthResponse,
							form.setError,
							(msg) => toast.error(msg),
						);
					} else {
						const msg =
							getFirstErrorMessage(
								rtkError.data as unknown as AllauthResponse,
							) || "An unexpected error occurred.";
						toast.error(msg);
					}
					return;
				}
			}

			console.log("Auth Response:", response);

			if (response.status === 200 || response.status === 201) {
				const isSuccess =
					response.meta?.is_authenticated ||
					(response.status === 200 && response.data?.user);

				if (isSuccess) {
					toast.success(
						mode === "signin"
							? "Signed in successfully"
							: "Account created successfully",
					);

					const data = response.data as AuthenticatedData;
					const user = data?.user;
					if (user) {
						const meta = response.meta as AuthenticatedMeta;
						dispatch(
							setCredentials({
								user,
								sessionToken: meta?.session_token,
								accessToken: meta?.access_token,
								refreshToken: meta?.refresh_token,
							}),
						);
					}
					router.push("/dashboard");
					router.refresh();
				} else {
					// Check for pending flows (MFA, Email Verification etc)
					const data = response.data as AuthenticationRequiredData;
					if (data?.flows && data.flows.length > 0) {
						const flow = data.flows[0];
						console.log("Pending Flow:", flow);
						// TODO: Route to specific flow pages
						toast.info("A pending authentication step is required.");
					} else {
						mapAllauthErrors(response, form.setError, (msg) =>
							toast.error(msg),
						);
					}
				}
			} else {
				mapAllauthErrors(response, form.setError, (msg) => toast.error(msg));
			}
		} catch (err: unknown) {
			console.error("Critical Auth Error:", err);
			toast.error("A critical error occurred. Please try again.");
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
