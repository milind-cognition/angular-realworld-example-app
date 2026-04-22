import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "../models";
import { userService } from "../services/user";
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
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = api.token.get();
    if (token) {
      userService
        .getCurrentUser()
        .then((currentUser) => {
          api.token.save(currentUser.token);
          setUser(currentUser);
        })
        .catch(() => {
          api.token.destroy();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const loggedInUser = await userService.login(credentials);
      api.token.save(loggedInUser.token);
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
      api.token.save(registeredUser.token);
      setUser(registeredUser);
    },
    [],
  );

  const logout = useCallback(() => {
    api.token.destroy();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    const updatedUser = await userService.update(userData);
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
