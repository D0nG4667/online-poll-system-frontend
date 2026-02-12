"use client";

import {
	BarChart3,
	Clock,
	Flame,
	Inbox,
	LayoutGrid,
	Lightbulb,
	Plus,
	Target,
	TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePolls } from "@/hooks/usePoll";

export default function DashboardPage() {
	const router = useRouter();

	const { polls } = usePolls();

	// Get time-based greeting
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 18) return "Good Afternoon";
		return "Good Evening";
	};

	return (
		<AuthGuard>
			<div className="space-y-6">
				{/* Greeting Banner */}
				<Card className="bg-gradient-to-r from-orange-50 to-peach-50 dark:from-orange-950/20 dark:to-peach-950/20 border-orange-100 dark:border-orange-900">
					<CardContent className="flex items-center gap-4 p-6">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
							<Inbox className="h-6 w-6 text-orange-600 dark:text-orange-400" />
						</div>
						<div className="flex-1">
							<h2 className="text-2xl font-bold">{getGreeting()}! ✨</h2>
							<p className="text-muted-foreground">
								Happy{" "}
								{new Date().toLocaleDateString("en-US", { weekday: "long" })}!
								Create and manage your polls all in one place.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Quick Action Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					{/* Quick Poll */}
					<Card className="hover:shadow-md transition-shadow cursor-pointer group">
						<CardHeader>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50 mb-3">
								<Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
							</div>
							<CardTitle className="text-lg">Quick Poll 🚀</CardTitle>
							<CardDescription>
								Create a simple poll in seconds with AI-assisted options and
								templates.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								onClick={() => router.push("/dashboard/create")}
								className="w-full bg-orange-500 hover:bg-orange-600"
							>
								<Plus className="mr-2 h-4 w-4" />
								Create New Poll
							</Button>
						</CardContent>
					</Card>

					{/* My Analytics */}
					<Card className="hover:shadow-md transition-shadow cursor-pointer group">
						<CardHeader>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-3">
								<BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<CardTitle className="text-lg">My Analytics 📊</CardTitle>
							<CardDescription>
								Check the results and discover insights from your recent polls.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								onClick={() => router.push("/dashboard/analytics")}
								variant="outline"
								className="w-full"
							>
								<TrendingUp className="mr-2 h-4 w-4" />
								View Results
							</Button>
						</CardContent>
					</Card>

					{/* All Polls */}
					<Card className="hover:shadow-md transition-shadow cursor-pointer group">
						<CardHeader>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50 mb-3">
								<LayoutGrid className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<CardTitle className="text-lg">All Polls 📋</CardTitle>
							<CardDescription>
								Manage and edit your polls in one organized dashboard.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								onClick={() => router.push("/dashboard/polls")}
								variant="outline"
								className="w-full"
							>
								<LayoutGrid className="mr-2 h-4 w-4" />
								View All Polls
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Two Column Layout */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Inbox className="h-5 w-5 text-orange-500" />
								<CardTitle>Recent Activity</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							{polls?.results && polls.results.length > 0 ? (
								<div className="space-y-4">
									{polls.results.slice(0, 3).map((poll) => (
										<button
											key={poll.id}
											type="button"
											className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors text-left"
											onClick={() =>
												router.push(`/polls/${poll.slug || poll.id}`)
											}
										>
											<div className="flex-1">
												<p className="font-medium">{poll.title}</p>
												<p className="text-sm text-muted-foreground">
													{new Date(poll.created_at).toLocaleDateString()}
												</p>
											</div>
											<Button variant="ghost" size="sm">
												View →
											</Button>
										</button>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
										<Inbox className="h-8 w-8 text-muted-foreground" />
									</div>
									<p className="text-muted-foreground mb-1">
										No recent activity
									</p>
									<p className="text-sm text-muted-foreground">
										Create your first poll to see activity here!
									</p>
									<Button
										onClick={() => router.push("/dashboard/create")}
										className="mt-4"
										size="sm"
									>
										View all activity
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Tips & Resources */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Lightbulb className="h-5 w-5 text-orange-500" />
								<CardTitle>Tips & Resources</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Tip Tabs */}
							<div className="flex gap-2 mb-4">
								<Button variant="secondary" size="sm" className="text-xs">
									💡 Goals
								</Button>
								<Button variant="ghost" size="sm" className="text-xs">
									🏆 Achievements
								</Button>
								<Button variant="ghost" size="sm" className="text-xs">
									📚 Resources
								</Button>
							</div>

							{/* Featured Tip */}
							<div className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
								<div className="flex items-start gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
										<Target className="h-5 w-5" />
									</div>
									<div className="flex-1">
										<h4 className="font-semibold mb-1">
											Create Your First Poll
										</h4>
										<p className="text-sm text-white/90">
											Start with our conversational poll creator for the best
											experience!
										</p>
									</div>
								</div>
							</div>

							{/* General Tips */}
							<div className="space-y-3">
								<div className="flex items-start gap-3 p-3 rounded-lg border">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
										<Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
									</div>
									<div className="flex-1">
										<h5 className="font-medium text-sm mb-1">
											Write Clear Questions
										</h5>
										<p className="text-xs text-muted-foreground">
											Use simple, specific language to get better responses.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 rounded-lg border">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/50">
										<Clock className="h-4 w-4 text-pink-600 dark:text-pink-400" />
									</div>
									<div className="flex-1">
										<h5 className="font-medium text-sm mb-1">Timing Matters</h5>
										<p className="text-xs text-muted-foreground">
											Share polls when your audience is most active for better
											engagement.
										</p>
									</div>
								</div>
							</div>

							<Button variant="outline" className="w-full" size="sm">
								<Lightbulb className="mr-2 h-4 w-4" />
								Explore All Resources
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</AuthGuard>
	);
}
