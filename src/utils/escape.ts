/**
 * Escapes special XML/HTML characters in a string to prevent XSS and malformed markup.
 *
 * Replaces `&`, `<`, `>`, `"`, and `'` with their corresponding XML entities.
 *
 * @param value - The raw string to escape.
 * @returns The escaped string safe for use in XML/SVG attribute values.
 *
 * @example
 * escapeXml('<script>'); // '&lt;script&gt;'
 */
export function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
