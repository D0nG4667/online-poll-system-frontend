"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, token } = useAppSelector((state) => state.auth);
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated || !token) {
			router.push("/login");
		}
	}, [isAuthenticated, token, router]);

	if (!isAuthenticated || !token) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return <>{children}</>;
}
