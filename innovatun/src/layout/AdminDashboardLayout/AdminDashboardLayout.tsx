import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader";

export default function AdminDashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div>
          <AdminHeader />
        </div>
        <div className="bg-[#d9d9d9] min-h-full">
          <Outlet /> {/* child pages render here */}
        </div>
      </main>
    </div>
  );
}
