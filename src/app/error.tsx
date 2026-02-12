"use client";

import { Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ErrorLayout } from "@/components/layout/ErrorLayout";
import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Uncaught error:", error);
	}, [error]);

	return (
		<ErrorLayout
			statusCode="500"
			title="Something Went Wrong"
			description="An unexpected error occurred. Our team has been notified and is working to fix it as soon as possible."
		>
			<Button variant="outline" onClick={() => reset()}>
				<RefreshCcw className="mr-2 h-4 w-4" />
				Try Again
			</Button>
			<Button variant="unicorn" asChild>
				<Link href="/">
					<Home className="mr-2 h-4 w-4" />
					Return Home
				</Link>
			</Button>
		</ErrorLayout>
	);
}
