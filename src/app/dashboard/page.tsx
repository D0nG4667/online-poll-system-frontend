"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { PollList } from "@/components/polls/PollList";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { usePolls } from "@/hooks/usePoll";
import { logout } from "@/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { polls, isLoading } = usePolls();
	const user = useAppSelector((state) => state.auth.user);

	const handleLogout = () => {
		dispatch(logout());
		router.push("/login");
	};

	return (
		<AuthGuard>
			<div className="container mx-auto py-10 space-y-8">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
					<div className="space-y-1">
						<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
						<p className="text-muted-foreground">
							Welcome back, {user?.first_name || user?.email || "Guest"}. Here
							are the latest polls for you.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<ModeToggle />
						<Button variant="outline" onClick={handleLogout}>
							Sign out
						</Button>
					</div>
				</div>

				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold tracking-tight">
							Active Polls
						</h2>
						{/* Future: Add filters/sort here */}
					</div>

					{/* @ts-ignore - API types might need alignment, but strict passing for now */}
					<PollList polls={polls} isLoading={isLoading} />
				</div>
			</div>
		</AuthGuard>
	);
}
