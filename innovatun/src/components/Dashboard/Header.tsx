import { LayoutDashboard, Github } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <div>
      <header className="h-16 border-b  w-full bg-white  header-shadow border-border flex items-center justify-between px-6">
        <Link to="/dashboard" className="cursor-pointer  group flex items-center  space-x-4 bg-[#262629] px-3 py-1.5 rounded-md">
          <LayoutDashboard className="h-7 w-7 scale-100  transition-all duration-400 group-hover:rotate-180 group-hover:scale-110 text-white" />
        </Link>
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Github className="h-4 w-4 mr-2" />
          Github
        </Button>
      </header>
    </div>
  );
}
