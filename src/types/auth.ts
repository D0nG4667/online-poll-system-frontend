// Based on allauth-openapi.json & Plaude Poll API.yaml and @octue/allauth-js structure

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

export interface Authenticator {
	id: number | string;
	type: "recovery_codes" | "totp" | "webauthn";
	created_at: number;
	last_used_at?: number;
}

export interface Session {
	id: number | string;
	created_at: number;
	ip: string;
	user_agent: string;
	is_current: boolean;
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
		| "mfa_authenticate"
		| "reauthenticate";
	provider?: Provider;
	is_pending?: boolean;
	types?: string[]; // e.g. ["totp", "recovery_codes"]
}

export interface AuthError {
	code: string;
	message: string;
	param?: string;
}

export interface BaseAuthMeta {
	is_authenticated: boolean;
}

export interface AuthenticatedMeta extends BaseAuthMeta {
	is_authenticated: true;
	session_token?: string; // Optional if using cookies
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
}

export interface AllauthResponse<T = AuthData> {
	status: number;
	data?: T;
	meta?: BaseAuthMeta | AuthenticatedMeta;
	errors?: AuthError[];
}

export interface SigninRequest {
	email?: string;
	username?: string;
	password?: string;
	login?: string; // support generic 'login' field
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
	callback_url?: string;
	process?: "login" | "connect";
}

export interface ProviderTokenRequest {
	provider: string;
	process?: "login" | "connect";
	token: {
		client_id?: string;
		access_token?: string;
		id_token?: string;
		code?: string;
	};
}

export interface ConfirmLoginCodeRequest {
	code: string;
}
