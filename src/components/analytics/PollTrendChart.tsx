"use client";

import { AlertCircle } from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAnalyticsTrendsQuery } from "@/services/analyticsApi";

interface PollTrendChartProps {
	timePeriod: "7d" | "30d" | "90d" | "1y";
}

export function PollTrendChart({ timePeriod }: PollTrendChartProps) {
	const { data, isLoading, isError } = useGetAnalyticsTrendsQuery(timePeriod);

	if (isLoading) {
		return (
			<div className="h-[300px] flex items-center justify-center">
				<Skeleton className="h-full w-full" />
			</div>
		);
	}

	// Use mock data if API fails or returns no data
	const useMockData = isError || !data;
	const chartData = useMockData
		? generateMockData(timePeriod)
		: data.poll_creation.map((point) => ({
				date: new Date(point.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				polls: point.value,
			}));

	return (
		<div className="space-y-2">
			{useMockData && (
				<div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
					<AlertCircle className="h-3 w-3" />
					<span>
						Showing demo data. Connect backend API to see real analytics.
					</span>
				</div>
			)}
			<ResponsiveContainer width="100%" height={300}>
				<AreaChart data={chartData}>
					<defs>
						<linearGradient id="colorPolls" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
							<stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					<XAxis
						dataKey="date"
						className="text-xs"
						tick={{ fill: "hsl(var(--muted-foreground))" }}
					/>
					<YAxis
						className="text-xs"
						tick={{ fill: "hsl(var(--muted-foreground))" }}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--background))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "8px",
						}}
					/>
					<Area
						type="monotone"
						dataKey="polls"
						stroke="#FF6B6B"
						fillOpacity={1}
						fill="url(#colorPolls)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

function generateMockData(period: string) {
	const dataPoints =
		period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
	const data = [];

	for (let i = dataPoints; i > 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const formattedDate = date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});

		data.push({
			date: formattedDate,
			polls: Math.floor(Math.random() * 5) + 1,
		});
	}

	return data;
}
