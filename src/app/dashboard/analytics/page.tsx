"use client";

import {
	AlertCircle,
	ArrowLeft,
	BarChart3,
	Eye,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OverallInsightsPanel } from "@/components/analytics/OverallInsightsPanel";
import { PollTrendChart } from "@/components/analytics/PollTrendChart";
import { ResponseRateChart } from "@/components/analytics/ResponseRateChart";
import { TopPollsTable } from "@/components/analytics/TopPollsTable";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAnalyticsStatsQuery } from "@/services/analyticsApi";

type TimePeriod = "7d" | "30d" | "90d" | "1y";

export default function AnalyticsPage() {
	const router = useRouter();
	const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d");
	const { data: stats, isLoading: statsLoading } =
		useGetAnalyticsStatsQuery(timePeriod);

	return (
		<AuthGuard>
			<div className="container mx-auto py-8 space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Button
							variant="ghost"
							onClick={() => router.back()}
							className="gap-2 pl-0 mb-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Dashboard
						</Button>
						<h1 className="text-3xl font-bold tracking-tight">
							Analytics Dashboard
						</h1>
						<p className="text-muted-foreground">
							Comprehensive insights into your poll performance and engagement
						</p>
					</div>

					{/* Time Period Filter */}
					<div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
						{(["7d", "30d", "90d", "1y"] as TimePeriod[]).map((period) => (
							<Button
								key={period}
								variant={timePeriod === period ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setTimePeriod(period)}
								className="text-sm"
							>
								{period === "7d" && "7 Days"}
								{period === "30d" && "30 Days"}
								{period === "90d" && "90 Days"}
								{period === "1y" && "1 Year"}
							</Button>
						))}
					</div>
				</div>

				{/* Stats Cards */}
				{statsLoading ? (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{[1, 2, 3, 4].map((i) => (
							<Card key={i}>
								<CardHeader>
									<Skeleton className="h-4 w-24" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-8 w-16 mb-2" />
									<Skeleton className="h-3 w-32" />
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<>
						{!stats && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
								<AlertCircle className="h-4 w-4" />
								<span>
									Showing demo data. Connect backend analytics API to see real
									statistics.
								</span>
							</div>
						)}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Polls
									</CardTitle>
									<BarChart3 className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats?.total_polls ?? 12}
									</div>
									<p className="text-xs text-muted-foreground">
										{(stats?.polls_change ?? 8.2) > 0 ? "+" : ""}
										{stats?.polls_change ?? 8.2}% vs last period
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Responses
									</CardTitle>
									<TrendingUp className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats?.total_responses ?? 347}
									</div>
									<p className="text-xs text-muted-foreground">
										{(stats?.responses_change ?? -2.1) > 0 ? "+" : ""}
										{stats?.responses_change ?? -2.1}% vs last period
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Avg Response Rate
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats?.avg_response_rate ?? 68}%
									</div>
									<p className="text-xs text-muted-foreground">
										{(stats?.response_rate_change ?? 0) > 0 ? "+" : ""}
										{stats?.response_rate_change ?? 0}% vs last period
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Views
									</CardTitle>
									<Eye className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats?.total_views ?? 1243}
									</div>
									<p className="text-xs text-muted-foreground">
										{(stats?.views_change ?? 0) > 0 ? "+" : ""}
										{stats?.views_change ?? 0}% vs last period
									</p>
								</CardContent>
							</Card>
						</div>
					</>
				)}

				{/* Tabbed Analytics Sections */}
				<Tabs defaultValue="engagement" className="space-y-4">
					<TabsList>
						<TabsTrigger value="engagement">Engagement</TabsTrigger>
						<TabsTrigger value="performance">Performance</TabsTrigger>
						<TabsTrigger value="audience">Audience</TabsTrigger>
						<TabsTrigger value="quality">Quality</TabsTrigger>
						<TabsTrigger value="ai-insights">✨ AI Insights</TabsTrigger>
					</TabsList>

					<TabsContent value="engagement" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Poll Creation Trend</CardTitle>
								<CardDescription>
									Number of polls created over time
								</CardDescription>
							</CardHeader>
							<CardContent>
								<PollTrendChart timePeriod={timePeriod} />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="performance" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Response Rate Trend</CardTitle>
								<CardDescription>
									How your response rates are changing over time
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponseRateChart timePeriod={timePeriod} />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="audience" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Audience Demographics</CardTitle>
								<CardDescription>Coming soon</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] flex items-center justify-center text-muted-foreground">
									Audience analytics will be available in a future update
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="quality" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Poll Quality Metrics</CardTitle>
								<CardDescription>Coming soon</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] flex items-center justify-center text-muted-foreground">
									Quality metrics will be available in a future update
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="ai-insights" className="space-y-4">
						<OverallInsightsPanel timePeriod={timePeriod} />
					</TabsContent>
				</Tabs>

				{/* Top Performing Polls */}
				<Card>
					<CardHeader>
						<CardTitle>Top Performing Polls</CardTitle>
						<CardDescription>
							Your polls with the highest engagement
						</CardDescription>
					</CardHeader>
					<CardContent>
						<TopPollsTable timePeriod={timePeriod} />
					</CardContent>
				</Card>
			</div>
		</AuthGuard>
	);
}
