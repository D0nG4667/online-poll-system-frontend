import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { logout, setCredentials } from "../store/features/auth/authSlice";
// Removed unused imports
import type { RootState } from "../store/store";

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
		// Base URL points to the headless client root
		baseUrl: "/allauth",
		prepareHeaders: (headers, { getState }) => {
			const { sessionToken, accessToken } = (getState() as RootState).auth;

			if (accessToken) {
				// Use JWT if available
				headers.set("Authorization", `Bearer ${accessToken}`);
			} else if (sessionToken) {
				// Fallback to Session Token
				headers.set("X-Session-Token", sessionToken);
			}

			// Headless API prefers JSON
			headers.set("Accept", "application/json");
			return headers;
		},
	}),

	endpoints: (builder) => ({
		signin: builder.mutation<AllauthResponse, SigninRequest>({
			query: (credentials) => ({
				url: "/app/v1/auth/login",
				method: "POST",
				body: credentials,
			}),
		}),
		signup: builder.mutation<AllauthResponse, SignupRequest>({
			query: (userData) => ({
				url: "/app/v1/auth/signup",
				method: "POST",
				body: userData,
			}),
		}),
		getSession: builder.query<AllauthResponse, void>({
			query: () => "/app/v1/auth/session",
		}),
		logout: builder.mutation<AllauthResponse, void>({
			query: () => ({
				url: "/app/v1/auth/session",
				method: "DELETE",
			}),
		}),
		refreshToken: builder.mutation<AllauthResponse, { refresh_token: string }>({
			query: (body) => ({
				url: "/app/v1/tokens/refresh",
				method: "POST",
				body,
			}),
		}),
		requestPassword: builder.mutation<AllauthResponse, RequestPasswordRequest>({
			query: (body) => ({
				url: "/app/v1/auth/password/request",
				method: "POST",
				body,
			}),
		}),
		resetPassword: builder.mutation<AllauthResponse, ResetPasswordRequest>({
			query: (body) => ({
				url: "/app/v1/auth/password/reset",
				method: "POST",
				body,
			}),
		}),
		validateResetKey: builder.query<AllauthResponse, string>({
			query: (key) => ({
				url: "/app/v1/auth/password/reset",
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
				url: "/browser/v1/auth/provider/redirect",
				method: "POST",
				body,
			}),
		}),
		providerToken: builder.mutation<AllauthResponse, ProviderTokenRequest>({
			query: (body) => ({
				url: "/app/v1/auth/provider/token",
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
