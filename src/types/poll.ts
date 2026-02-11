export interface Option {
	id: number;
	question: number;
	text: string;
	order: number;
	vote_count?: number;
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
	slug: string;
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
