import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8000";

/**
 * Reusable proxy function to forward requests to the backend
 * with modified headers to satisfy CSRF protection.
 */
export async function proxyRequest(request: NextRequest, segments: string[]) {
	const pathname = `/${segments.join("/")}`;
	const url = new URL(pathname, BACKEND_URL);
	url.search = request.nextUrl.search;

	const requestHeaders = new Headers(request.headers);

	// OVERRIDE: Set Origin and Host to match the backend expectations
	// This is the key fix for "Origin checking failed" (CSRF 403)
	requestHeaders.set("Origin", BACKEND_URL);
	requestHeaders.set("Host", "localhost:8000");

	// Forward the request using fetch
	try {
		const response = await fetch(url.toString(), {
			method: request.method,
			headers: requestHeaders,
			body: request.body,
			// @ts-expect-error - 'duplex' is required for streaming request bodies in some environments
			duplex: "half",
		});

		// Build response headers, removing some that might cause issues when proxied back
		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete("content-encoding"); // Let Next.js handle compression

		return new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error("Proxy Error:", error);
		return NextResponse.json(
			{ error: "Failed to proxy request", details: String(error) },
			{ status: 502 },
		);
	}
}
