import {
House ,
User ,
Podcast ,
Fuel ,
Venus 
} from "lucide-react";


const  menuItems = [

    {
        id: 1,
        name: "Dashboard",
        link: "/dashboard",
        icon: <House />,
    },
    {
        id: 2,
        name: "Profile",
        link: "/dashboard/profile",
        icon: <User />,
    },
        {
        id: 3,
        name: "Subscriptions",
        link: "/dashboard/subscriptions",
        icon:  <Podcast />,
    },
     {
        id: 4,
        name: "Billing",
        link: "/dashboard/billing",
        icon: <Fuel />,
    },
     {
        id: 5,
        name: "Current Plan",
        link: "/dashboard/current-plan",
        icon: <Venus />,
    },
    //  {
    //     id: 3,
    //     name: "Subscriptions",
    //     link: "/dashboard/subscriptions",
    //     icon: "Clock",
    // },
    //  {
    //     id: 3,
    //     name: "Subscriptions",
    //     link: "/dashboard/subscriptions",
    //     icon: "Clock",
    // },
    //  {
    //     id: 3,
    //     name: "Subscriptions",
    //     link: "/dashboard/subscriptions",
    //     icon: "Clock",
    // },
    // {
    //     id: 4,
    //     name: "Analytics",
    //     link: "/analytics",
    //     icon: "Clock",
    // },
    // {
    //     id: 5,
    //     name: "Projects",
    //     link: "/projects",
    //     icon: "Folder",
    // },
    // {
    //     id: 6,
    //     name: "Team",
    //     link: "/team",
    //     icon: "Users",
    // },
    // {
    //     id: 7,
    //     name: "Documents",
    //     type: "header", // optional, just a label
    // },
    // {
    //     id: 8,
    //     name: "Data Library",
    //     link: "/documents/data-library",
    //     icon: "FileText",
    // },
    // {
    //     id: 9,
    //     name: "Reports",
    //     link: "/documents/reports",
    //     icon: "BarChart",
    // },
    // {
    //     id: 10,
    //     name: "Word Assistant",
    //     link: "/documents/word-assistant",
    //     icon: "FileText",
    // },
    // {
    //     id: 11,
    //     name: "More",
    //     link: "#",
    //     icon: "MoreVertical",
    // },
    // {
    //     id: 12,
    //     name: "billing",
    //     link: "/billing",
    //     icon: "Clock",
    // },
    // {
    //     id: 13,
    //     name: "currentPlan",
    //     link: "/current-plan",
    //     icon: "Clock",
    // },
    // {
    //     id: 14,
    //     name: "subscriptions",
    //     link: "/subscriptions",
    //     icon: "Clock",
    // },
]

export default menuItems
