import { useState, useEffect, useCallback, type ReactNode } from "react";
import { api, saveToken, destroyToken } from "../api/client";
import type { User } from "../types";
import { AuthContext } from "./authTypes";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("jwtToken");
    if (token) {
      api
        .get<{ user: User }>("/user")
        .then(({ user }) => {
          setCurrentUser(user);
          saveToken(user.token);
        })
        .catch(() => {
          destroyToken();
          setCurrentUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const { user } = await api.post<{ user: User }>("/users/login", {
        user: credentials,
      });
      saveToken(user.token);
      setCurrentUser(user);
    },
    [],
  );

  const register = useCallback(
    async (credentials: {
      username: string;
      email: string;
      password: string;
    }) => {
      const { user } = await api.post<{ user: User }>("/users", {
        user: credentials,
      });
      saveToken(user.token);
      setCurrentUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    destroyToken();
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    const { user } = await api.put<{ user: User }>("/user", {
      user: userData,
    });
    setCurrentUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
