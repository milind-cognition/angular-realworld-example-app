import { useState, useEffect, useCallback } from "react";
import type { Article, ArticleListConfig } from "../types";
import { ArticlesApi } from "../api/articles";

interface UseArticlesResult {
  articles: Article[];
  articlesCount: number;
  isLoading: boolean;
  currentPage: number;
  setPage: (page: number) => void;
}

export function useArticles(
  config: ArticleListConfig | null,
  limit: number = 10,
): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when config changes (e.g., switching tabs)
  useEffect(() => {
    setCurrentPage(1);
  }, [config]);

  const fetchArticles = useCallback(
    async (page: number, queryConfig: ArticleListConfig) => {
      setIsLoading(true);
      try {
        const configWithPagination: ArticleListConfig = {
          ...queryConfig,
          filters: {
            ...queryConfig.filters,
            limit,
            offset: limit * (page - 1),
          },
        };
        const data = await ArticlesApi.query(configWithPagination);
        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
      } catch {
        setArticles([]);
        setArticlesCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    if (!config) return;
    void fetchArticles(currentPage, config);
  }, [config, currentPage, fetchArticles]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return { articles, articlesCount, isLoading, currentPage, setPage };
}
