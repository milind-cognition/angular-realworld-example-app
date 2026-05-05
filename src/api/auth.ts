import { get, post, put } from "./agent";
import type { User } from "../types";

interface UserResponse {
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export const AuthApi = {
  login(credentials: LoginCredentials): Promise<User> {
    return post<UserResponse>("/users/login", { user: credentials }).then(
      (res) => res.user,
    );
  },

  register(credentials: RegisterCredentials): Promise<User> {
    return post<UserResponse>("/users", { user: credentials }).then(
      (res) => res.user,
    );
  },

  getCurrentUser(): Promise<User> {
    return get<UserResponse>("/user").then((res) => res.user);
  },

  updateUser(user: Partial<User>): Promise<User> {
    return put<UserResponse>("/user", { user }).then((res) => res.user);
  },
};
