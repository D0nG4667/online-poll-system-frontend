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
import storage from "redux-persist/lib/storage";
import { authApi } from "../services/authApi";
import { pollsApi } from "../services/pollsApi";
import authReducer from "./features/auth/authSlice";

const rootReducer = combineReducers({
	auth: authReducer,
	[authApi.reducerPath]: authApi.reducer,
	[pollsApi.reducerPath]: pollsApi.reducer,
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
				.concat(pollsApi.middleware),
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
