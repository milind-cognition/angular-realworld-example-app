import { useState, useEffect, useCallback } from "react";
import { ArticlePreview } from "./ArticlePreview";
import { articlesService } from "../services/articles";
import type { Article, ArticleListConfig } from "../types";

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
    async (page: number) => {
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

      try {
        const data = await articlesService.query(queryConfig);
        setArticles(data.articles);
        setTotalPages(
          Array.from(
            new Array(Math.ceil(data.articlesCount / limit)),
            (_, index) => index + 1,
          ),
        );
      } finally {
        setLoading(false);
      }
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

  const handleArticleUpdate = (updated: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.slug === updated.slug ? updated : a)),
    );
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
          <ArticlePreview
            key={article.slug}
            article={article}
            onArticleUpdate={handleArticleUpdate}
          />
        ))
      )}

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
    </>
  );
}
