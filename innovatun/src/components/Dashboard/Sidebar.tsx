import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import menuItems from "../../lib/data";
import Logo from "../../assets/images/innovatun_logo_bg_less.png";
import { cn } from "../../lib/utils";
export default function Sidebar() {
  const location = useLocation()
  return (
    <div className="shadow-xl">
      <div className="w-64 bg-sidebar  border-r border-sidebar-border ">
        <div className="p-3 shadow-md">
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

        <nav className="px-3 h-full space-y-1">
          <div className="flex pt-1 items-start border-b border-gray-400 pb-1">
            <h2 className="text-sm">Main</h2>
          </div>
          <div className="mb-2">
          {menuItems?.map((item) => {
            const isActive = item.link ===location.pathname
            return (
              <Link key={item.id} to={`${item.link}`} >
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    `w-full justify-start text-sidebar-foreground my-[1px] hover:bg-primary/90  hover:text-white`,
                    isActive? "bg-primary text-white":"hover:bg-primary/90 hover:text-white"
                  )}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            );
          })}
          </div>

        </nav>

        <div className=" bottom-4  left-3 right-3">
          <Button
            variant="ghost"
            className=" w-[200px] bg-gray-300 hover:bg-gray-400 justify-start text-sidebar-foreground  hover:text-white "
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
