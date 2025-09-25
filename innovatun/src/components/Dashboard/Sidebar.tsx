import {
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import menuItems from "../../lib/data";
import Logo from "../../assets/images/innovatun_logo_bg_less.png";
export default function Sidebar() {
  return (
    <div className="shadow-xl">
      <div className="w-64 bg-sidebar border-r border-sidebar-border ">
        <div className="p-6">
          <div className="flex items-center space-x-1">
            <div className="h-10 w-10      rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">
                <img src={Logo} alt="Innovatun" className="w-10 h-10" />
              </span>
            </div>
            <span className="font-semibold text-sidebar-foreground">
              Innovatun.
            </span>
          </div>
        </div>

        <div className="px-3 mb-4">
          <Button className="w-full justify-start  text-primary-foreground ">
            <Plus className="h-4 w-4 mr-2" />
            Quick Create
          </Button>
        </div>

        <nav className="px-3 space-y-1">
          {menuItems?.map((item) => (
            <Link key={item.id} to={`${item.link}`}>
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start text-sidebar-foreground  hover:bg-primary/90  hover:text-white`}
              >
                {/* <item.icon className="h-4 w-4 mr-2" /> */}
                {item.name}
              </Button>
            </Link>
          ))}
          {/* <Button
            variant="ghost"
            className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LifeBuoy className="h-4 w-4 mr-2" />
            Lifecycle
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Projects
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Users className="h-4 w-4 mr-2" />
            Team
          </Button> */}
        </nav>

        <div className="absolute bottom-4 left-3 right-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
