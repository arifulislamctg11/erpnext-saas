// import { Outlet } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout/DashboardLayout";

import { useFrappeGetDocList } from "frappe-react-sdk";

export default function Dashboard() {

  const projects = () => {
    // Placeholder for future project fetching logic
    const data = useFrappeGetDocList("Project", {
      fields: ["name", "project_name", "status"],
    });
    console.log(data);
  }
  return (
    <div className="container mx-auto p-6">
      <DashboardLayout/>
    </div>
  );
}
