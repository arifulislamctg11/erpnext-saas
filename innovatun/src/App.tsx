import "./App.css";
import { FrappeProvider } from "frappe-react-sdk";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { Toaster } from "sonner";
function App() {
  return (
    <div>
      <FrappeProvider  >
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-center" />
      </FrappeProvider>
    </div>
  );
}

export default App;
