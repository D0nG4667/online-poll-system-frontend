import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../../types/auth";

interface AuthState {
	user: User | null;
	sessionToken: string | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	sessionToken: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{
				user: AuthState["user"];
				sessionToken?: string;
				accessToken?: string;
				refreshToken?: string;
			}>,
		) => {
			state.user = action.payload.user;
			state.sessionToken = action.payload.sessionToken || null;
			state.accessToken = action.payload.accessToken || null;
			state.refreshToken = action.payload.refreshToken || null;
			state.isAuthenticated = !!action.payload.user;
		},
		logout: (state) => {
			state.user = null;
			state.sessionToken = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
