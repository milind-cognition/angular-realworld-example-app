import { Navigate } from "react-router-dom";
import { useAuth } from "../../context";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

/**
 * Route guard that mirrors Angular's canActivate guards.
 * - requireAuth=true: redirects unauthenticated users to /login
 * - requireAuth=false: redirects authenticated users to /
 */
export function AuthGuard({ children, requireAuth }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
