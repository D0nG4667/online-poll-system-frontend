export interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
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

export interface Question {
	id: number;
	text: string;
	question_type: "single" | "multiple"; // Enforce specific strings if possible
	order: number;
	options: Option[];
}

export interface Option {
	id: number;
	text: string;
	order: number;
	voteCount?: number;
}

export interface Vote {
	id: number;
	poll: number;
	question: number;
	option: number;
	user: number; // or string if UUID?
	created_at: string;
}

export interface CreateVoteRequest {
	question: number;
	option: number;
}
