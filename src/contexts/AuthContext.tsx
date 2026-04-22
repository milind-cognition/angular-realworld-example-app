import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "../models/user.model";
import { api } from "../services/api";

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
  updateUser: (user: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api
        .get<{ user: User }>("/user")
        .then(({ user: u }) => {
          setUser(u);
          api.saveToken(u.token);
        })
        .catch(() => {
          api.destroyToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const { user: u } = await api.post<{ user: User }>("/users/login", {
        user: credentials,
      });
      api.saveToken(u.token);
      setUser(u);
    },
    [],
  );

  const register = useCallback(
    async (credentials: {
      username: string;
      email: string;
      password: string;
    }) => {
      const { user: u } = await api.post<{ user: User }>("/users", {
        user: credentials,
      });
      api.saveToken(u.token);
      setUser(u);
    },
    [],
  );

  const logout = useCallback(() => {
    api.destroyToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    const { user: u } = await api.put<{ user: User }>("/user", {
      user: userData,
    });
    setUser(u);
    return u;
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
