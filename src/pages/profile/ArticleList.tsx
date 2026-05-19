import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Articles } from "../../api/agent";
import type { Article, ArticleListConfig } from "../../types";

interface ArticleListProps {
  config: ArticleListConfig;
  limit: number;
}

export function ArticleList({ config, limit }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [config]);

  useEffect(() => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const params: Record<string, string | number> = {
      limit,
      offset,
      ...config.filters,
    };

    Articles.all(params)
      .then((data) => {
        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [config, currentPage, limit]);

  if (loading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  const totalPages = Math.ceil(articlesCount / limit);

  return (
    <>
      {articles.map((article) => (
        <div className="article-preview" key={article.slug}>
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </Link>
            <div className="info">
              <Link
                to={`/profile/${article.author.username}`}
                className="author"
              >
                {article.author.username}
              </Link>
              <span className="date">
                {new Date(article.createdAt).toDateString()}
              </span>
            </div>
          </div>
          <Link to={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            {article.tagList.length > 0 && (
              <ul className="tag-list">
                {article.tagList.map((tag) => (
                  <li key={tag} className="tag-default tag-pill tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </Link>
        </div>
      ))}

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item${currentPage === page ? " active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
