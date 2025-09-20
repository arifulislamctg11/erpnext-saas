import { Outlet } from "react-router-dom";
import Header from "../../shared/Header/Header";

export default function Main() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
