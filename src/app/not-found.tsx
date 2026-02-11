import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import { ErrorLayout } from "@/components/layout/ErrorLayout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<ErrorLayout
			statusCode="404"
			title="Lost in Space?"
			description="The page you're looking for seems to have drifted into another dimension. Let's get you back to familiar territory."
		>
			<Button variant="outline" asChild className="group">
				<Link href="/">
					<ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
					Previous Page
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
