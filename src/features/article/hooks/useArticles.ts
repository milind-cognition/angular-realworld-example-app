import { useState, useEffect, useCallback } from "react";
import { api } from "../../../api/client";
import type {
  Article,
  ArticleListConfig,
  ArticlesResponse,
} from "../../../types";

const DEFAULT_LIMIT = 10;

interface UseArticlesResult {
  articles: Article[];
  articlesCount: number;
  isLoading: boolean;
  currentPage: number;
  totalPages: number[];
  setPage: (page: number) => void;
}

export function useArticles(config: ArticleListConfig): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { type, filters } = config;
  const { tag, author, favorited } = filters;
  const limit = filters.limit ?? DEFAULT_LIMIT;

  const fetchArticles = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setArticles([]);

      const params = new URLSearchParams();

      if (tag) params.set("tag", tag);
      if (author) params.set("author", author);
      if (favorited) params.set("favorited", favorited);
      params.set("limit", String(limit));
      params.set("offset", String(limit * (page - 1)));

      const endpoint = "/articles" + (type === "feed" ? "/feed" : "");
      const query = params.toString();

      try {
        const data = await api.get<ArticlesResponse>(`${endpoint}?${query}`);
        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
      } catch {
        setArticles([]);
        setArticlesCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [type, tag, author, favorited, limit],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [type, tag, author, favorited]);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [fetchArticles, currentPage]);

  const totalPages = Array.from(
    new Array(Math.ceil(articlesCount / limit)),
    (_, index) => index + 1,
  );

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    articles,
    articlesCount,
    isLoading,
    currentPage,
    totalPages,
    setPage,
  };
}
