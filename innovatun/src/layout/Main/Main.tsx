import { Outlet } from "react-router-dom";
import Header from "../../shared/Header/Header";
import { Footer } from "../../shared/Footer/Footer";

export default function Main() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
