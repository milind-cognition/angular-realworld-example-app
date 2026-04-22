import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { userService } from "../services/user";
import { getToken } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      userService
        .getCurrentUser()
        .then(setUser)
        .catch(() => {
          userService.logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const loggedInUser = await userService.login(credentials);
      setUser(loggedInUser);
    },
    [],
  );

  const register = useCallback(
    async (credentials: {
      username: string;
      email: string;
      password: string;
    }) => {
      const registeredUser = await userService.register(credentials);
      setUser(registeredUser);
    },
    [],
  );

  const logout = useCallback(() => {
    userService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
