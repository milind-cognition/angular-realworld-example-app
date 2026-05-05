import { api } from "./agent";
import type { Article, ArticleListConfig } from "../types";

interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export const ArticlesApi = {
  query(config: ArticleListConfig): Promise<ArticlesResponse> {
    const params = new URLSearchParams();
    const filters = config.filters;
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.author) params.set("author", filters.author);
    if (filters.favorited) params.set("favorited", filters.favorited);
    if (filters.limit !== undefined) params.set("limit", String(filters.limit));
    if (filters.offset !== undefined)
      params.set("offset", String(filters.offset));

    const queryString = params.toString();
    const endpoint = "/articles" + (config.type === "feed" ? "/feed" : "");
    return api.get<ArticlesResponse>(
      endpoint + (queryString ? `?${queryString}` : ""),
    );
  },

  get(slug: string): Promise<Article> {
    return api
      .get<{ article: Article }>(`/articles/${slug}`)
      .then((data) => data.article);
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

  delete(slug: string): Promise<void> {
    return api.del(`/articles/${slug}`);
  },

  favorite(slug: string): Promise<Article> {
    return api
      .post<{ article: Article }>(`/articles/${slug}/favorite`)
      .then((data) => data.article);
  },

  unfavorite(slug: string): Promise<void> {
    return api.del(`/articles/${slug}/favorite`);
  },
};
