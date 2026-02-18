import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCSRFToken } from "../lib/csrf";
import type {
	AllauthResponse,
	ChangePasswordRequest,
	ConfirmLoginCodeRequest,
	ProviderRedirectRequest,
	ProviderTokenRequest,
	RequestPasswordRequest,
	ResetPasswordRequest,
	SigninRequest,
	SignupRequest,
} from "../types/auth";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		// Base URL points to the headless client root for browser (cookie-based)
		baseUrl: "/_allauth/browser/v1",
		credentials: "include",
		prepareHeaders: (headers) => {
			// For browser client, we rely on cookies (sessionid, csrftoken)
			// effectively handled by the browser automatically with credentials: "include".

			// Add CSRF token for Django
			const csrfToken = getCSRFToken();
			if (csrfToken) {
				headers.set("X-CSRFToken", csrfToken);
			}

			// Headless API prefers JSON
			headers.set("Accept", "application/json");
			return headers;
		},
	}),
	tagTypes: ["Session", "EmailAddresses", "Providers", "Configuration"],
	endpoints: (builder) => ({
		/**
		 * Authenticates a user using email and password.
		 */
		signin: builder.mutation<AllauthResponse, SigninRequest>({
			query: (credentials) => ({
				url: "auth/login",
				method: "POST",
				body: credentials,
			}),
			invalidatesTags: ["Session"],
		}),

		/**
		 * Registers a new user.
		 */
		signup: builder.mutation<AllauthResponse, SignupRequest>({
			query: (userData) => ({
				url: "auth/signup",
				method: "POST",
				body: userData,
			}),
			invalidatesTags: ["Session"],
		}),

		/**
		 * Retrieves the current session status.
		 */
		getSession: builder.query<AllauthResponse, void>({
			query: () => "auth/session",
			providesTags: ["Session"],
		}),

		/**
		 * Terminated the current session.
		 */
		logout: builder.mutation<AllauthResponse, void>({
			query: () => ({
				url: "auth/session",
				method: "DELETE",
			}),
			invalidatesTags: ["Session"],
		}),

		/**
		 * Requests a password reset email.
		 */
		requestPassword: builder.mutation<AllauthResponse, RequestPasswordRequest>({
			query: (body) => ({
				url: "auth/password/request",
				method: "POST",
				body,
			}),
		}),

		/**
		 * Resets password using a key.
		 */
		resetPassword: builder.mutation<AllauthResponse, ResetPasswordRequest>({
			query: (body) => ({
				url: "auth/password/reset",
				method: "POST",
				body,
			}),
		}),

		/**
		 * Validates a password reset key/code via GET.
		 */
		validateResetKey: builder.query<AllauthResponse, string>({
			query: (key) => ({
				url: "auth/password/reset",
				headers: {
					"X-Password-Reset-Key": key,
				},
			}),
		}),

		/**
		 * Completes email verification.
		 */
		verifyEmail: builder.mutation<AllauthResponse, { key: string }>({
			query: (body) => ({
				url: "auth/email/verify",
				method: "POST",
				body,
			}),
			invalidatesTags: ["EmailAddresses", "Session"],
		}),

		/**
		 * Resends the email verification code.
		 */
		resendEmailVerification: builder.mutation<AllauthResponse, void>({
			query: () => ({
				url: "auth/email/verify/resend",
				method: "POST",
			}),
		}),

		/**
		 * Requests a login code (passwordless).
		 */
		requestLoginCode: builder.mutation<
			AllauthResponse,
			{ email?: string; phone?: string }
		>({
			query: (body) => ({
				url: "auth/code/request",
				method: "POST",
				body,
			}),
		}),

		/**
		 * Initiates provider redirect for social auth.
		 */
		providerRedirect: builder.mutation<
			{ location: string },
			ProviderRedirectRequest
		>({
			query: (body) => ({
				url: "auth/provider/redirect",
				method: "POST",
				body,
			}),
		}),

		/**
		 * Handles provider token exchange.
		 */
		providerToken: builder.mutation<AllauthResponse, ProviderTokenRequest>({
			query: (body) => ({
				url: "auth/provider/token",
				method: "POST",
				body,
			}),
		}),

		/**
		 * Confirms a login code (passwordless).
		 */
		confirmLoginCode: builder.mutation<
			AllauthResponse,
			ConfirmLoginCodeRequest
		>({
			query: (body) => ({
				url: "auth/code/confirm",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Session"],
		}),

		/**
		 * Changes the password for the authenticated user.
		 */
		changePassword: builder.mutation<AllauthResponse, ChangePasswordRequest>({
			query: (body) => ({
				url: "account/password/change",
				method: "POST",
				body,
			}),
		}),

		/**
		 * Lists all connected third-party accounts.
		 */
		getProviders: builder.query<AllauthResponse, void>({
			query: () => "account/providers",
			providesTags: ["Providers"],
		}),

		/**
		 * Retrieves the static configuration of allauth.
		 */
		getConfiguration: builder.query<AllauthResponse, void>({
			query: () => "config",
			providesTags: ["Configuration"],
		}),

		/**
		 * Refreshes the access token (app flavor).
		 */
		refreshToken: builder.mutation<AllauthResponse, { refresh_token: string }>({
			query: (body) => ({
				url: "/_allauth/app/v1/tokens/refresh",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const {
	useGetConfigurationQuery,
	useSigninMutation,
	useSignupMutation,
	useGetSessionQuery,
	useLogoutMutation,
	useRequestPasswordMutation,
	useResetPasswordMutation,
	useValidateResetKeyQuery,
	useVerifyEmailMutation,
	useResendEmailVerificationMutation,
	useRequestLoginCodeMutation,
	useConfirmLoginCodeMutation,
	useProviderRedirectMutation,
	useProviderTokenMutation,
	useChangePasswordMutation,
	useGetProvidersQuery,
	useRefreshTokenMutation,
} = authApi;
