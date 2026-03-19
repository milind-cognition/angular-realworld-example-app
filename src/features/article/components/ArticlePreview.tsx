import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArticleMeta } from "./ArticleMeta";
import { FavoriteButton } from "./FavoriteButton";
import type { Article } from "../../../types";

interface ArticlePreviewProps {
  article: Article;
}

export function ArticlePreview({
  article: initialArticle,
}: ArticlePreviewProps) {
  const [article, setArticle] = useState(initialArticle);

  const handleToggleFavorite = useCallback((favorited: boolean) => {
    setArticle((prev) => ({
      ...prev,
      favorited,
      favoritesCount: favorited
        ? prev.favoritesCount + 1
        : prev.favoritesCount - 1,
    }));
  }, []);

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
