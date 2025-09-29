import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";


export default function AdminDashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <AdminSidebar />


      <main className="flex-1 bg-gray-50">
        <div className="bg-[#d9d9d9] min-h-full">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}
