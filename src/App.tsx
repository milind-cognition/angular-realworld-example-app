import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Editor = lazy(() => import("./pages/editor/Editor"));
const ArticlePage = lazy(() => import("./pages/article/ArticlePage"));
const Profile = lazy(() => import("./pages/profile/Profile"));

export function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container page">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:slug" element={<Editor />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/:username/favorites" element={<Profile />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
