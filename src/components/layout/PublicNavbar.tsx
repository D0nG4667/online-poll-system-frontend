"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function PublicNavbar() {
	return (
		<nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
			<div className="container mx-auto flex items-center justify-between p-4 md:p-6">
				<div className="flex items-center gap-2">
					<Link
						href="/"
						className="font-bold text-xl tracking-tight flex items-center gap-2"
					>
						<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black">
							P
						</div>
						Plaude Poll
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<Link
						href="/signin"
						className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block"
					>
						Sign In
					</Link>
					<Link href="/signup">
						<Button variant="unicorn" size="sm">
							Sign Up
						</Button>
					</Link>
					<ModeToggle />
				</div>
			</div>
		</nav>
	);
}
