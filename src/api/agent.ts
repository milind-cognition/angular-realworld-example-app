const API_ROOT = "https://api.realworld.show/api";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = localStorage.getItem("jwtToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${API_ROOT}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error.errors ? error : { errors: error.error };
  }

  // For DELETE requests that may return no content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export function get<T>(url: string): Promise<T> {
  return request<T>(url, { method: "GET" });
}

export function post<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function put<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: "DELETE" });
}
