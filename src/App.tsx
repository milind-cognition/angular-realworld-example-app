import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/home/Home";
import { ArticlePage } from "./pages/article/ArticlePage";
import { Editor } from "./pages/editor/Editor";
import { Profile } from "./pages/profile/Profile";
import { ProfileArticles } from "./pages/profile/ProfileArticles";
import { ProfileFavorites } from "./pages/profile/ProfileFavorites";
import { Settings } from "./pages/settings/Settings";
import { AuthPage } from "./pages/auth/AuthPage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:slug" element={<Editor />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/profile/:username" element={<Profile />}>
            <Route index element={<ProfileArticles />} />
            <Route path="favorites" element={<ProfileFavorites />} />
          </Route>
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
