import DOMPurify from "dompurify";

export async function renderMarkdown(content: string): Promise<string> {
  const { marked } = await import("marked");
  const raw = await marked.parse(content);
  return DOMPurify.sanitize(raw);
}
