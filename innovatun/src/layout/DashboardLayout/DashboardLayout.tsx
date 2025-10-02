import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Dashboard/Sidebar";
import Header from "../../components/Dashboard/Header";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div>
          <Header/>
        </div>
        <div className="bg-[#d9d9d9] min-h-full">
        <Outlet /> {/* child pages render here */}
        </div>
      </main>
    </div>
  );
}
