import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Settings } from "./pages/Settings";
import { Editor } from "./pages/Editor";
import { ArticlePage } from "./pages/Article";
import { ProfilePage } from "./pages/Profile";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:slug" element={<Editor />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/profile/:username/favorites" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </>
  );
}
