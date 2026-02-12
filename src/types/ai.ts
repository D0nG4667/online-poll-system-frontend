// AI Feature Types
export interface GeneratePollRequest {
	prompt: string; // Max 1000 chars
}

export interface AIGeneratedQuestion {
	text: string;
	question_type: "single" | "multiple" | "text";
	options: Array<{ text: string }>;
}

export interface GeneratedPollResponse {
	title: string;
	description: string;
	questions: AIGeneratedQuestion[];
	provider: string; // "openai" | "gemini"
}

export interface GenerateInsightRequest {
	poll_id: number;
	query: string; // Max 500 chars
}

export interface GenerateInsightResponse {
	query: string;
	insight: string;
	provider: string;
}

export interface IngestPollDataRequest {
	poll_id: number;
}

export interface IngestPollDataResponse {
	message: string;
	poll_id: number;
}

export interface AnalysisRequest {
	id: number;
	query: string;
	response: string;
	provider_used: string;
	created_at: string;
}
