import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ArticleList } from "./ArticleList";
import type { ArticleListConfig } from "../../types";

export function ProfileFavorites() {
  const { username } = useParams<{ username: string }>();

  const config: ArticleListConfig = useMemo(
    () => ({
      type: "all",
      filters: { favorited: username },
    }),
    [username],
  );

  return <ArticleList config={config} limit={10} />;
}
