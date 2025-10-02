import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Main from "../layout/Main/Main";
import About from "../pages/About/About";
import Register from "../features/auth/Register/Register";
// import CheckoutPage from "../features/auth/Register/checkout";
// import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import SuccessPage from "../pages/Success/Success";
import CancelPage from "../pages/Cancel/Cancel";
import Login from "../features/auth/Register/Login";
import FrappeLogin from "../features/auth/Register/FrappeLogin";
import StripePayments from "../pages/StripePayments/[Payments]";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import Billing from "../pages/Dashboard/Billing/Billing";
import Profile from "../pages/Dashboard/Profile/Profile";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import CurrentPlan from "../pages/Dashboard/CurrentPlan/CurrentPlan";
import Subscription from "../pages/Dashboard/Subscriptions/Subscription";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/PasswordReset";
import { Settings } from "../pages/Dashboard/Settings/Settings";
import AdminDashboardLayout from "../layout/AdminDashboardLayout/AdminDashboardLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Customers from "../pages/Admin/Customers";
import Payments from "../pages/Admin/Payments";
import Subscriptions from "../pages/Admin/Subscriptions";
import AdminSettings from "../pages/Admin/AdminSettings";
import CustomerDetail from "../pages/Admin/CustomerDetail";
import { Createplan } from "../pages/Admin/CreatePlan";

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
        path: "/frappe-login",
        element: <FrappeLogin />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },


      {
        path: "/payments/:id",
        element: <StripePayments />,
      },

      {
        path: "/checkout",
        // element: <CheckoutPage />,
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
        path: "/forgot-password",
        element: <ForgotPassword/>,
      },
      {
        path: "/reset-password",
        element: <ResetPassword/>,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> }, 
          { path: "profile", element: <Profile /> }, 
          { path: "billing", element: <Billing/> }, 
          { path: "current-plan", element: <CurrentPlan /> }, 
          { path: "subscriptions", element: <Subscription /> }, 
          { path: "settings", element: <Settings /> },
        ],
      },
      {
        path: "/admin",
        element: (
          <AdminProtectedRoute>
            <AdminDashboardLayout />
          </AdminProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "customers", element: <Customers /> },
          { path: "customers/:id", element: <CustomerDetail /> },
          { path: "payments", element: <Payments /> },
          { path: "subscriptions", element: <Subscriptions /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "createplan", element: <Createplan /> },
        ],
      },
    ],
  },
]

);

export default router;
