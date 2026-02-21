import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

/**
 * Reusable proxy function to forward requests to the backend
 * with modified headers to satisfy CSRF protection.
 */
export async function proxyRequest(
	request: NextRequest,
	segments: string[],
	options: { addTrailingSlash?: boolean } = { addTrailingSlash: true },
) {
	// Always add trailing slash for Django API paths if requested (Django is strict about this)
	// segments[0] is usually "_allauth"
	const pathname = `/${segments.join("/")}${options.addTrailingSlash ? "/" : ""}`;
	console.log(`[Proxy] Forwarding to: ${pathname}`);
	const url = new URL(pathname, BACKEND_URL);
	url.search = request.nextUrl.search;
	console.log(
		`[Proxy] Incoming Method: ${request.method} | Destination: ${url.toString()}`,
	);

	const requestHeaders = new Headers(request.headers);

	// Extract CSRF token from cookies if present
	const csrfToken = request.cookies.get("csrftoken")?.value;

	// OVERRIDE: Set Origin and Referer to match the backend expectations
	// This is key for Django CSRF protection.
	// We want to pass the headers from the request but swap the HOST to match the backend if needed,
	// or ensure the origin is trusted.
	const origin = request.headers.get("origin");
	if (origin) {
		requestHeaders.set("Origin", BACKEND_URL);
	}
	const referer = request.headers.get("referer");
	if (referer) {
		try {
			const refererUrl = new URL(referer);
			refererUrl.host = new URL(BACKEND_URL).host;
			refererUrl.protocol = new URL(BACKEND_URL).protocol;
			requestHeaders.set("Referer", refererUrl.toString());
		} catch {
			requestHeaders.set("Referer", BACKEND_URL);
		}
	}

	// Delete headers that can cause issues when proxied
	requestHeaders.delete("host");
	requestHeaders.delete("connection");
	requestHeaders.delete("content-length");

	// Add CSRF token header if available
	if (csrfToken) {
		requestHeaders.set("X-CSRFToken", csrfToken);
	}

	// Forward the request using fetch
	try {
		// Prepare fetch options
		const fetchOptions: RequestInit & { duplex?: string } = {
			method: request.method,
			headers: requestHeaders,
			duplex: "half",
		};

		// Only attach body for non-GET/HEAD requests
		if (!["GET", "HEAD"].includes(request.method)) {
			// Consume body into an ArrayBuffer – avoids "fetch failed" caused by streaming mismatches
			let bodyBuffer: ArrayBuffer | Uint8Array = await request.arrayBuffer();

			// SECURITY HOTFIX: Intercept OAuth redirect requests to override callback_url server-side
			// This prevents redirect_uri_mismatch while keeping BACKEND_URL private.
			if (
				pathname === "/_allauth/browser/v1/auth/provider/redirect" &&
				request.method === "POST"
			) {
				const contentType = request.headers.get("content-type") || "";
				if (contentType.includes("application/x-www-form-urlencoded")) {
					const bodyString = new TextDecoder().decode(bodyBuffer);
					const params = new URLSearchParams(bodyString);

					if (params.get("provider") === "google") {
						const backendCallback = `${BACKEND_URL}/accounts/google/login/callback/`;
						console.log(
							`[Proxy] Overriding Google callback_url to: ${backendCallback}`,
						);
						params.set("callback_url", backendCallback);
						bodyBuffer = new TextEncoder().encode(params.toString());
					}
				}
			}

			console.log(
				`[Proxy] Body buffered, size: ${bodyBuffer.byteLength} bytes`,
			);
			if (bodyBuffer.byteLength > 0) {
				fetchOptions.body = bodyBuffer as BodyInit;
			}
		}

		const response = await fetch(url.toString(), {
			...fetchOptions,
			redirect: "manual", // Don't follow redirects – we need to return the location to the frontend
		});

		// Handle redirects (e.g., social login initiation or error redirection)
		if (response.status === 301 || response.status === 302) {
			const location = response.headers.get("Location");
			if (location) {
				console.log(`[Proxy] Redirect detected: ${location}`);

				// If the location is absolute and points to the backend, or is relative,
				// we need to ensure the browser goes to the correct frontend URL.
				let finalUrl: URL;
				try {
					finalUrl = new URL(location);
					// If it's an absolute URL pointing to the backend, swap it to frontend if it's a known frontend path
					// But usually, allauth returns absolute URLs to the frontend callback if configured correctly.
				} catch {
					// It's a relative path, point it to the frontend
					finalUrl = new URL(location, request.nextUrl.origin);
				}

				console.log(`[Proxy] Redirecting browser to: ${finalUrl.toString()}`);
				const redirectResponse = NextResponse.redirect(finalUrl, {
					status: response.status,
				});

				// IMPORTANT: Copy Set-Cookie headers to the redirect response!
				const setCookies = response.headers.getSetCookie();
				if (setCookies.length > 0) {
					for (const cookie of setCookies) {
						redirectResponse.headers.append("Set-Cookie", cookie);
					}
				}

				return redirectResponse;
			}
		}

		// Build response headers, removing some that might cause issues when proxied back
		const responseHeaders = new Headers();
		response.headers.forEach((value, key) => {
			if (key.toLowerCase() !== "content-encoding") {
				// We'll handle cookies specially if needed, but for now let's copy everything else
				responseHeaders.append(key, value);
			}
		});

		const nextResponse = new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});

		// Explicitly copy Set-Cookie headers to avoid merging issues
		// NextResponse.headers.set merges them, which can break browser cookie parsing
		const setCookies = response.headers.getSetCookie();
		if (setCookies.length > 0) {
			for (const cookie of setCookies) {
				nextResponse.headers.append("Set-Cookie", cookie);
			}
		}

		return nextResponse;
	} catch (error: unknown) {
		const err = error as {
			code?: string;
			message?: string;
			cause?: { code?: string };
		};
		console.error("Proxy Error:", error);

		// Handle specific network errors gracefully
		if (err.code === "ECONNREFUSED" || err.cause?.code === "ECONNREFUSED") {
			return NextResponse.json(
				{
					error: "Service Unavailable",
					details: "The backend server is not running or unreachable.",
				},
				{ status: 503 },
			);
		}

		if (err.code === "ECONNRESET" || err.cause?.code === "ECONNRESET") {
			return NextResponse.json(
				{
					error: "Bad Gateway",
					details: "The connection to the backend was reset. Please try again.",
				},
				{ status: 502 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to proxy request",
				details: String(err.message || error),
			},
			{ status: 502 },
		);
	}
}
