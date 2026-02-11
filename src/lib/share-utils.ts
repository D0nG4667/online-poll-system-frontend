/**
 * Formats a poll URL for sharing
 */
export const getPollUrl = (
	pollIdentifier: string | number,
	origin?: string,
) => {
	const base =
		origin || (typeof window !== "undefined" ? window.location.origin : "");
	return `${base}/polls/${pollIdentifier}`;
};

/**
 * Generates an iframe embed code for a poll
 */
export const getEmbedCode = (pollId: string | number, origin?: string) => {
	const url = getPollUrl(pollId, origin);
	return `<iframe src="${url}" width="100%" height="600" frameborder="0" style="border:0; border-radius: 8px;" allowfullscreen></iframe>`;
};

/**
 * Success feedback handler for clipboard copies
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error("Failed to copy text: ", err);
		return false;
	}
};
