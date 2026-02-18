import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { AllauthResponse, AuthError } from "@/types/auth";

/**
 * Maps Allauth headless errors to React Hook Form field errors.
 */
export function mapAllauthErrors<T extends FieldValues>(
	response: AllauthResponse,
	setError: UseFormSetError<T>,
	fallback?: (message: string) => void,
) {
	// 1. Process explicit errors from the backend if they exist
	if (response.errors && response.errors.length > 0) {
		let hasSetField = false;
		response.errors.forEach((err: AuthError) => {
			if (err.param) {
				const fieldName = err.param as Path<T>;
				setError(fieldName, {
					type: "server",
					message: err.message,
				});
				hasSetField = true;
			}
		});

		// If we have errors but none were mapped to fields, show the first one as fallback
		if (!hasSetField && fallback && response.errors[0]?.message) {
			fallback(response.errors[0].message);
		}
		return true;
	}

	// 2. Handle status-specific fallbacks only if no explicit errors were found
	if (response.status === 409) {
		const msg =
			"Conflict: This account may already exist, or you are already in a restricted session state.";
		if (fallback) fallback(msg);

		if ("email" in ({} as T)) {
			setError("email" as Path<T>, {
				type: "server",
				message: "Email taken or session conflict",
			});
		}
		return true;
	}

	if (response.status === 400 && fallback) {
		fallback("Validation error: Please check your inputs.");
		return true;
	}

	return false;
}

/**
 * Checks if a response indicates a successful authentication.
 */
export function isAuthSuccess(response: AllauthResponse): boolean {
	return response.status === 200 && (response.meta?.is_authenticated ?? false);
}

/**
 * Extracts error message for toast notifications.
 */
export function getFirstErrorMessage(response: AllauthResponse): string | null {
	if (response.errors && response.errors.length > 0) {
		return response.errors[0].message;
	}
	if (response.status === 409) return "Conflict: User already exists.";
	if (response.status === 401) return "Unauthorized: Invalid credentials.";
	if (response.status === 403) return "Forbidden: You don't have permission.";
	if (response.status === 429)
		return "Too many requests. Please try again later.";
	return null;
}
