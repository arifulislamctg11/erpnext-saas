import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Main from "../layout/Main/Main";
import About from "../pages/About/About";
import Register from "../features/auth/Register/Register";

import Payments from "../pages/StripePayments/[Payments]";

import CheckoutPage from "../features/auth/Register/checkout";
// import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import Profile from "../pages/Dashboard/Profile/Profile";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import Billing from "../pages/Dashboard/Billing/Billing";
import CurrentPlan from "../pages/Dashboard/CurrentPlan/CurrentPlan";
import Subscription from "../pages/Dashboard/Subscriptions/Subscription";

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

      {
        path: "/payments/:id",
        element: <Payments />,
      },

      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> }, // /dashboard
          { path: "profile", element: <Profile /> }, // /dashboard/profile
          { path: "billing", element: <Billing/> }, // /dashboard/profile
          { path: "current-plan", element: <CurrentPlan /> }, // /dashboard/profile
          { path: "subscriptions", element: <Subscription /> }, // /dashboard/profile
        ],
      },
    ],
  },
]);

export default router;
