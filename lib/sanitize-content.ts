/**
 * sanitizeMarkdown
 * ─────────────────────────────────────────────────────────────────────────────
 * Cleans up raw LLM-generated markdown before rendering. LLMs often produce:
 *   - Collapsed headings with no blank line before them
 *   - Inconsistent or missing blank lines between paragraphs
 *   - Stray HTML tags or unsafe attributes
 *   - Trailing whitespace and Windows-style CRLF line endings
 *   - Excessive blank lines (more than 2 in a row)
 */
export function sanitizeMarkdown(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  let text = raw;

  // 1. Normalize line endings (CRLF → LF)
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 2. Strip potentially dangerous HTML while keeping safe markdown code blocks
  //    Remove <script>, <iframe>, <object>, <embed>, <form> tags
  text = text.replace(
    /<(script|iframe|object|embed|form|style)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );
  // Strip on* event attributes from any remaining tags
  text = text.replace(/\s+on\w+="[^"]*"/gi, "");
  text = text.replace(/\s+on\w+='[^']*'/gi, "");

  // 3. Ensure there is always a blank line BEFORE headings (##, ###, ####)
  //    so they don't appear glued to the previous paragraph
  text = text.replace(/([^\n])\n(#{1,6} )/g, "$1\n\n$2");

  // 4. Ensure there is always a blank line AFTER headings
  text = text.replace(/(#{1,6} .+)\n([^\n#])/g, "$1\n\n$2");

  // 5. Ensure there is a blank line before fenced code blocks (```)
  text = text.replace(/([^\n])\n(```)/g, "$1\n\n$2");

  // 6. Ensure there is a blank line after closing code blocks
  text = text.replace(/(```)\n([^\n`])/g, "$1\n\n$2");

  // 7. Ensure blank line before blockquotes (>)
  text = text.replace(/([^\n])\n(> )/g, "$1\n\n$2");

  // 8. Ensure blank line before unordered/ordered lists that follow a paragraph
  //    (lists that directly follow text with no gap look jammed together)
  text = text.replace(/([^\n])\n([-*+] |\d+\. )/g, "$1\n\n$2");

  // 9. Promote "implicit headings" — short standalone lines that LLMs often
  //    emit as un-prefixed section titles (e.g. "Key Concepts\n" instead of "### Key Concepts\n").
  //    Criteria: ≤ 60 chars, not already a heading/list/code-fence/quote/blank,
  //    preceded AND followed by a blank line.
  text = text.replace(
    /\n\n(?!#|[-*+]|\d+\.|```|>| {4})([A-Z][^\n]{0,58}[^\s])\n\n/g,
    (_, title) => `\n\n### ${title}\n\n`
  );

  // 10. Collapse more than 2 consecutive blank lines into exactly 2
  text = text.replace(/\n{3,}/g, "\n\n");

  // 11. Remove trailing whitespace from every line
  text = text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  // 12. Trim leading/trailing blank lines from the whole document
  text = text.trim();

  return text;
}
