"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, sessionToken, accessToken } = useAppSelector(
		(state) => state.auth,
	);
	const hasToken = !!(sessionToken || accessToken);
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated || !hasToken) {
			router.push("/signin");
		}
	}, [isAuthenticated, hasToken, router]);

	if (!isAuthenticated || !hasToken) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return <>{children}</>;
}
