import "./App.css";
import { FrappeProvider } from "frappe-react-sdk";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
function App() {
  return (
    <div>
      <FrappeProvider>
        <RouterProvider router={router} />
      </FrappeProvider>
    </div>
  );
}

export default App;
