import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Main from "../layout/Main/Main";
import About from "../pages/About/About";
import Register from "../features/auth/Register/Register";
// import CheckoutPage from "../features/auth/Register/checkout";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import SuccessPage from "../pages/Success/Success";
import CancelPage from "../pages/Cancel/Cancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
            {
        path: "/register",
        element: <Register />,
      },
      //  {
      //   path: "/checkout",
      //   element: <CheckoutPage />,

      // },
       {
        path: "/success",
        element: <SuccessPage />,
      },
      {
        path: "/cancel",
        element: <CancelPage/>,
      },
      
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      
    ],
  },
] ,
{
  basename: import.meta.env.VITE_BASE_PATH || "/",
}

);

export default router;
