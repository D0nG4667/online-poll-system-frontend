"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logout } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

export default function DashboardPage() {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleLogout = () => {
		dispatch(logout());
		router.push("/login");
	};

	return (
		<AuthGuard>
			<div className="container mx-auto p-6 space-y-8">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<Button variant="outline" onClick={handleLogout}>
						Sign out
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Card className="glass-card">
						<CardHeader>
							<CardTitle>My Polls</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								You haven't created any polls yet.
							</p>
							<Button variant="unicorn" className="mt-4 w-full">
								Create New Poll
							</Button>
						</CardContent>
					</Card>

					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								No recent voting activity.
							</p>
						</CardContent>
					</Card>

					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Analytics</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								View your poll performance.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</AuthGuard>
	);
}
