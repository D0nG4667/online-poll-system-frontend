import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["api", ...path]);
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["api", ...path]);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["api", ...path]);
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["api", ...path]);
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	return proxyRequest(request, ["api", ...path]);
}
