import { marked } from "marked";

export async function renderMarkdown(content: string): Promise<string> {
  return marked.parse(content);
}
