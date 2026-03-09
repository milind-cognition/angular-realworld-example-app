import api from "./api";
import { Article } from "../types/article";
import { ArticleListConfig } from "../types/article-list-config";

interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export const articlesService = {
  async query(
    config: ArticleListConfig,
  ): Promise<ArticlesResponse> {
    const endpoint =
      config.type === "feed" ? "/articles/feed" : "/articles";
    const response = await api.get<ArticlesResponse>(endpoint, {
      params: config.filters,
    });
    return response.data;
  },

  async get(slug: string): Promise<Article> {
    const response = await api.get<{ article: Article }>(
      `/articles/${slug}`,
    );
    return response.data.article;
  },

  async create(article: Partial<Article>): Promise<Article> {
    const response = await api.post<{ article: Article }>("/articles", {
      article,
    });
    return response.data.article;
  },

  async update(article: Partial<Article>): Promise<Article> {
    const response = await api.put<{ article: Article }>(
      `/articles/${article.slug}`,
      { article },
    );
    return response.data.article;
  },

  async delete(slug: string): Promise<void> {
    await api.delete(`/articles/${slug}`);
  },

  async favorite(slug: string): Promise<Article> {
    const response = await api.post<{ article: Article }>(
      `/articles/${slug}/favorite`,
    );
    return response.data.article;
  },

  async unfavorite(slug: string): Promise<void> {
    await api.delete(`/articles/${slug}/favorite`);
  },
};
