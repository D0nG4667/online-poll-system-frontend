"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function PublicNavbar() {
	return (
		<nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
			<div className="container mx-auto flex items-center justify-between p-4 md:p-6">
				<div className="flex items-center gap-2">
					<Link href="/" className="hover:opacity-80 transition-opacity">
						<Logo showText />
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
