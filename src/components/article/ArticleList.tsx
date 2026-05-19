import { useState, useEffect } from "react";
import type { Article, ArticleListConfig } from "../../types";
import { Articles } from "../../api/agent";
import { ArticlePreview } from "./ArticlePreview";

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
      ...config.filters,
      limit,
      offset,
    };

    const fetchArticles = config.type === "feed" ? Articles.feed : Articles.all;

    fetchArticles(params)
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
        <ArticlePreview key={article.slug} article={article} />
      ))}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item${currentPage === page ? " active" : ""}`}
              >
                <span
                  className="page-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
