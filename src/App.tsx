import { Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { useAuth } from "./context/AuthContext";
import { ArticlePage } from "./pages/ArticlePage";
import { Editor } from "./pages/Editor";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { Settings } from "./pages/Settings";
import type { ReactNode } from "react";

function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export function App() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnly>
              <Register />
            </GuestOnly>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route
          path="/editor/:slug"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}
