import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "../types/user";
import { jwtService } from "../services/jwt";
import api from "../services/api";

interface AuthContextType {
  currentUser: User | null;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = currentUser !== null;

  useEffect(() => {
    const token = jwtService.getToken();
    if (token) {
      api
        .get<{ user: User }>("/user")
        .then((response) => {
          setCurrentUser(response.data.user);
        })
        .catch(() => {
          jwtService.destroyToken();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{ user: User }>("/users/login", {
      user: { email, password },
    });
    const user = response.data.user;
    jwtService.saveToken(user.token);
    setCurrentUser(user);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const response = await api.post<{ user: User }>("/users", {
        user: { username, email, password },
      });
      const user = response.data.user;
      jwtService.saveToken(user.token);
      setCurrentUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    jwtService.destroyToken();
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    const response = await api.put<{ user: User }>("/user", {
      user: userData,
    });
    setCurrentUser(response.data.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
