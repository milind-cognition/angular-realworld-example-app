import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ArticleList } from "./ArticleList";
import type { ArticleListConfig } from "../../types";

export function ProfileArticles() {
  const { username } = useParams<{ username: string }>();

  const config: ArticleListConfig = useMemo(
    () => ({
      type: "all",
      filters: { author: username },
    }),
    [username],
  );

  return <ArticleList config={config} limit={10} />;
}
