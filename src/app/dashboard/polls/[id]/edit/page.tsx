"use client";

import { ArrowLeft, PenBox } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { EditPollForm } from "@/components/polls/EditPollForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPollByIdQuery } from "@/services/pollsApi";

interface EditPollPageProps {
	params: Promise<{ id: string }>;
}

export default function EditPollPage({ params }: EditPollPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const pollId = parseInt(id);
	const { data: poll, isLoading, error } = useGetPollByIdQuery(pollId);

	return (
		<AuthGuard>
			<div className="container mx-auto py-10 max-w-4xl space-y-8 min-h-screen">
				{/* Header Section */}
				<div className="space-y-4">
					<Button
						variant="ghost"
						onClick={() => router.push("/dashboard/polls")}
						className="gap-2 pl-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to My Polls
					</Button>

					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div className="space-y-1">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/50">
									<PenBox className="h-6 w-6 text-orange-600 dark:text-orange-400" />
								</div>
								<h1 className="text-3xl font-bold tracking-tight">Edit Poll</h1>
							</div>
							<p className="text-muted-foreground max-w-lg">
								Modify your poll's title, description, and status. ✍️
							</p>
						</div>
					</div>
				</div>

				<div className="border-t border-muted/20" />

				{isLoading && (
					<div className="space-y-8">
						<CardSkeleton />
						<CardSkeleton />
					</div>
				)}

				{error && (
					<div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl border-2 border-dashed border-red-200 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/20">
						<div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
							<ArrowLeft className="h-8 w-8 text-red-600" />
						</div>
						<div className="space-y-1">
							<h2 className="text-2xl font-bold text-red-600">
								Failed to load poll
							</h2>
							<p className="text-muted-foreground">
								The poll you're trying to edit could not be found or you don't
								have access.
							</p>
						</div>
						<Button
							onClick={() => router.back()}
							variant="outline"
							className="rounded-xl"
						>
							Return to Dashboard
						</Button>
					</div>
				)}

				{!isLoading && poll && (
					<div className="pb-20">
						<EditPollForm poll={poll} />
					</div>
				)}
			</div>
		</AuthGuard>
	);
}

function CardSkeleton() {
	return (
		<div className="p-6 rounded-2xl border bg-muted/5 space-y-4">
			<Skeleton className="h-6 w-1/4 rounded-lg" />
			<Skeleton className="h-10 w-full rounded-xl" />
			<Skeleton className="h-32 w-full rounded-xl" />
		</div>
	);
}
