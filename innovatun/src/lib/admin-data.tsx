import {
  BarChart3,
  Users,
  CreditCard,
  FileText,
  Shield,

} from "lucide-react";

const adminMenuItems = [
  {
    id: 1,
    name: "Dashboard",
    link: "/admin",
    icon: <BarChart3 />,
  },
  {
    id: 2,
    name: "Customers",
    link: "/admin/customers",
    icon: <Users />,
  },
  {
    id: 3,
    name: "Payments",
    link: "/admin/payments",
    icon: <CreditCard />,
  },
  {
    id: 4,
    name: "Subscriptions",
    link: "/admin/subscriptions",
    icon: <FileText />,
  },
  {
    id: 5,
    name: "Settings",
    link: "/admin/settings",
    icon: <Shield />,
  },
];

export default adminMenuItems;
