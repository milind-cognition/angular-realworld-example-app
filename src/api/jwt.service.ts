const JWT_TOKEN_KEY = "jwtToken";

export const jwtService = {
  getToken(): string | null {
    return window.localStorage.getItem(JWT_TOKEN_KEY);
  },

  saveToken(token: string): void {
    window.localStorage.setItem(JWT_TOKEN_KEY, token);
  },

  destroyToken(): void {
    window.localStorage.removeItem(JWT_TOKEN_KEY);
  },
};
