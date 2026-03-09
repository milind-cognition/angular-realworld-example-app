import { useState, useEffect } from "react";
import { Article } from "../types/article";
import { ArticleListConfig } from "../types/article-list-config";
import { articlesService } from "../services/articles";
import { ArticlePreview } from "./ArticlePreview";

const ARTICLES_PER_PAGE = 10;

interface ArticleListProps {
  config: ArticleListConfig;
}

export function ArticleList({ config }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [config.type, config.filters.tag, config.filters.author, config.filters.favorited]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const queryConfig: ArticleListConfig = {
      ...config,
      filters: {
        ...config.filters,
        limit: ARTICLES_PER_PAGE,
        offset: ARTICLES_PER_PAGE * (currentPage - 1),
      },
    };

    articlesService
      .query(queryConfig)
      .then((data) => {
        if (!cancelled) {
          setArticles(data.articles);
          setArticlesCount(data.articlesCount);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config, currentPage]);

  const totalPages = Math.ceil(articlesCount / ARTICLES_PER_PAGE);

  const handleFavoriteToggle = (article: Article, favorited: boolean) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.slug === article.slug
          ? {
              ...a,
              favorited,
              favoritesCount: favorited
                ? a.favoritesCount + 1
                : a.favoritesCount - 1,
            }
          : a,
      ),
    );
  };

  if (loading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <ArticlePreview
          key={article.slug}
          article={article}
          onFavoriteToggle={handleFavoriteToggle}
        />
      ))}

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <li
                  key={page}
                  className={`page-item${page === currentPage ? " active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </>
  );
}
