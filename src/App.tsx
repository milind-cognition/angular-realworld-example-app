import { Outlet } from "react-router-dom";
import { Header, Footer } from "./components/layout";

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
