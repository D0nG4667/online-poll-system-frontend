"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { QuestionCard } from "@/components/polls/QuestionCard";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoll } from "@/hooks/usePoll";

export default function PollDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const pollId = parseInt(id);
	const { poll, isLoading, error, handleVote, isVoting } = usePoll(pollId);

	// Simple state for single-question polls (MVP)
	// For multi-question, we'd need a map of questionId -> optionId
	const [selectedOption, setSelectedOption] = useState<number | null>(null);

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
					<ModeToggle />
				</div>

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
								{isVoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Submit Vote
							</Button>
						</div>
					</div>
				)}
			</div>
		</AuthGuard>
	);
}
