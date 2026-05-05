import { useState, useEffect } from "react";
import type { Article, ArticleListConfig } from "../../types";
import { ArticlesApi } from "../../api/articles";
import { ArticlePreview } from "./ArticlePreview";

interface ArticleListProps {
  limit: number;
  config: ArticleListConfig;
}

export function ArticleList({ limit, config }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [config]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setArticles([]);

    const query: ArticleListConfig = {
      ...config,
      filters: {
        ...config.filters,
        limit,
        offset: limit * (currentPage - 1),
      },
    };

    ArticlesApi.query(query).then((data) => {
      if (cancelled) return;
      setArticles(data.articles);
      setTotalPages(
        Array.from(
          { length: Math.ceil(data.articlesCount / limit) },
          (_, i) => i + 1,
        ),
      );
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [config, currentPage, limit]);

  if (loading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  return (
    <>
      {articles.length === 0 ? (
        <div className="article-preview">No articles are here... yet.</div>
      ) : (
        articles.map((article) => (
          <ArticlePreview key={article.slug} article={article} />
        ))
      )}

      {totalPages.length > 1 && (
        <nav>
          <ul className="pagination">
            {totalPages.map((page) => (
              <li
                key={page}
                className={`page-item${page === currentPage ? " active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                  style={{ cursor: "pointer" }}
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
