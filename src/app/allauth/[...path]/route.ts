import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const isAccounts = path[0] === "accounts";
	const prefix = isAccounts ? "" : "_allauth";
	console.log(`[Allauth Route] GET ${prefix}/${path.join("/")}`);
	return proxyRequest(request, [prefix, ...path].filter(Boolean), {
		addTrailingSlash: isAccounts,
	});
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const isAccounts = path[0] === "accounts";
	const prefix = isAccounts ? "" : "_allauth";
	console.log(`[Allauth Route] POST ${prefix}/${path.join("/")}`);
	return proxyRequest(request, [prefix, ...path].filter(Boolean), {
		addTrailingSlash: isAccounts,
	});
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const isAccounts = path[0] === "accounts";
	const prefix = isAccounts ? "" : "_allauth";
	return proxyRequest(request, [prefix, ...path].filter(Boolean), {
		addTrailingSlash: isAccounts,
	});
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const isAccounts = path[0] === "accounts";
	const prefix = isAccounts ? "" : "_allauth";
	return proxyRequest(request, [prefix, ...path].filter(Boolean), {
		addTrailingSlash: isAccounts,
	});
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const isAccounts = path[0] === "accounts";
	const prefix = isAccounts ? "" : "_allauth";
	return proxyRequest(request, [prefix, ...path].filter(Boolean), {
		addTrailingSlash: isAccounts,
	});
}
