import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { AuthApi } from '../api/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const setAuth = useCallback((user: User) => {
    localStorage.setItem('jwtToken', user.token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('jwtToken');
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      clearAuth();
      return;
    }
    try {
      const user = await AuthApi.getCurrentUser();
      setAuth(user);
    } catch {
      clearAuth();
    }
  }, [setAuth, clearAuth]);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const user = await AuthApi.login(credentials);
      setAuth(user);
    },
    [setAuth]
  );

  const register = useCallback(
    async (credentials: { username: string; email: string; password: string }) => {
      const user = await AuthApi.register(credentials);
      setAuth(user);
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    clearAuth();
    navigate('/');
  }, [clearAuth, navigate]);

  const updateUser = useCallback(
    async (user: Partial<User>) => {
      const updatedUser = await AuthApi.updateUser(user);
      setAuth(updatedUser);
    },
    [setAuth]
  );

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
