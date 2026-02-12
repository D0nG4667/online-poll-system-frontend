"use client";

import { AlertCircle } from "lucide-react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAnalyticsTrendsQuery } from "@/services/analyticsApi";

interface ResponseRateChartProps {
	timePeriod: "7d" | "30d" | "90d" | "1y";
}

export function ResponseRateChart({ timePeriod }: ResponseRateChartProps) {
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
		: data.responseRate.map((point) => ({
				date: new Date(point.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				rate: point.value,
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
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					<XAxis
						dataKey="date"
						className="text-xs"
						tick={{ fill: "hsl(var(--muted-foreground))" }}
					/>
					<YAxis
						className="text-xs"
						tick={{ fill: "hsl(var(--muted-foreground))" }}
						domain={[0, 100]}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--background))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "8px",
						}}
						formatter={(value: number | undefined) =>
							value !== undefined
								? [`${value}%`, "Response Rate"]
								: ["0%", "Response Rate"]
						}
					/>
					<Line
						type="monotone"
						dataKey="rate"
						stroke="#51CF66"
						strokeWidth={2}
						dot={{ fill: "#51CF66", r: 3 }}
						activeDot={{ r: 5 }}
					/>
				</LineChart>
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
			rate: Math.floor(Math.random() * 30) + 50, // 50-80% range
		});
	}

	return data;
}
