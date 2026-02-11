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
	// This is key for Django CSRF protection
	requestHeaders.set("Origin", BACKEND_URL);
	requestHeaders.set("Referer", BACKEND_URL);
	// host is better left to fetch to handle correctly

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
			const bodyBuffer = await request.arrayBuffer();
			console.log(
				`[Proxy] Body buffered, size: ${bodyBuffer.byteLength} bytes`,
			);
			if (bodyBuffer.byteLength > 0) {
				fetchOptions.body = bodyBuffer;
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
				return NextResponse.redirect(finalUrl, {
					status: response.status,
				});
			}
		}

		// Build response headers, removing some that might cause issues when proxied back
		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete("content-encoding"); // Let Next.js handle compression

		return new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
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
