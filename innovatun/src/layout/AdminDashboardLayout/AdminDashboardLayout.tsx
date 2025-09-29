import { Outlet, Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/use-auth";

export default function AdminDashboardLayout() {
  const { signout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signout();
      navigate("/");
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50">
        <div className="w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-gray-700 hover:text-gray-900">Home</Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>Go to Home</Button>
            <Button variant="default" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        <div className="bg-[#d9d9d9] min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
