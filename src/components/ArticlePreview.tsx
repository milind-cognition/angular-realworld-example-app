import { useState } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../types";
import { ArticleMeta } from "./ArticleMeta";
import { FavoriteButton } from "./FavoriteButton";

export function ArticlePreview({ article: initial }: { article: Article }) {
  const [article, setArticle] = useState(initial);

  const handleToggleFavorite = (favorited: boolean) => {
    setArticle((prev) => ({
      ...prev,
      favorited,
      favoritesCount: prev.favoritesCount + (favorited ? 1 : -1),
    }));
  };

  return (
    <div className="article-preview">
      <ArticleMeta article={article}>
        <FavoriteButton
          article={article}
          onToggle={handleToggleFavorite}
          className="pull-xs-right"
        >
          {article.favoritesCount}
        </FavoriteButton>
      </ArticleMeta>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
