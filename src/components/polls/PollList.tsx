import { Skeleton } from "@/components/ui/skeleton";
import type { Poll } from "@/types/poll";
import { PollCard } from "./PollCard";

interface PollListProps {
	polls?: Poll[];
	isLoading: boolean;
}

export function PollList({ polls, isLoading }: PollListProps) {
	if (isLoading) {
		return (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex flex-col space-y-3">
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
			<div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed text-center animate-in fade-in-50">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="h-10 w-10 text-muted-foreground"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
						/>
					</svg>
				</div>
				<h3 className="mt-4 text-lg font-semibold">No polls found</h3>
				<p className="mb-4 mt-2 text-sm text-muted-foreground">
					There are no active polls at the moment. Check back later.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{polls.map((poll) => (
				<PollCard key={poll.id} poll={poll} />
			))}
		</div>
	);
}
