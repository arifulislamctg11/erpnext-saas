import { useAuth } from "../../contexts/use-auth";
import { Button } from "../ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Management Panel</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {user?.email}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
