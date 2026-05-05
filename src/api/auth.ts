import { api } from "./agent";
import type { User } from "../types";

export const AuthApi = {
  login(email: string, password: string): Promise<User> {
    return api
      .post<{ user: User }>("/users/login", { user: { email, password } })
      .then((data) => data.user);
  },

  register(username: string, email: string, password: string): Promise<User> {
    return api
      .post<{ user: User }>("/users", {
        user: { username, email, password },
      })
      .then((data) => data.user);
  },

  getCurrentUser(): Promise<User> {
    return api.get<{ user: User }>("/user").then((data) => data.user);
  },

  update(user: Partial<User>): Promise<User> {
    return api.put<{ user: User }>("/user", { user }).then((data) => data.user);
  },
};
