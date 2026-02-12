// Based on allauth-openapi.json & Plaude Poll API.yaml

export interface User {
	id: string; // uuid
	email: string;
	display?: string; // Allauth display name
	first_name?: string;
	last_name?: string;
	is_active?: boolean;
	has_usable_password?: boolean;
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
		| "signin"
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
	access_token?: string;
	refresh_token?: string;
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

export interface SigninRequest {
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

export interface RequestPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	key: string;
	password: string;
}

export interface ProviderRedirectRequest {
	provider: string;
	callback_url: string;
	process: "login" | "connect";
}

export interface ProviderTokenRequest {
	provider: string;
	process: "login" | "connect";
	token: {
		client_id: string;
		access_token?: string;
		id_token?: string;
	};
}
