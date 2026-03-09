import { get, post, put, del } from "./agent";
import type { Article, ArticleListConfig } from "../types";

interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

interface ArticleResponse {
  article: Article;
}

export const ArticlesApi = {
  query(config: ArticleListConfig): Promise<ArticlesResponse> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(config.filters)) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }
    const queryString = params.toString();
    const endpoint = config.type === "feed" ? "/articles/feed" : "/articles";
    return get<ArticlesResponse>(`${endpoint}?${queryString}`);
  },

  get(slug: string): Promise<Article> {
    return get<ArticleResponse>(`/articles/${slug}`).then((res) => res.article);
  },

  create(article: Partial<Article>): Promise<Article> {
    return post<ArticleResponse>("/articles/", { article }).then(
      (res) => res.article,
    );
  },

  update(article: Partial<Article> & { slug: string }): Promise<Article> {
    return put<ArticleResponse>(`/articles/${article.slug}`, { article }).then(
      (res) => res.article,
    );
  },

  delete(slug: string): Promise<void> {
    return del<void>(`/articles/${slug}`);
  },

  favorite(slug: string): Promise<Article> {
    return post<ArticleResponse>(`/articles/${slug}/favorite`).then(
      (res) => res.article,
    );
  },

  unfavorite(slug: string): Promise<Article> {
    return del<ArticleResponse>(`/articles/${slug}/favorite`).then(
      (res) => res.article,
    );
  },
};
