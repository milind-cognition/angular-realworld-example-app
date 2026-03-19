import { useMemo } from "react";
import type { ArticleListConfig } from "../../types";
import { useArticles } from "../../hooks/useArticles";
import { ArticlePreview } from "./ArticlePreview";

interface ArticleListProps {
  config: ArticleListConfig | null;
  limit?: number;
}

export function ArticleList({ config, limit = 10 }: ArticleListProps) {
  const { articles, articlesCount, isLoading, currentPage, setPage } =
    useArticles(config, limit);

  const totalPages = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(articlesCount / limit) },
        (_, i) => i + 1,
      ),
    [articlesCount, limit],
  );

  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}

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
                  onClick={() => setPage(page)}
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
