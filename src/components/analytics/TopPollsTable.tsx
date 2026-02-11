"use client";

import { AlertCircle, ArrowUpRight, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetTopPollsQuery } from "@/services/analyticsApi";
import { PollDistribution } from "../polls/PollDistribution";

interface TopPollsTableProps {
	timePeriod: "7d" | "30d" | "90d" | "1y";
}

export function TopPollsTable({ timePeriod }: TopPollsTableProps) {
	const { data, isLoading, isError } = useGetTopPollsQuery(timePeriod);
	const [sharingPollId, setSharingPollId] = useState<number | string | null>(
		null,
	);
	const [sharingPollTitle, setSharingPollTitle] = useState<string>("");

	if (isLoading) {
		return (
			<div className="space-y-2">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

	// Use mock data if API fails or returns no data
	const useMockData = isError || !data || data.length === 0;
	const topPolls = useMockData ? getMockPolls() : data;

	return (
		<div className="space-y-2">
			{useMockData && (
				<div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
					<AlertCircle className="h-3 w-3" />
					<span>
						Showing demo data. Connect backend API to see real top polls.
					</span>
				</div>
			)}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Poll Title</TableHead>
							<TableHead className="text-right">Responses</TableHead>
							<TableHead className="text-right">Views</TableHead>
							<TableHead className="text-right">Response Rate</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="w-[50px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{topPolls.length > 0 ? (
							topPolls.map((poll) => (
								<TableRow key={poll.id}>
									<TableCell className="font-medium">{poll.title}</TableCell>
									<TableCell className="text-right">{poll.responses}</TableCell>
									<TableCell className="text-right">{poll.views}</TableCell>
									<TableCell className="text-right">
										{poll.response_rate.toFixed(1)}%
									</TableCell>
									<TableCell>
										<Badge
											variant={
												poll.status === "active" ? "default" : "secondary"
											}
										>
											{poll.status}
										</Badge>
									</TableCell>
									<TableCell className="flex gap-2">
										{!useMockData && (
											<>
												<Link
													href={`/polls/${poll.id}`}
													className="inline-flex items-center text-primary hover:underline"
												>
													<ArrowUpRight className="h-4 w-4" />
												</Link>
												<button
													type="button"
													onClick={() => {
														setSharingPollId(poll.id);
														setSharingPollTitle(poll.title);
													}}
													className="text-muted-foreground hover:text-primary transition-colors"
												>
													<Share2 className="h-4 w-4" />
												</button>
											</>
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center text-muted-foreground"
								>
									No polls yet. Create your first poll to see analytics!
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={!!sharingPollId}
				onOpenChange={(open) => !open && setSharingPollId(null)}
			>
				<DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent">
					{sharingPollId && (
						<PollDistribution pollId={sharingPollId} title={sharingPollTitle} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

function getMockPolls() {
	return [
		{
			id: 1,
			title: "Favorite Programming Language",
			responses: 247,
			views: 1043,
			response_rate: 23.7,
			status: "active" as const,
			created_at: new Date().toISOString(),
		},
		{
			id: 2,
			title: "Team Lunch Preferences",
			responses: 89,
			views: 156,
			response_rate: 57.1,
			status: "active" as const,
			created_at: new Date().toISOString(),
		},
		{
			id: 3,
			title: "Office Hours Feedback",
			responses: 45,
			views: 98,
			response_rate: 45.9,
			status: "closed" as const,
			created_at: new Date().toISOString(),
		},
	];
}
