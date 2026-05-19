import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../types";

export function ArticleMeta({
  article,
  children,
}: {
  article: Article;
  children: ReactNode;
}) {
  return (
    <div className="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <img src={article.author.image} alt={article.author.username} />
      </Link>
      <div className="info">
        <Link to={`/profile/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      {children}
    </div>
  );
}
