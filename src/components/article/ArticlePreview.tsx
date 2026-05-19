import { useState } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../types";
import { ArticleMeta } from "./ArticleMeta";
import { FavoriteButton } from "./FavoriteButton";

interface ArticlePreviewProps {
  article: Article;
}

export function ArticlePreview({ article: initial }: ArticlePreviewProps) {
  const [favorited, setFavorited] = useState(initial.favorited);
  const [favoritesCount, setFavoritesCount] = useState(initial.favoritesCount);

  const handleToggle = (newFavorited: boolean) => {
    setFavorited(newFavorited);
    setFavoritesCount((c) => (newFavorited ? c + 1 : c - 1));
  };

  const articleWithState: Article = {
    ...initial,
    favorited,
    favoritesCount,
  };

  return (
    <div className="article-preview">
      <ArticleMeta article={articleWithState}>
        <div className="pull-xs-right">
          <FavoriteButton article={articleWithState} onToggle={handleToggle}>
            {" "}
            {favoritesCount}
          </FavoriteButton>
        </div>
      </ArticleMeta>
      <Link to={`/article/${initial.slug}`} className="preview-link">
        <h1>{initial.title}</h1>
        <p>{initial.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {initial.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
