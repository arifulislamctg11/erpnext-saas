import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Main from "../layout/Main/Main";
import About from "../pages/About/About";
import Register from "../features/auth/Register/Register";
import CheckoutPage from "../features/auth/Register/checkout";

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
        path: "/checkout",
        element: <CheckoutPage />,
      },
      
    ],
  },
]

);

export default router;
