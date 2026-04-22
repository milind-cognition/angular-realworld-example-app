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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_ROOT}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as T;
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

export const api = { get, post, put, del, getToken, saveToken, destroyToken };
