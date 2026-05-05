// TODO: Migrate from Angular ArticleMetaComponent
import type { Article } from "../types";
import type { ReactNode } from "react";

export function ArticleMeta({
  article,
  children,
}: {
  article: Article;
  children?: ReactNode;
}) {
  void article;
  return <div className="article-meta">{children}</div>;
}
