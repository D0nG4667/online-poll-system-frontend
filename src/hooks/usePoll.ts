import { useCallback } from "react";
import { toast } from "sonner";
import {
	useCastVoteMutation,
	useGetPollByIdQuery,
	useGetPollsQuery,
} from "@/services/pollsApi";

export const usePoll = (pollId: number | string) => {
	// Poll every 3 seconds if the poll is active (logic can be refined based on poll status)
	const {
		data: poll,
		isLoading,
		error,
		refetch,
	} = useGetPollByIdQuery(pollId, {
		pollingInterval: 3000,
	});

	const [castVote, { isLoading: isVoting }] = useCastVoteMutation();

	const handleVote = useCallback(
		async (optionId: number) => {
			try {
				await castVote({
					question: poll?.questions[0]?.id as number,
					option: optionId,
				}).unwrap();
				toast.success("Vote cast successfully!");
			} catch (err) {
				toast.error("Failed to cast vote. Please try again.");
				console.error("Vote error:", err);
			}
		},
		[castVote, poll],
	);

	return {
		poll,
		isLoading,
		error,
		handleVote,
		isVoting,
		refetch,
	};
};

export const usePolls = () => {
	const {
		data: polls,
		isLoading,
		error,
	} = useGetPollsQuery(undefined, {
		pollingInterval: 10000, // Refresh list every 10s
	});

	return {
		polls,
		isLoading,
		error,
	};
};
