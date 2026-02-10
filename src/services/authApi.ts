import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { logout, setCredentials } from "../store/features/auth/authSlice"; // Removed unused imports
import type { RootState } from "../store/store";

// Only import types if needed, but we can't import AuthState if it's not exported from store.
// We'll access the state via RootState.auth which is typed.

// Django Allauth Headless typically uses specific endpoints.
// We'll assume a standard configuration under /_allauth/app/v1/ or similar,
// but often proxied to /api/auth.
// For this MVP, we will use generic paths that the user can map,
// but formatted for the headless responses.

// Allauth Headless Response Structure
interface AllauthResponse<T = any> {
	status: number;
	data?: T;
	meta?: {
		session_token?: string;
		is_authenticated?: boolean;
		[key: string]: any;
	};
	errors?: Array<{
		code: string;
		message: string;
		param?: string;
	}>;
}

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		// Base URL points to the headless APP client root for token-based auth
		baseUrl: "http://localhost:8000/_allauth/app/v1",
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;
			if (token) {
				// Header used for 'app' client to authenticate sessions
				headers.set("X-Session-Token", token);
			}
			// Headless API prefers JSON
			headers.set("Accept", "application/json");
			return headers;
		},
	}),

	endpoints: (builder) => ({
		login: builder.mutation<AllauthResponse, any>({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
			}),
		}),
		signup: builder.mutation<AllauthResponse, any>({
			query: (userData) => ({
				url: "/auth/signup",
				method: "POST",
				body: userData,
			}),
		}),
		getSession: builder.query<AllauthResponse, void>({
			query: () => "/auth/session",
		}),
		logout: builder.mutation<AllauthResponse, void>({
			query: () => ({
				url: "/auth/session",
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useSignupMutation,
	useGetSessionQuery,
	useLogoutMutation,
} = authApi;
