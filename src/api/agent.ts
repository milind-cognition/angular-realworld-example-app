import type {
  Article,
  ArticleListConfig,
  Comment,
  Profile,
  User,
} from "../types";

const API_ROOT = "https://api.realworld.show/api";

function getToken(): string | null {
  return window.localStorage.getItem("jwtToken");
}

function saveToken(token: string): void {
  window.localStorage.setItem("jwtToken", token);
}

function destroyToken(): void {
  window.localStorage.removeItem("jwtToken");
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_ROOT}${url}`, {
    ...options,
    headers,
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body as T;
}

export const Auth = {
  current: () => request<{ user: User }>("/user"),
  login: (email: string, password: string) =>
    request<{ user: User }>("/users/login", {
      method: "POST",
      body: JSON.stringify({ user: { email, password } }),
    }),
  register: (username: string, email: string, password: string) =>
    request<{ user: User }>("/users", {
      method: "POST",
      body: JSON.stringify({ user: { username, email, password } }),
    }),
  update: (user: Partial<User>) =>
    request<{ user: User }>("/user", {
      method: "PUT",
      body: JSON.stringify({ user }),
    }),
  saveToken,
  destroyToken,
  getToken,
};

export const Articles = {
  query: (config: ArticleListConfig) => {
    const params = new URLSearchParams();
    const filters = config.filters;
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.author) params.set("author", filters.author);
    if (filters.favorited) params.set("favorited", filters.favorited);
    if (filters.limit !== undefined) params.set("limit", String(filters.limit));
    if (filters.offset !== undefined)
      params.set("offset", String(filters.offset));

    const endpoint = config.type === "feed" ? "/articles/feed" : "/articles";
    const qs = params.toString();
    return request<{ articles: Article[]; articlesCount: number }>(
      qs ? `${endpoint}?${qs}` : endpoint,
    );
  },
  get: (slug: string) =>
    request<{ article: Article }>(`/articles/${slug}`).then((d) => d.article),
  create: (article: Partial<Article>) =>
    request<{ article: Article }>("/articles/", {
      method: "POST",
      body: JSON.stringify({ article }),
    }).then((d) => d.article),
  update: (article: Partial<Article>) =>
    request<{ article: Article }>(`/articles/${article.slug}`, {
      method: "PUT",
      body: JSON.stringify({ article }),
    }).then((d) => d.article),
  delete: (slug: string) =>
    request<void>(`/articles/${slug}`, { method: "DELETE" }),
  favorite: (slug: string) =>
    request<{ article: Article }>(`/articles/${slug}/favorite`, {
      method: "POST",
    }).then((d) => d.article),
  unfavorite: (slug: string) =>
    request<void>(`/articles/${slug}/favorite`, { method: "DELETE" }),
};

export const Comments = {
  getAll: (slug: string) =>
    request<{ comments: Comment[] }>(`/articles/${slug}/comments`).then(
      (d) => d.comments,
    ),
  add: (slug: string, body: string) =>
    request<{ comment: Comment }>(`/articles/${slug}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment: { body } }),
    }).then((d) => d.comment),
  delete: (slug: string, commentId: string) =>
    request<void>(`/articles/${slug}/comments/${commentId}`, {
      method: "DELETE",
    }),
};

export const Tags = {
  getAll: () => request<{ tags: string[] }>("/tags").then((d) => d.tags),
};

export const Profiles = {
  get: (username: string) =>
    request<{ profile: Profile }>(`/profiles/${username}`).then(
      (d) => d.profile,
    ),
  follow: (username: string) =>
    request<{ profile: Profile }>(`/profiles/${username}/follow`, {
      method: "POST",
    }).then((d) => d.profile),
  unfollow: (username: string) =>
    request<{ profile: Profile }>(`/profiles/${username}/follow`, {
      method: "DELETE",
    }).then((d) => d.profile),
};
