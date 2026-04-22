import { api, saveToken, destroyToken } from "./api";
import type { User } from "../types";

export const userService = {
  login(credentials: { email: string; password: string }): Promise<User> {
    return api
      .post<{ user: User }>("/users/login", { user: credentials })
      .then(({ user }) => {
        saveToken(user.token);
        return user;
      });
  },

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    return api
      .post<{ user: User }>("/users", { user: credentials })
      .then(({ user }) => {
        saveToken(user.token);
        return user;
      });
  },

  getCurrentUser(): Promise<User> {
    return api.get<{ user: User }>("/user").then(({ user }) => {
      saveToken(user.token);
      return user;
    });
  },

  update(user: Partial<User>): Promise<User> {
    return api.put<{ user: User }>("/user", { user }).then(({ user }) => user);
  },

  logout(): void {
    destroyToken();
  },
};
