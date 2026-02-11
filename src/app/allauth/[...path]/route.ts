import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	console.log(`[Allauth Route] GET /allauth/${path.join("/")}`);
	return proxyRequest(request, ["_allauth", ...path], {
		addTrailingSlash: false,
	});
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	console.log(`[Allauth Route] POST /allauth/${path.join("/")}`);
	return proxyRequest(request, ["_allauth", ...path], {
		addTrailingSlash: false,
	});
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["_allauth", ...path], {
		addTrailingSlash: false,
	});
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["_allauth", ...path], {
		addTrailingSlash: false,
	});
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["_allauth", ...path], {
		addTrailingSlash: false,
	});
}
