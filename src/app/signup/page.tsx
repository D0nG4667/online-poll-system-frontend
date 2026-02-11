"use client";

import Link from "next/link";
import GuestGuard from "@/components/auth/GuestGuard";
import { UserAuthForm } from "@/components/auth/UserAuthForm";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";

export default function SignupPage() {
	return (
		<GuestGuard>
			<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
				<div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-4">
					<ModeToggle />
					<Link
						href="/signin"
						className={cn(buttonVariants({ variant: "ghost" }))}
					>
						Sign In
					</Link>
				</div>
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
					<div className="absolute inset-0 bg-zinc-900" />
					<Link
						href="/"
						className="relative z-20 flex items-center text-lg font-medium hover:opacity-80 transition-opacity"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-2 h-6 w-6"
							role="img"
							aria-labelledby="register-logo-title"
						>
							<title id="register-logo-title">Plaude Poll Logo</title>
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
						</svg>
						Plaude Poll
					</Link>
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">
								&ldquo;Finally, a polling platform that respects both the
								creator and the voter. The speed and clarity of Plaude Poll are
								simply unmatched.&rdquo;
							</p>
							<footer className="text-sm">Alex Chen</footer>
						</blockquote>
					</div>
				</div>
				<div className="lg:p-8 flex items-center justify-center min-h-[calc(100vh-64px)] lg:min-h-screen">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
						<Card className="border-none shadow-none lg:border lg:shadow-sm">
							<CardHeader className="space-y-1 text-center">
								<CardTitle className="text-2xl font-bold italic tracking-tight text-unicorn">
									Create an account
								</CardTitle>
								<CardDescription>
									Enter your email below to create your account
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4">
								<UserAuthForm mode="signup" />
							</CardContent>
							<CardFooter className="flex flex-col space-y-4">
								<p className="px-8 text-center text-sm text-muted-foreground">
									By clicking continue, you agree to our{" "}
									<Link
										href="/terms"
										className="underline underline-offset-4 hover:text-primary decoration-primary/30"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="underline underline-offset-4 hover:text-primary decoration-primary/30"
									>
										Privacy Policy
									</Link>
									.
								</p>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</GuestGuard>
	);
}
