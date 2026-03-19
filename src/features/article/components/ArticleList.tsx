import { ArticlePreview } from "./ArticlePreview";
import { useArticles } from "../hooks/useArticles";
import type { ArticleListConfig } from "../../../types";

interface ArticleListProps {
  config: ArticleListConfig;
  limit?: number;
}

export function ArticleList({ config, limit = 10 }: ArticleListProps) {
  const configWithLimit: ArticleListConfig = {
    ...config,
    filters: { ...config.filters, limit },
  };

  const { articles, isLoading, currentPage, totalPages, setPage } =
    useArticles(configWithLimit);

  if (isLoading) {
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
            {totalPages.map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item${pageNumber === currentPage ? " active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(pageNumber)}
                  style={{ cursor: "pointer" }}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
