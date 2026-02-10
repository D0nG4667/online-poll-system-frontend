// Based on allauth-openapi.json & Project Nexus API.yaml

export interface User {
	id: string; // uuid
	email: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
}

export interface Provider {
	id: string;
	name: string;
	client_id: string;
	flows: ("provider_redirect" | "provider_token")[];
}

export interface VerifyEmailFlow {
	id: "verify_email";
	is_pending: boolean;
}

export interface ProviderSignupFlow {
	id: "provider_signup";
	provider: Provider;
	is_pending: boolean;
}

// Union of all possible flows
export interface Flow {
	id:
		| "login"
		| "signup"
		| "provider_redirect"
		| "provider_token"
		| "verify_email"
		| "provider_signup"
		| "login_by_code"
		| "mfa_authenticate";
	provider?: Provider;
	is_pending?: boolean;
}

export interface AuthError {
	code: string;
	message: string;
	param?: string;
}

export interface BaseAuthMeta {
	is_authenticated: boolean;
	session_token?: string;
}

export interface AuthData {
	user?: User;
	flows?: Flow[];
	methods?: Array<{
		method: "password" | "code" | "mfa" | "socialaccount";
		at: number;
		email?: string;
		provider?: string;
	}>;
	errors?: AuthError[];
}

export interface AllauthResponse<T = AuthData> {
	status: number;
	data?: T;
	meta?: BaseAuthMeta;
	errors?: AuthError[];
}

export interface LoginRequest {
	email?: string;
	username?: string;
	password?: string;
}

export interface SignupRequest {
	email: string;
	password?: string;
	username?: string;
	[key: string]: string | number | boolean | undefined; // Allow custom signup fields
}
