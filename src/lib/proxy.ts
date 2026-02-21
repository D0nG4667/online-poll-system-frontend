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
	// Normalize the path for consistent comparison and Django routing.
	// segments[0] can be "_allauth" or "accounts" (from the catch-all route).
	const pathname = `/${segments.join("/")}${options.addTrailingSlash ? "/" : ""}`;
	const normalizedPath = pathname.endsWith("/")
		? pathname.slice(0, -1)
		: pathname;

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

	// Add Forwarded headers to tell the backend about the original request
	// This helps with building correct Absolute URLs for redirects.
	// Security/Protocol: For OAuth provider redirects (initiation), we force the backend host.
	// This ensures the redirect_uri sent to Google matches the authorized domain list.
	// For all other requests (including callbacks), we use the frontend host to ensure
	// that session cookies are correctly scoped to the user's browser domain.
	const isOAuthInitiation =
		normalizedPath === "/_allauth/browser/v1/auth/provider/redirect";

	if (isOAuthInitiation) {
		const backendHost = new URL(BACKEND_URL).host;
		requestHeaders.set("X-Forwarded-Host", backendHost);
	} else {
		requestHeaders.set("X-Forwarded-Host", request.nextUrl.host);
	}

	requestHeaders.set(
		"X-Forwarded-Proto",
		request.nextUrl.protocol.replace(":", ""),
	);
	requestHeaders.set(
		"X-Forwarded-For",
		request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"127.0.0.1",
	);

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

			// Intercept Google OAuth requests to manage redirect URIs server-side.
			if (isOAuthInitiation && request.method === "POST") {
				const contentType = request.headers.get("content-type") || "";
				if (contentType.includes("application/x-www-form-urlencoded")) {
					const bodyString = new TextDecoder().decode(bodyBuffer);
					const params = new URLSearchParams(bodyString);

					if (params.get("provider") === "google") {
						// Finalize the OAuth flow by directing the user back to the frontend callback.
						// By suppressing X-Forwarded-Host above, the backend handles Google communication
						// using its own domain, ensuring a valid handshake.
						const frontendCallback = `${request.nextUrl.origin}/account/provider/callback`;
						console.log(
							`[Proxy] Ensuring Google callback_url points to frontend: ${frontendCallback}`,
						);
						params.set("callback_url", frontendCallback);
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
