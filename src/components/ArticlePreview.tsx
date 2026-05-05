// TODO: Migrate from Angular ArticlePreviewComponent
import type { Article } from "../types";

export function ArticlePreview({ article }: { article: Article }) {
  void article;
  return <div className="article-preview">Article preview stub</div>;
}
