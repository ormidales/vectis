/**
 * Escapes special XML/HTML characters in a string to prevent XSS and malformed markup.
 *
 * Replaces `&`, `<`, `>`, `"`, and `'` with their corresponding XML entities.
 * Removes ASCII control characters that are invalid in XML (except tab, newline, and carriage return),
 * lone Unicode surrogate code points (U+D800–U+DFFF), and XML non-characters (U+FFFE, U+FFFF).
 *
 * @param value - The raw string to escape.
 * @returns The escaped string safe for use in XML/SVG attribute values.
 *
 * @example
 * escapeXml('<script>'); // '&lt;script&gt;'
 * escapeXml('hello\x00world'); // 'helloworld'
 * escapeXml('hello\uD800world'); // 'helloworld'
 * escapeXml('hello\uFFFFworld'); // 'helloworld'
 */
export function escapeXml(value: string): string {
	return (
		value
			// biome-ignore lint/suspicious/noControlCharactersInRegex: intentionally matching control characters to remove them
			.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
			// Strip lone Unicode surrogate code points (U+D800–U+DFFF) — forbidden by XML spec
			// Uses lookahead/lookbehind to preserve valid surrogate pairs (e.g. emoji)
			.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "")
			// Strip XML non-characters U+FFFE and U+FFFF — forbidden by XML spec
			.replace(/[\uFFFE\uFFFF]/g, "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
	);
}
