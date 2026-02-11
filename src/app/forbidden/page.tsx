import { Home, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ErrorLayout } from "@/components/layout/ErrorLayout";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
	return (
		<ErrorLayout
			statusCode="403"
			title="Access Denied"
			description="You don't have permission to view this page. If you believe this is an error, please contact support or try signing in with a different account."
		>
			<Button variant="outline" asChild>
				<Link href="/signin">
					<ShieldAlert className="mr-2 h-4 w-4" />
					Sign In
				</Link>
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
