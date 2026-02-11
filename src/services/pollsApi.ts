import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCSRFToken } from "../lib/csrf";
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
		baseUrl: "/api/v1",
		credentials: "include",
		prepareHeaders: (headers, { getState }) => {
			const { sessionToken, accessToken } = (getState() as RootState).auth;

			if (accessToken) {
				headers.set("Authorization", `Bearer ${accessToken}`);
			} else if (sessionToken) {
				headers.set("X-Session-Token", sessionToken);
			}

			// Add CSRF token for Django
			const csrfToken = getCSRFToken();
			if (csrfToken) {
				headers.set("X-CSRFToken", csrfToken);
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
		getPollById: builder.query<Poll, number | string>({
			query: (idOrSlug) => `/polls/${idOrSlug}/`,
			providesTags: (_result, _error, idOrSlug) => [
				{ type: "Poll", id: idOrSlug },
			],
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
		deletePoll: builder.mutation<void, number | string>({
			query: (id) => ({
				url: `/polls/${id}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Poll"],
		}),
		updatePoll: builder.mutation<
			Poll,
			{ id: number | string; data: Partial<Poll> }
		>({
			query: ({ id, data }) => ({
				url: `/polls/${id}/`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Poll", id },
				"Poll",
			],
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
	useDeletePollMutation,
	useUpdatePollMutation,
} = pollsApi;
