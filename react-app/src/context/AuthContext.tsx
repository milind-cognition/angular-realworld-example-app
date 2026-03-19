import {
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { AuthApi } from '../api/auth';
import { AuthContext } from './AuthContextDef';

export { AuthContext, type AuthContextType } from './AuthContextDef';

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
    async (user: Partial<User>): Promise<User> => {
      const updatedUser = await AuthApi.updateUser(user);
      setAuth(updatedUser);
      return updatedUser;
    },
    [setAuth]
  );

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    let cancelled = false;
    AuthApi.getCurrentUser().then(
      (user) => { if (!cancelled) setAuth(user); },
      () => { if (!cancelled) clearAuth(); },
    );
    return () => { cancelled = true; };
  }, [setAuth, clearAuth]);

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
