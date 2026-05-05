// TODO: Migrate from Angular ArticleListComponent
import type { ArticleListConfig } from "../types";

export function ArticleList({
  config,
  limit,
}: {
  config: ArticleListConfig;
  limit: number;
}) {
  void config;
  void limit;
  return <div className="article-preview">Loading articles...</div>;
}
