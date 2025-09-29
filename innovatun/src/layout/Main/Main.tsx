import { Outlet, useLocation } from "react-router-dom";
import Header from "../../shared/Header/Header";
import { Footer } from "../../shared/Footer/Footer";

export default function Main() {
  const { pathname } = useLocation();
  return (
    <div>
      <div className={`${pathname.includes("/dashboard") || pathname.includes("/admin") ? "hidden" : ""}`}>
        <Header />
      </div>
      <Outlet />
      <div
        className={`${
          pathname === "/dashboard" ||
          pathname === "/dashboard/profile" ||
          pathname === "/dashboard/current-plan" ||
          pathname === "/dashboard/subscriptions" ||
          pathname === "/dashboard/billing" ||
          pathname.includes("/admin")
            ? "hidden"
            : ""
        }`}
      >
        <Footer />
      </div>
    </div>
  );
}
