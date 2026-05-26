import { useCallback, useEffect, useState } from "react";
import { Articles } from "../api/agent";
import type { Article, ArticleListConfig } from "../types";
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

  const runQuery = useCallback(
    (page: number) => {
      setLoading(true);
      setArticles([]);

      const queryConfig: ArticleListConfig = {
        ...config,
        filters: {
          ...config.filters,
          limit,
          offset: limit * (page - 1),
        },
      };

      Articles.query(queryConfig)
        .then((data) => {
          setArticles(data.articles);
          setTotalPages(
            Array.from(
              { length: Math.ceil(data.articlesCount / limit) },
              (_, i) => i + 1,
            ),
          );
        })
        .finally(() => setLoading(false));
    },
    [config, limit],
  );

  useEffect(() => {
    setCurrentPage(1);
    runQuery(1);
  }, [runQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    runQuery(page);
  };

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
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePageChange(page)}
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
