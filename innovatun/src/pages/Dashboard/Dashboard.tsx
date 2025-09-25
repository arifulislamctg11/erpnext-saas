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
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome back.</p>


    </div>
  );
}


