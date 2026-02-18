import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCSRFToken } from "../lib/csrf";
import type {
	AllauthResponse,
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
	tagTypes: ["Session"],
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
		 * Validates a password reset key via GET.
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
		}),
	}),
});

export const {
	useSigninMutation,
	useSignupMutation,
	useGetSessionQuery,
	useLogoutMutation,
	useRequestPasswordMutation,
	useResetPasswordMutation,
	useValidateResetKeyQuery,
	useProviderRedirectMutation,
	useProviderTokenMutation,
	useConfirmLoginCodeMutation,
} = authApi;
