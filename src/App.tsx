import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const Home = lazy(() => import("./features/article/pages/Home"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Suspense fallback={<div className="container">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
