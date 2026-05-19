import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { Auth } from "../api/agent";

interface AuthContextValue {
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
  update: (user: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Auth.getToken();
    if (token) {
      Auth.current()
        .then(({ user }) => {
          setUser(user);
        })
        .catch(() => {
          Auth.destroyToken();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await Auth.login(email, password);
    Auth.saveToken(user.token);
    setUser(user);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const { user } = await Auth.register(username, email, password);
      Auth.saveToken(user.token);
      setUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    Auth.destroyToken();
    setUser(null);
  }, []);

  const update = useCallback(async (userData: Partial<User>) => {
    const { user } = await Auth.update(userData);
    setUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        loading,
        login,
        register,
        logout,
        update,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
