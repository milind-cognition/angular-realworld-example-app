import { marked } from "marked";
import DOMPurify from "dompurify";

/**
 * Renders a markdown string to sanitized HTML.
 * Mirrors the Angular MarkdownPipe which uses DomSanitizer.
 */
export async function renderMarkdown(content: string): Promise<string> {
  const rawHtml = await marked.parse(content);
  return DOMPurify.sanitize(rawHtml);
}
