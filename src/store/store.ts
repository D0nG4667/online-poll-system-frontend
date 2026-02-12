import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	persistReducer,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
import storage from "@/lib/storage";
import { aiApi } from "../services/aiApi";
import { analyticsApi } from "../services/analyticsApi";
import { authApi } from "../services/authApi";
import { pollsApi } from "../services/pollsApi";
import authReducer from "./features/auth/authSlice";

const rootReducer = combineReducers({
	auth: authReducer,
	[authApi.reducerPath]: authApi.reducer,
	[pollsApi.reducerPath]: pollsApi.reducer,
	[aiApi.reducerPath]: aiApi.reducer,
	[analyticsApi.reducerPath]: analyticsApi.reducer,
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"], // SECURE: Only persist auth state, not sensitive API caches
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
	return configureStore({
		reducer: persistedReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			})
				.concat(authApi.middleware)
				.concat(pollsApi.middleware)
				.concat(aiApi.middleware)
				.concat(analyticsApi.middleware),
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
