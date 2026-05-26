import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../api/agent";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Auth.getToken();
    if (token) {
      Auth.current()
        .then(({ user: u }) => {
          setUser(u);
        })
        .catch(() => {
          Auth.destroyToken();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: u } = await Auth.login(email, password);
      Auth.saveToken(u.token);
      setUser(u);
      navigate("/");
    },
    [navigate],
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const { user: u } = await Auth.register(username, email, password);
      Auth.saveToken(u.token);
      setUser(u);
      navigate("/");
    },
    [navigate],
  );

  const logout = useCallback(() => {
    Auth.destroyToken();
    setUser(null);
    navigate("/");
  }, [navigate]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    const { user: u } = await Auth.update(userData);
    setUser(u);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateUser,
      setUser,
    }),
    [user, loading, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
