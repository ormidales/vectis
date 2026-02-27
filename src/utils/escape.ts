/**
 * Escapes special XML/HTML characters in a string to prevent XSS and malformed markup.
 *
 * Replaces `&`, `<`, `>`, `"`, and `'` with their corresponding XML entities.
 * Removes ASCII control characters that are invalid in XML (except tab, newline, and carriage return).
 *
 * @param value - The raw string to escape.
 * @returns The escaped string safe for use in XML/SVG attribute values.
 *
 * @example
 * escapeXml('<script>'); // '&lt;script&gt;'
 * escapeXml('hello\x00world'); // 'helloworld'
 */
export function escapeXml(value: string): string {
	return (
		value
			// biome-ignore lint/suspicious/noControlCharactersInRegex: intentionally matching control characters to remove them
			.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
	);
}
