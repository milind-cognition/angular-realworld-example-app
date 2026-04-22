import { api } from "./api";
import { User } from "../models";

export const userService = {
  login(credentials: { email: string; password: string }): Promise<User> {
    return api
      .post<{ user: User }>("/users/login", { user: credentials })
      .then((data) => data.user);
  },

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    return api
      .post<{ user: User }>("/users", { user: credentials })
      .then((data) => data.user);
  },

  getCurrentUser(): Promise<User> {
    return api.get<{ user: User }>("/user").then((data) => data.user);
  },

  update(user: Partial<User>): Promise<User> {
    return api.put<{ user: User }>("/user", { user }).then((data) => data.user);
  },
};
