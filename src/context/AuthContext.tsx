import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiClient, jwtService } from "../api";
import type { User } from "../models";
import { AuthContext } from "./auth-context";

const initialHasToken = !!jwtService.getToken();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(initialHasToken);

  const setAuth = useCallback((user: User) => {
    jwtService.saveToken(user.token);
    setCurrentUser(user);
  }, []);

  const purgeAuth = useCallback(() => {
    jwtService.destroyToken();
    setCurrentUser(null);
  }, []);

  // Initialize auth state on mount (mirrors Angular's APP_INITIALIZER initAuth)
  useEffect(() => {
    if (!initialHasToken) {
      return;
    }
    let cancelled = false;
    apiClient
      .get<{ user: User }>("/user")
      .then(({ data }) => {
        if (!cancelled) setAuth(data.user);
      })
      .catch(() => {
        if (!cancelled) purgeAuth();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [setAuth, purgeAuth]);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post<{ user: User }>("/users/login", {
        user: credentials,
      });
      setAuth(data.user);
    },
    [setAuth],
  );

  const register = useCallback(
    async (credentials: {
      username: string;
      email: string;
      password: string;
    }) => {
      const { data } = await apiClient.post<{ user: User }>("/users", {
        user: credentials,
      });
      setAuth(data.user);
    },
    [setAuth],
  );

  const logout = useCallback(() => {
    purgeAuth();
  }, [purgeAuth]);

  const updateUser = useCallback(async (user: Partial<User>) => {
    const { data } = await apiClient.put<{ user: User }>("/user", { user });
    setCurrentUser(data.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
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
