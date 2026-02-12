"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { useGetSessionQuery } from "@/services/authApi";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

function AuthCallbackContent() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data, isLoading, isError, error } = useGetSessionQuery();

	useEffect(() => {
		// Check for error in query params first
		const searchParams = new URLSearchParams(window.location.search);
		const errorParam = searchParams.get("error");

		if (errorParam) {
			console.error("Auth Callback Query Error:", errorParam);
			toast.error(`Authentication failed: ${errorParam}`);
			router.push("/signin");
			return;
		}

		if (!isLoading) {
			if (data?.status === 200 && data.data?.user) {
				const user = data.data.user;
				const sessionToken = data.meta?.session_token;
				const accessToken = data.meta?.access_token;
				const refreshToken = data.meta?.refresh_token;

				dispatch(
					setCredentials({
						user,
						sessionToken,
						accessToken,
						refreshToken,
					}),
				);

				toast.success("Signed in successfully!");
				router.push("/dashboard");
			} else if (isError || (data && data.status !== 200)) {
				console.error("Auth Callback Error:", data || error);
				toast.error("Authentication failed. Please try again.");
				router.push("/signin");
			}
		}
	}, [data, isLoading, isError, error, dispatch, router]);

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center space-y-4">
			<Icons.spinner className="h-10 w-10 animate-spin text-primary" />
			<div className="flex flex-col items-center space-y-2">
				<h1 className="text-xl font-semibold">Completing sign in...</h1>
				<p className="text-sm text-muted-foreground">
					Please wait while we finalize your session.
				</p>
			</div>
		</div>
	);
}

export default function AuthCallbackPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen w-screen items-center justify-center">
					<Icons.spinner className="h-10 w-10 animate-spin text-primary" />
				</div>
			}
		>
			<AuthCallbackContent />
		</Suspense>
	);
}
