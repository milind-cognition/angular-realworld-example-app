import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { AuthApi } from "../api/auth";
import { saveToken, destroyToken } from "../api/agent";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("jwtToken");
    if (token) {
      AuthApi.getCurrentUser()
        .then((u) => {
          saveToken(u.token);
          setUser(u);
        })
        .catch(() => {
          destroyToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await AuthApi.login(email, password);
    saveToken(u.token);
    setUser(u);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const u = await AuthApi.register(username, email, password);
      saveToken(u.token);
      setUser(u);
    },
    [],
  );

  const logout = useCallback(() => {
    destroyToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    const u = await AuthApi.update(userData);
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
