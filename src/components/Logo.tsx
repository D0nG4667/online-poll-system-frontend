"use client";

import { cn } from "@/lib/utils";

interface LogoProps extends React.ComponentPropsWithoutRef<"div"> {
	showText?: boolean;
	textClassName?: string;
	iconClassName?: string;
}

export function Logo({
	showText = false,
	className,
	textClassName,
	iconClassName,
	...props
}: LogoProps) {
	return (
		<div className={cn("flex items-center gap-2", className)} {...props}>
			<svg
				role="img"
				aria-label="Plaude Poll Logo"
				width="32"
				height="32"
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={cn("h-8 w-8 shrink-0", iconClassName)}
			>
				<rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
				<path
					d="M9 16L14 21L23 11"
					stroke="white"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<defs>
					<linearGradient
						id="logo-gradient"
						x1="0"
						y1="0"
						x2="32"
						y2="32"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#F97316" />
						<stop offset="1" stopColor="#FB923C" />
					</linearGradient>
				</defs>
			</svg>
			{showText && (
				<span
					className={cn(
						"font-bold tracking-tight text-xl text-foreground",
						textClassName,
					)}
				>
					Plaude Poll
				</span>
			)}
		</div>
	);
}
