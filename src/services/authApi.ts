import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCSRFToken } from "../lib/csrf";
// import { logout, setCredentials } from "../store/features/auth/authSlice";
// Removed unused imports

// Only import types if needed, but we can't import AuthState if it's not exported from store.
// We'll access the state via RootState.auth which is typed.

// Django Allauth Headless typically uses specific endpoints.
// We'll assume a standard configuration under /_allauth/app/v1/ or similar,
// but often proxied to /api/auth.
// For this MVP, we will use generic paths that the user can map,
// but formatted for the headless responses.

import type {
	AllauthResponse,
	ProviderRedirectRequest,
	ProviderTokenRequest,
	RequestPasswordRequest,
	ResetPasswordRequest,
	SigninRequest,
	SignupRequest,
} from "../types/auth";

// Allauth Headless Response Structure
// Imported from types/auth.ts

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

	endpoints: (builder) => ({
		signin: builder.mutation<AllauthResponse, SigninRequest>({
			query: (credentials) => ({
				url: "auth/login",
				method: "POST",
				body: credentials,
			}),
		}),
		signup: builder.mutation<AllauthResponse, SignupRequest>({
			query: (userData) => ({
				url: "auth/signup",
				method: "POST",
				body: userData,
			}),
		}),
		getSession: builder.query<AllauthResponse, void>({
			query: () => "auth/session",
		}),
		logout: builder.mutation<AllauthResponse, void>({
			query: () => ({
				url: "auth/session",
				method: "DELETE",
			}),
		}),
		refreshToken: builder.mutation<AllauthResponse, { refresh_token: string }>({
			query: (body) => ({
				url: "auth/token", // Assuming token endpoint exists or is different for browser? Browser usu uses cookies.
				method: "POST",
				body,
			}),
		}),
		requestPassword: builder.mutation<AllauthResponse, RequestPasswordRequest>({
			query: (body) => ({
				url: "auth/password/request",
				method: "POST",
				body,
			}),
		}),
		resetPassword: builder.mutation<AllauthResponse, ResetPasswordRequest>({
			query: (body) => ({
				url: "auth/password/reset",
				method: "POST",
				body,
			}),
		}),
		validateResetKey: builder.query<AllauthResponse, string>({
			query: (key) => ({
				url: "auth/password/reset",
				headers: {
					"X-Password-Reset-Key": key,
				},
			}),
		}),
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
		providerToken: builder.mutation<AllauthResponse, ProviderTokenRequest>({
			query: (body) => ({
				url: "auth/provider/token",
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
	useRefreshTokenMutation,
	useRequestPasswordMutation,
	useResetPasswordMutation,
	useValidateResetKeyQuery,
	useProviderRedirectMutation,
	useProviderTokenMutation,
} = authApi;
