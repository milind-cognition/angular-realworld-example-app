import { marked } from "marked";

export async function renderMarkdown(content: string): Promise<string> {
  const html = await marked.parse(content);
  return html;
}
