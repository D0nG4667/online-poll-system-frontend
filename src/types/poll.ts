export interface Option {
	id: number;
	question: number;
	text: string;
	order: number;
	// vote_count is not in schema but often needed for UI.
	// If backend doesn't send it, we might need to calculate it from a separate 'results' endpoint or if the serializer includes it.
	// For now, sticking to strict schema, will add if backend provides it.
}

export type QuestionType = "single" | "multiple" | "text";

export interface Question {
	id: number;
	poll: number;
	text: string;
	question_type: QuestionType;
	order: number;
	options: Option[];
}

export interface Poll {
	id: number;
	title: string;
	description: string;
	created_by: string; // user id or username? Schema says string.
	start_date: string; // ISO date string
	end_date: string | null; // ISO date string
	is_active: boolean;
	is_open: boolean;
	questions: Question[];
	created_at: string;
	updated_at: string;
}

export interface Vote {
	id: number;
	user: string; // UUID string
	question: number;
	option: number;
	created_at: string;
}

export interface CreateVoteRequest {
	question: number;
	option: number;
}
