import { ArrowRight, BarChart3, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-background relative">
			<div className="absolute top-4 right-4 z-50">
				<ModeToggle />
			</div>
			{/* Hero Section */}
			<section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32 lg:py-40">
				<div className="container px-4 md:px-6">
					<div className="space-y-6">
						<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-in fade-in zoom-in duration-1000">
							Project Nexus
						</h1>
						<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							The enterprise-grade polling platform for modern teams. Real-time
							insights, AI-powered analytics, and seamless collaboration.
						</p>
					</div>
					<div className="flex flex-col gap-4 min-[400px]:flex-row justify-center mt-8">
						<Link href="/register">
							<Button
								size="lg"
								variant="unicorn"
								className="w-full min-[400px]:w-auto group"
							>
								Get Started
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Button>
						</Link>
						<Link href="/login">
							<Button
								size="lg"
								variant="outline"
								className="w-full min-[400px]:w-auto"
							>
								Sign In
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<Card className="glass-card border-none bg-secondary/30">
						<CardHeader>
							<BarChart3 className="h-10 w-10 text-purple-500 mb-2" />
							<CardTitle>Real-time Analytics</CardTitle>
							<CardDescription>
								Watch votes roll in live with our WebSocket-powered dashboard.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="glass-card border-none bg-secondary/30">
						<CardHeader>
							<Users className="h-10 w-10 text-pink-500 mb-2" />
							<CardTitle>Collaborative Polling</CardTitle>
							<CardDescription>
								Create polls with your team and share them instantly.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="glass-card border-none bg-secondary/30">
						<CardHeader>
							<ShieldCheck className="h-10 w-10 text-indigo-500 mb-2" />
							<CardTitle>Enterprise Security</CardTitle>
							<CardDescription>
								Bank-grade encryption and secure authentication built-in.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</section>
		</div>
	);
}
