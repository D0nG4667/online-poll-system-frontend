import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GraphQLClient } from "graphql-request";
import {
	type AnalyticsStats,
	type AnalyticsStatsResponse,
	type AnalyticsTrendsResponse,
	GET_ANALYTICS_STATS,
	GET_ANALYTICS_TRENDS,
	GET_TOP_POLLS,
	type TopPoll,
	type TopPollsResponse,
	type TrendData,
} from "@/graphql/analytics";
import { getCSRFToken } from "@/lib/csrf";
import type { RootState } from "@/store/store";

// GraphQL base query
const graphqlBaseQuery =
	(): BaseQueryFn<
		{ document: string; variables?: Record<string, unknown> },
		unknown,
		{ status: number; data: unknown }
	> =>
	async ({ document, variables }, { getState }) => {
		try {
			const { sessionToken, accessToken } = (getState() as RootState).auth;

			const client = new GraphQLClient("/api/graphql", {
				headers: {
					...(accessToken
						? { Authorization: `Bearer ${accessToken}` }
						: sessionToken
							? { "X-Session-Token": sessionToken }
							: {}),
					"X-CSRFToken": getCSRFToken() || "",
					Accept: "application/json",
				},
				// Ensure fetch includes credentials for CSRF cookies
				fetch: (url, options) =>
					fetch(url, { ...options, credentials: "include" }),
			});

			const data = await client.request(document, variables);
			return { data };
		} catch (error: unknown) {
			const err = error as { response?: { status: number }; message: string };
			return {
				error: {
					status: err.response?.status ?? 500,
					data: err.message,
				},
			};
		}
	};

export const analyticsApi = createApi({
	reducerPath: "analyticsApi",
	baseQuery: graphqlBaseQuery(),
	tagTypes: ["Analytics", "UNAUTHORIZED", "UNKNOWN_ERROR"],

	endpoints: (builder) => ({
		// Get overall statistics
		getAnalyticsStats: builder.query<AnalyticsStats, string>({
			query: (period) => ({
				document: GET_ANALYTICS_STATS,
				variables: { period },
			}),
			transformResponse: (response: AnalyticsStatsResponse) =>
				response.analyticsStats,
			providesTags: (result, error) =>
				result
					? ["Analytics"]
					: error?.status === 401
						? ["UNAUTHORIZED"]
						: ["UNKNOWN_ERROR"],
		}),

		// Get trend data for charts
		getAnalyticsTrends: builder.query<TrendData, string>({
			query: (period) => ({
				document: GET_ANALYTICS_TRENDS,
				variables: { period },
			}),
			transformResponse: (response: AnalyticsTrendsResponse) =>
				response.analyticsTrends,
			providesTags: (result, error) =>
				result
					? ["Analytics"]
					: error?.status === 401
						? ["UNAUTHORIZED"]
						: ["UNKNOWN_ERROR"],
		}),

		// Get top performing polls
		getTopPolls: builder.query<TopPoll[], string>({
			query: (period) => ({
				document: GET_TOP_POLLS,
				variables: { period, limit: 10 },
			}),
			transformResponse: (response: TopPollsResponse) => response.topPolls,
			providesTags: (result, error) =>
				result
					? ["Analytics"]
					: error?.status === 401
						? ["UNAUTHORIZED"]
						: ["UNKNOWN_ERROR"],
		}),
	}),
});

export const {
	useGetAnalyticsStatsQuery,
	useGetAnalyticsTrendsQuery,
	useGetTopPollsQuery,
} = analyticsApi;
