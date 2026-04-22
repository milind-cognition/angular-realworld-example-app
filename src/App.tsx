import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Settings = lazy(() => import("./pages/Settings"));
const Editor = lazy(() => import("./pages/Editor"));
const ArticlePage = lazy(() => import("./pages/Article"));
const ProfilePage = lazy(() => import("./pages/Profile"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Suspense fallback={<div className="container">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:slug" element={<Editor />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route
              path="/profile/:username/favorites"
              element={<ProfilePage />}
            />
          </Routes>
        </Suspense>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
