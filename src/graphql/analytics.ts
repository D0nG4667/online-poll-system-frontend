import { gql } from "graphql-request";

// GraphQL Queries
export const GET_ANALYTICS_STATS = gql`
	query GetAnalyticsStats($period: String!) {
		analyticsStats(period: $period) {
			totalPolls
			totalResponses
			avgResponseRate
			totalViews
			pollsChange
			responsesChange
			responseRateChange
			viewsChange
		}
	}
`;

export const GET_ANALYTICS_TRENDS = gql`
	query GetAnalyticsTrends($period: String!) {
		analyticsTrends(period: $period) {
			pollCreation {
				date
				value
			}
			responseRate {
				date
				value
			}
		}
	}
`;

export const GET_TOP_POLLS = gql`
	query GetTopPolls($period: String!, $limit: Int!) {
		topPolls(period: $period, limit: $limit) {
			id
			title
			responses
			views
			responseRate
			status
			createdAt
		}
	}
`;

// Analytics Types
export interface AnalyticsStats {
	totalPolls: number;
	totalResponses: number;
	avgResponseRate: number;
	totalViews: number;
	pollsChange: number;
	responsesChange: number;
	responseRateChange: number;
	viewsChange: number;
}

export interface TrendDataPoint {
	date: string;
	value: number;
}

export interface TrendData {
	pollCreation: TrendDataPoint[];
	responseRate: TrendDataPoint[];
}

export interface TopPoll {
	id: number;
	title: string;
	responses: number;
	views: number;
	responseRate: number;
	status: "active" | "closed";
	createdAt: string;
}

export interface AnalyticsTrendsResponse {
	analyticsTrends: TrendData;
}

export interface AnalyticsStatsResponse {
	analyticsStats: AnalyticsStats;
}

export interface TopPollsResponse {
	topPolls: TopPoll[];
}
