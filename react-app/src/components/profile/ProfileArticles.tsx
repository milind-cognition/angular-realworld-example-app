import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { ArticleListConfig } from "../../types";
import { ArticleList } from "../articles/ArticleList";

export function ProfileArticles() {
  const { username } = useParams<{ username: string }>();

  const config = useMemo<ArticleListConfig | null>(() => {
    if (!username) return null;
    return {
      type: "all",
      filters: { author: username },
    };
  }, [username]);

  return <ArticleList config={config} limit={10} />;
}
