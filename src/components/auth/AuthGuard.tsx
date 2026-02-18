"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/signin");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return <>{children}</>;
}
