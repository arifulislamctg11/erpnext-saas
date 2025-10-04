import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Dashboard/Sidebar";
import Header from "../../components/Dashboard/Header";
import { useState } from "react";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  console.log("Sidebar open state:", open);
  const handleLeft = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar open={open} />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className=" bg-white border-b border-gray-200  z-10">
          <Header handleLeft={handleLeft} />
        </div>
        <div className="bg-[#d9d9d9] ">
          <Outlet /> {/* child pages render here */}
        </div>
      </main>
    </div>
  );
}
