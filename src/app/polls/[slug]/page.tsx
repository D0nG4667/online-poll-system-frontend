"use client";

import { ArrowLeft, BarChart2, Loader2, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel";
import AuthGuard from "@/components/auth/AuthGuard";
import { PollDistribution } from "@/components/polls/PollDistribution";
import { PollResults } from "@/components/polls/PollResults";
import { QuestionCard } from "@/components/polls/QuestionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoll } from "@/hooks/usePoll";

export default function PollDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = use(params);
	const router = useRouter();
	const { poll, isLoading, error, handleVote, isVoting } = usePoll(slug);

	// Redirect to slug if we loaded via ID and slug exists
	// This ensures users always see the slug in the URL
	useEffect(() => {
		if (poll?.slug && poll?.id && slug === poll.id.toString()) {
			router.replace(`/polls/${poll.slug}`);
		}
	}, [poll, slug, router]);

	// Simple state for single-question polls (MVP)
	// For multi-question, we'd need a map of questionId -> optionId
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [viewMode, setViewMode] = useState<"vote" | "results" | "insights">(
		"vote",
	);
	const [isShareOpen, setIsShareOpen] = useState(false);

	return (
		<AuthGuard>
			<div className="container mx-auto py-10 max-w-3xl space-y-8">
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="gap-2 pl-0"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Dashboard
					</Button>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsShareOpen(true)}
							className="rounded-xl border-dashed"
						>
							<Share2 className="h-4 w-4 mr-2 text-primary" />
							Share Poll
						</Button>
						<ModeToggle />
					</div>
				</div>

				<Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
					<DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent">
						<DialogTitle className="sr-only">Share Poll</DialogTitle>
						{poll && (
							<PollDistribution
								pollId={poll.id}
								pollSlug={poll.slug}
								title={poll.title}
								initialDescription={poll.description}
							/>
						)}
					</DialogContent>
				</Dialog>

				{isLoading && (
					<div className="space-y-6">
						<Skeleton className="h-12 w-3/4" />
						<Skeleton className="h-6 w-1/2" />
						<div className="space-y-4 pt-4">
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
					</div>
				)}

				{error && (
					<div className="text-center py-20 text-red-500">
						<h2 className="text-2xl font-bold">Error loading poll</h2>
						<p>Please try again later or check your connection.</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => router.back()}
						>
							Return to Safe Zone
						</Button>
					</div>
				)}

				{poll && (
					<div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-5">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tight">
								{poll.title}
							</h1>
							<p className="text-muted-foreground text-lg">
								{poll.description}
							</p>
						</div>

						<div className="flex justify-between items-center bg-muted/30 p-1 rounded-lg w-fit mb-6">
							<Button
								variant={viewMode === "vote" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setViewMode("vote")}
								className="text-sm"
							>
								Vote
							</Button>
							<Button
								variant={viewMode === "results" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setViewMode("results")}
								className="text-sm"
							>
								<BarChart2 className="h-4 w-4 mr-1" />
								Results
							</Button>
							<Button
								variant={viewMode === "insights" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setViewMode("insights")}
								className="text-sm"
							>
								✨ AI Insights
							</Button>
						</div>

						{viewMode === "vote" ? (
							<>
								<div className="space-y-6">
									{poll.questions.map((question) => (
										<QuestionCard
											key={question.id}
											question={question}
											selectedOption={selectedOption}
											onSelectOption={setSelectedOption}
											disabled={isVoting || !poll.is_active || !poll.is_open}
										/>
									))}
								</div>

								<div className="flex justify-end pt-4">
									<Button
										size="lg"
										variant="unicorn"
										disabled={
											!selectedOption ||
											isVoting ||
											!poll.is_active ||
											!poll.is_open
										}
										onClick={() => selectedOption && handleVote(selectedOption)}
									>
										{isVoting && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Submit Vote
									</Button>
								</div>
							</>
						) : viewMode === "results" ? (
							<PollResults poll={poll} />
						) : (
							<AIInsightsPanel pollId={poll.id} />
						)}
					</div>
				)}
			</div>
		</AuthGuard>
	);
}
