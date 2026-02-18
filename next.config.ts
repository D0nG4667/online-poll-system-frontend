import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	async rewrites() {
		return [
			{
				source: "/_allauth/:path*",
				destination: "/allauth/:path*",
			},
			// Fallback for other API calls if needed, though they might be direct
			{
				source: "/api/:path*",
				destination: `${process.env.BACKEND_URL || "http://localhost:8000"}/api/:path*`,
			},
		];
	},
};

export default nextConfig;
