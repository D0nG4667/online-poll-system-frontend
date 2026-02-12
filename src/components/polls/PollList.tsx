import { AlertCircle, FileQuestion } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Poll } from "@/types/poll";
import { EmptyState } from "../ui/empty-state";
import { PollTable } from "./PollTable";

interface PollListProps {
	polls?: Poll[];
	isLoading: boolean;
	error?: unknown;
}

export function PollList({ polls, isLoading, error }: PollListProps) {
	if (error) {
		return (
			<EmptyState
				title="Error loading polls"
				description="There was a problem fetching your polls. Please try again later."
				icon={AlertCircle}
				action={{
					label: "Retry",
					onClick: () => {
						window.location.reload();
					},
				}}
			/>
		);
	}

	if (isLoading) {
		return (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i + 1}`} className="flex flex-col space-y-3">
						<Skeleton className="h-[200px] w-full rounded-xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!polls?.length) {
		return (
			<EmptyState
				title="No polls found"
				description="You haven't created any polls yet. Get started by creating your first poll."
				icon={FileQuestion}
				action={{
					label: "Create Poll",
					onClick: () => {
						window.location.href = "/dashboard/create";
					},
				}}
			/>
		);
	}

	return <PollTable polls={polls} />;
}
