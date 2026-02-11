import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type {
	AnalysisRequest,
	GeneratedPollResponse,
	GenerateInsightRequest,
	GenerateInsightResponse,
	GeneratePollRequest,
	IngestPollDataRequest,
	IngestPollDataResponse,
} from "../types/ai";

export const aiApi = createApi({
	reducerPath: "aiApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "/api/v1/ai",
		prepareHeaders: (headers, { getState }) => {
			const { sessionToken, accessToken } = (getState() as RootState).auth;

			if (accessToken) {
				headers.set("Authorization", `Bearer ${accessToken}`);
			} else if (sessionToken) {
				headers.set("X-Session-Token", sessionToken);
			}

			headers.set("Accept", "application/json");
			return headers;
		},
	}),

	tagTypes: ["Insights", "UNAUTHORIZED", "UNKNOWN_ERROR"],

	endpoints: (builder) => ({
		generatePoll: builder.mutation<GeneratedPollResponse, GeneratePollRequest>({
			query: (body) => ({
				url: "/generate-poll/",
				method: "POST",
				body,
			}),
		}),

		generateInsight: builder.mutation<
			GenerateInsightResponse,
			GenerateInsightRequest
		>({
			query: (body) => ({
				url: "/insights/generate/",
				method: "POST",
				body,
			}),
			invalidatesTags: (_result, _error, arg) => [
				{ type: "Insights", id: arg.poll_id },
			],
		}),

		ingestPollData: builder.mutation<
			IngestPollDataResponse,
			IngestPollDataRequest
		>({
			query: (body) => ({
				url: "/ingest/",
				method: "POST",
				body,
			}),
		}),

		getInsightHistory: builder.query<AnalysisRequest[], number>({
			query: (pollId) => `/insights/history/${pollId}/`,
			providesTags: (result, error, pollId) =>
				result
					? [{ type: "Insights", id: pollId }]
					: error?.status === 401
						? ["UNAUTHORIZED"]
						: ["UNKNOWN_ERROR"],
		}),
	}),
});

export const {
	useGeneratePollMutation,
	useGenerateInsightMutation,
	useIngestPollDataMutation,
	useGetInsightHistoryQuery,
} = aiApi;
