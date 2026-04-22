import { Link } from "react-router-dom";
import { ArticleMeta } from "./ArticleMeta";
import { FavoriteButton } from "./FavoriteButton";
import type { Article } from "../types";

interface ArticlePreviewProps {
  article: Article;
  onArticleUpdate: (article: Article) => void;
}

export function ArticlePreview({
  article,
  onArticleUpdate,
}: ArticlePreviewProps) {
  const handleToggleFavorite = (favorited: boolean) => {
    onArticleUpdate({
      ...article,
      favorited,
      favoritesCount: article.favoritesCount + (favorited ? 1 : -1),
    });
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
