"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ErrorLayoutProps {
	children: ReactNode;
	statusCode?: string;
	title: string;
	description: string;
	className?: string;
}

export function ErrorLayout({
	children,
	statusCode,
	title,
	description,
	className,
}: ErrorLayoutProps) {
	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 animate-pulse" />
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] -z-10" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className={cn(
					"w-full max-w-2xl text-center space-y-8 relative z-10",
					className,
				)}
			>
				{statusCode && (
					<motion.h1
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
						className="text-[12rem] md:text-[18rem] font-bold leading-none tracking-tighter bg-gradient-to-b from-primary/50 to-transparent bg-clip-text text-transparent opacity-20 select-none absolute -top-32 md:-top-48 left-1/2 -translate-x-1/2 w-full"
					>
						{statusCode}
					</motion.h1>
				)}

				<div className="space-y-4">
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
						{title}
					</h2>
					<p className="text-lg text-muted-foreground max-w-lg mx-auto">
						{description}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					{children}
				</div>
			</motion.div>

			{/* Subtle grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-20" />
		</div>
	);
}
