"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
	error,
}: {
	error: Error & { digest?: string };
}) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				{/* `NextError` is the default Next.js error page component. Its type definition requires a `statusCode` prop. However, since the HTTP status code is unknown at this point, we can pass a value of 0. */}
				<NextError statusCode={0} />
			</body>
		</html>
	);
}
