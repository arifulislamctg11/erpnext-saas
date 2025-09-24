import "./App.css";
import { FrappeProvider } from "frappe-react-sdk";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <div>
      <FrappeProvider  >
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="bottom-center" />
        </AuthProvider>
      </FrappeProvider>
    </div>
  );
}

export default App;
