import { api } from "./api";
import { Article, ArticleListConfig } from "../models";

export const articlesService = {
  query(
    config: ArticleListConfig,
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    const params = new URLSearchParams();
    const filters = config.filters;
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.author) params.set("author", filters.author);
    if (filters.favorited) params.set("favorited", filters.favorited);
    if (filters.limit != null) params.set("limit", String(filters.limit));
    if (filters.offset != null) params.set("offset", String(filters.offset));

    const queryString = params.toString();
    const path =
      "/articles" +
      (config.type === "feed" ? "/feed" : "") +
      (queryString ? `?${queryString}` : "");

    return api.get(path);
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
