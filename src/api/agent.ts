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

  const body = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body as T;
}

function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

function post<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function put<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: "DELETE" });
}

export const Auth = {
  current: () => get<{ user: import("../types").User }>("/user"),
  login: (email: string, password: string) =>
    post<{ user: import("../types").User }>("/users/login", {
      user: { email, password },
    }),
  register: (username: string, email: string, password: string) =>
    post<{ user: import("../types").User }>("/users", {
      user: { username, email, password },
    }),
  update: (user: Partial<import("../types").User>) =>
    put<{ user: import("../types").User }>("/user", { user }),
  saveToken,
  destroyToken,
  getToken,
};

export const Articles = {
  all: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      query.set(key, String(val));
    }
    const qs = query.toString();
    return get<{
      articles: import("../types").Article[];
      articlesCount: number;
    }>(`/articles${qs ? `?${qs}` : ""}`);
  },
  feed: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      query.set(key, String(val));
    }
    const qs = query.toString();
    return get<{
      articles: import("../types").Article[];
      articlesCount: number;
    }>(`/articles/feed${qs ? `?${qs}` : ""}`);
  },
  get: (slug: string) =>
    get<{ article: import("../types").Article }>(`/articles/${slug}`),
  create: (article: Partial<import("../types").Article>) =>
    post<{ article: import("../types").Article }>("/articles/", { article }),
  update: (article: Partial<import("../types").Article>) =>
    put<{ article: import("../types").Article }>(`/articles/${article.slug}`, {
      article,
    }),
  delete: (slug: string) => del<void>(`/articles/${slug}`),
  favorite: (slug: string) =>
    post<{ article: import("../types").Article }>(
      `/articles/${slug}/favorite`,
      {},
    ),
  unfavorite: (slug: string) => del<void>(`/articles/${slug}/favorite`),
};

export const Comments = {
  forArticle: (slug: string) =>
    get<{ comments: import("../types").Comment[] }>(
      `/articles/${slug}/comments`,
    ),
  create: (slug: string, body: string) =>
    post<{ comment: import("../types").Comment }>(
      `/articles/${slug}/comments`,
      { comment: { body } },
    ),
  delete: (slug: string, commentId: string) =>
    del<void>(`/articles/${slug}/comments/${commentId}`),
};

export const Tags = {
  getAll: () => get<{ tags: string[] }>("/tags"),
};

export const Profiles = {
  get: (username: string) =>
    get<{ profile: import("../types").Profile }>(`/profiles/${username}`),
  follow: (username: string) =>
    post<{ profile: import("../types").Profile }>(
      `/profiles/${username}/follow`,
      {},
    ),
  unfollow: (username: string) =>
    del<{ profile: import("../types").Profile }>(
      `/profiles/${username}/follow`,
    ),
};
