"use client";

import { FilePlus, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PollTable } from "@/components/polls/PollTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetPollsQuery } from "@/services/pollsApi";

type PollStatus = "all" | "active" | "draft" | "completed";

export default function MyPollsPage() {
	const { data: polls, isLoading, error } = useGetPollsQuery();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<PollStatus>("all");

	const filteredPolls = useMemo(() => {
		if (!polls) return [];
		return polls.filter((poll) => {
			const matchesSearch = poll.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			let matchesStatus = true;
			if (statusFilter === "active") {
				matchesStatus = poll.is_active && poll.is_open;
			} else if (statusFilter === "draft") {
				matchesStatus = !poll.is_active;
			} else if (statusFilter === "completed") {
				matchesStatus = poll.is_active && !poll.is_open;
			}

			return matchesSearch && matchesStatus;
		});
	}, [polls, searchQuery, statusFilter]);

	const statuses: { label: string; value: PollStatus }[] = [
		{ label: "All", value: "all" },
		{ label: "Active", value: "active" },
		{ label: "Draft", value: "draft" },
		{ label: "Completed", value: "completed" },
	];

	return (
		<div className="flex flex-col min-h-screen bg-background/50">
			<div className="container mx-auto py-8 px-4 flex-1 flex flex-col space-y-8">
				{/* 🎨 Header with Glassmorphism */}
				<div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 shadow-sm">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<h1 className="text-3xl font-bold tracking-tight">My Polls</h1>
								<span className="text-3xl">📋</span>
							</div>
							<p className="text-muted-foreground max-w-md">
								Manage and monitor all your polls in one place
							</p>
						</div>
						<Button
							asChild
							variant="unicorn"
							className="font-semibold px-6 h-11 rounded-xl shadow-lg transition-all"
						>
							<Link href="/dashboard/create">
								<Plus className="mr-2 h-5 w-5" />
								Create New Poll
							</Link>
						</Button>
					</div>
					{/* Decorative background elements */}
					<div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
					<div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl" />
				</div>

				{/* 🔍 Search and Filters */}
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="relative w-full md:w-80 group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-blue-500" />
						<Input
							placeholder="Search polls..."
							className="pl-10 h-10 bg-white/50 dark:bg-muted/20 border-muted-foreground/20 rounded-xl focus-visible:ring-blue-500"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto scrollbar-hide">
						{statuses.map((status) => (
							<button
								type="button"
								key={status.value}
								onClick={() => setStatusFilter(status.value)}
								className={cn(
									"px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
									statusFilter === status.value
										? "bg-[#F36B21] text-white border-[#F36B21] shadow-md shadow-orange-500/20"
										: "bg-white dark:bg-muted/10 border-muted/30 text-muted-foreground hover:bg-muted/20",
								)}
							>
								{status.label}
							</button>
						))}
					</div>
				</div>

				{/* 📊 Poll List Area */}
				<div className="flex-1">
					{isLoading ? (
						<div className="space-y-4">
							<Skeleton className="h-12 w-full rounded-xl" />
							<Skeleton className="h-48 w-full rounded-xl" />
						</div>
					) : error ? (
						<div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
							<p className="text-destructive font-medium">
								Error loading polls
							</p>
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
							>
								Retry
							</Button>
						</div>
					) : filteredPolls.length > 0 ? (
						<div className="border rounded-2xl overflow-hidden bg-white/50 dark:bg-muted/5 shadow-sm">
							<PollTable polls={filteredPolls} />
						</div>
					) : (
						/* 🎨 Redesigned Empty State */
						<div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
							<div className="relative">
								<div className="absolute -inset-4 bg-muted/50 rounded-full blur-xl" />
								<div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-muted/20 border-2 border-dashed border-muted-foreground/30 text-muted-foreground/30 transition-colors hover:border-blue-500/50 hover:text-blue-500/50">
									<FilePlus className="h-10 w-10" />
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-xl font-bold">No polls</h3>
								<p className="text-muted-foreground max-w-xs mx-auto text-sm">
									{searchQuery || statusFilter !== "all"
										? "No polls match your current filters."
										: "Get started by creating a new poll."}
								</p>
							</div>
							{searchQuery || statusFilter !== "all" ? (
								<Button
									variant="link"
									type="button"
									onClick={() => {
										setSearchQuery("");
										setStatusFilter("all");
									}}
									className="text-blue-600"
								>
									Clear all filters
								</Button>
							) : (
								<Button
									asChild
									variant="unicorn"
									className="px-8 h-10 rounded-xl shadow-lg transition-all"
								>
									<Link href="/dashboard/create">
										<Plus className="mr-2 h-4 w-4" />
										New Poll
									</Link>
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
			<footer className="border-t py-6 bg-background/50">
				<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
					<div className="flex flex-col md:flex-row items-center gap-4">
						<span>© 2025 PollGPT. All rights reserved.</span>
						<div className="flex items-center gap-2">
							<span className="hidden md:inline">•</span>
							<a
								href="mailto:contact@pollgpt.com"
								className="hover:text-foreground transition-colors"
							>
								contact@pollgpt.com
							</a>
						</div>
						<div className="flex items-center gap-2">
							<span className="hidden md:inline">•</span>
							<span>5 Parv. Alan Turing, 75013 Paris, France</span>
						</div>
					</div>
					<div className="flex items-center gap-6">
						<a href="/terms" className="hover:underline">
							Terms
						</a>
						<a href="/privacy" className="hover:underline">
							Privacy
						</a>
						<a href="/help" className="hover:underline">
							Help
						</a>
					</div>
				</div>
			</footer>
			;
		</div>
	);
}
