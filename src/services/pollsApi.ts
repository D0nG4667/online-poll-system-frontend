import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type {
	CreateVoteRequest,
	Option,
	Poll,
	Question,
	Vote,
} from "../types/poll";

export const pollsApi = createApi({
	reducerPath: "pollsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1`,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;
			if (token) {
				headers.set("X-Session-Token", token);
			}
			headers.set("Accept", "application/json");
			return headers;
		},
	}),
	tagTypes: ["Poll", "Vote"],
	endpoints: (builder) => ({
		getPolls: builder.query<Poll[], void>({
			query: () => "/polls/",
			providesTags: ["Poll"],
		}),
		getPollById: builder.query<Poll, number>({
			query: (id) => `/polls/${id}/`,
			providesTags: (result, error, id) => [{ type: "Poll", id }],
		}),
		castVote: builder.mutation<Vote, CreateVoteRequest>({
			query: (voteData) => ({
				url: "/votes/",
				method: "POST",
				body: voteData,
			}),
			invalidatesTags: ["Poll", "Vote"],
		}),
		createPoll: builder.mutation<Poll, Partial<Poll>>({
			query: (pollData) => ({
				url: "/polls/",
				method: "POST",
				body: pollData,
			}),
			invalidatesTags: ["Poll"],
		}),
		createQuestion: builder.mutation<Question, Partial<Question>>({
			query: (questionData) => ({
				url: "/questions/",
				method: "POST",
				body: questionData,
			}),
		}),
		createOption: builder.mutation<Option, Partial<Option>>({
			query: (optionData) => ({
				url: "/options/",
				method: "POST",
				body: optionData,
			}),
		}),
	}),
});

export const {
	useGetPollsQuery,
	useGetPollByIdQuery,
	useCastVoteMutation,
	useCreatePollMutation,
	useCreateQuestionMutation,
	useCreateOptionMutation,
} = pollsApi;
