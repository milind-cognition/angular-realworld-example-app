import { api } from "./api";
import type { Article, ArticleListConfig } from "../types";

export const articlesService = {
  query(
    config: ArticleListConfig,
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    const params = new URLSearchParams();
    const filters = config.filters;
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }
    const path = "/articles" + (config.type === "feed" ? "/feed" : "");
    const query = params.toString();
    return api.get(`${path}${query ? `?${query}` : ""}`);
  },

  get(slug: string): Promise<Article> {
    return api
      .get<{ article: Article }>(`/articles/${slug}`)
      .then((data) => data.article);
  },

  delete(slug: string): Promise<void> {
    return api.delete(`/articles/${slug}`);
  },

  create(article: Partial<Article>): Promise<Article> {
    return api
      .post<{ article: Article }>("/articles/", { article })
      .then((data) => data.article);
  },

  update(article: Partial<Article>): Promise<Article> {
    return api
      .put<{ article: Article }>(`/articles/${article.slug}`, { article })
      .then((data) => data.article);
  },

  favorite(slug: string): Promise<Article> {
    return api
      .post<{ article: Article }>(`/articles/${slug}/favorite`, {})
      .then((data) => data.article);
  },

  unfavorite(slug: string): Promise<void> {
    return api.delete(`/articles/${slug}/favorite`);
  },
};
