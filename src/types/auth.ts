// Based on be-schema/allauth-openapi.json (django-allauth: Headless API)

export interface User {
	id: string; // uuid
	display: string;
	email?: string;
	has_usable_password: boolean;
	[key: string]: unknown;
}

export interface AuthError {
	code: string;
	message: string;
	param?: string;
}

export interface BaseAuthMeta {
	session_token?: string; // For 'app' clients
	access_token?: string; // For 'app' clients
	refresh_token?: string; // For 'app' clients
}

export interface AuthenticationMeta extends BaseAuthMeta {
	is_authenticated: boolean;
}

export interface AuthenticatedMeta extends AuthenticationMeta {
	is_authenticated: true;
}

export interface Provider {
	id: string;
	name: string;
	client_id?: string;
	openid_configuration_url?: string;
	flows: ("provider_redirect" | "provider_token")[];
}

export interface Flow {
	id:
		| "login"
		| "login_by_code"
		| "mfa_authenticate"
		| "mfa_reauthenticate"
		| "provider_redirect"
		| "provider_signup"
		| "provider_token"
		| "reauthenticate"
		| "signup"
		| "verify_email"
		| "verify_phone";
	provider?: Provider;
	is_pending?: boolean;
	types?: ("recovery_codes" | "totp" | "webauthn")[];
}

export interface AuthenticationMethod {
	method: "password" | "password_reset" | "code" | "socialaccount" | "mfa";
	at: number; // epoch timestamp
	email?: string;
	username?: string;
	phone?: string;
	provider?: string;
	uid?: string;
	type?: "recovery_codes" | "totp" | "webauthn";
	reauthenticated?: boolean;
}

/**
 * Data structure for 200 OK responses (Authenticated)
 */
export interface AuthenticatedData {
	user: User;
	methods: AuthenticationMethod[];
}

/**
 * Data structure for 401 Unauthorized responses (Authentication Required)
 */
export interface AuthenticationRequiredData {
	flows: Flow[];
	user?: User; // Present in reauthentication
	methods?: AuthenticationMethod[]; // Present in reauthentication
}

export interface AllauthResponse<
	T = AuthenticatedData | AuthenticationRequiredData,
> {
	status: number;
	data?: T;
	meta: AuthenticationMeta;
	errors?: AuthError[];
}

// Request Types
export interface LoginRequest {
	password?: string;
	email?: string;
	username?: string;
	phone?: string;
}

// Keep SigninRequest as alias for backward compatibility or use the spec name
export type SigninRequest = LoginRequest;

export interface SignupRequest {
	email: string;
	password?: string;
	[key: string]: unknown; // For custom fields like 'name', 'confirm_password'
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
	process?: "login" | "connect";
}

export interface ProviderTokenRequest {
	provider: string;
	process: "login" | "connect";
	token: {
		client_id: string;
		id_token?: string;
		access_token?: string;
	};
}

export interface ProviderSignupRequest {
	email: string;
	[key: string]: unknown;
}

export interface VerifyEmailRequest {
	key: string;
}

export interface ConfirmLoginCodeRequest {
	code: string;
}

export interface ChangePasswordRequest {
	current_password?: string;
	new_password: string;
}
