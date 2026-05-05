const API_ROOT = "https://api.realworld.show/api";

function getToken(): string | null {
  return window.localStorage.getItem("jwtToken");
}

export function saveToken(token: string): void {
  window.localStorage.setItem("jwtToken", token);
}

export function destroyToken(): void {
  window.localStorage.removeItem("jwtToken");
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...(options.headers as Record<string, string>),
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

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  del: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
