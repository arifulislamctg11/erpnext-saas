"use client";

import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import menuItems from "../../lib/data";
import Logo from "../../assets/images/innovatun_logo_bg_less.png";
import { cn } from "../../lib/utils";

export default function Sidebar(open: { open: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "shadow-xl bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        open.open ? "w-64" : "w-20"
      )}
    >
      <div className="p-3 shadow-md">
        <Link to="/dashboard" className="flex items-center space-x-1">
          <div className="h-10 w-10 rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">
              <img
                src={Logo || "/placeholder.svg"}
                alt="Innovatun"
                className="w-10 h-10"
              />
            </span>
          </div>
          {open.open && (
            <span className="font-semibold text-sidebar-foreground whitespace-nowrap">
              Innovatun.
            </span>
          )}
        </Link>
      </div>

      <nav className="px-3 h-full">
        {open.open && (
          <div className="flex pt-1 items-start border-b border-gray-400 pb-1">
            <h2 className="text-sm">Main</h2>
          </div>
        )}
        <div className="mb-2 space-y-1">
          {menuItems?.map((item) => {
            const isActive = item.link === location.pathname;
            return (
              <Link key={item.id} to={`${item.link}`}>
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    `w-full justify-start text-sidebar-foreground my-[1px] hover:bg-primary/90 hover:text-white transition-colors`,
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-primary/90 hover:text-white",
                    !open.open && "justify-center px-2"
                  )}
                >
                  <span>{item.icon}</span>
                  {open.open && <span>{item.name}</span>}
                </Button>
              </Link>
            );
          })}
          <div className="bottom-4 ">
            <Button
              onClick={() => navigate("/dashboard/settings")}
              variant="ghost"
              className={cn(
                `w-full justify-start text-sidebar-foreground my-[1px] hover:bg-primary/90 hover:text-white transition-colors`,
                location.pathname == "/dashboard/settings"
                  ? "bg-primary text-white"
                  : "hover:bg-primary/90 hover:text-white",
                !open.open && "justify-center px-2"
              )}
            >
              <Settings className="h-4 w-4 mr-2" />
              {open.open && "Settings"}
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
