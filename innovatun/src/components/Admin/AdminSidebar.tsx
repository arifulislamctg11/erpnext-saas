import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import adminMenuItems from "../../lib/admin-data";
import Logo from "../../assets/images/innovatun_logo_bg_less.png";
import { cn } from "../../lib/utils";

export default function AdminSidebar() {
  const location = useLocation();
  
  return (
    <div className="shadow-xl">
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-3 shadow-md">
          <div className="flex items-center space-x-1">
            <div className="h-10 w-10 rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">
                <img src={Logo} alt="Innovatun" className="w-10 h-10" />
              </span>
            </div>
            <span className="font-semibold text-sidebar-foreground">
              Innovatun Admin
            </span>
          </div>
        </div>

        <nav className="px-3 h-full">
          <div className="flex pt-1 items-start border-b border-gray-400 pb-1">
            <h2 className="text-sm">Management</h2>
          </div>
          <div className="mb-2 space-y-1">
            {adminMenuItems?.map((item) => {
              const isActive = item.link === location.pathname;
              return (
                <Link key={item.id} to={`${item.link}`}>
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      `w-full justify-start text-sidebar-foreground my-[1px] hover:bg-primary/90 hover:text-white`,
                      isActive ? "bg-primary text-white" : "hover:bg-primary/90 hover:text-white"
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
      </div>
    </div>
  );
}
