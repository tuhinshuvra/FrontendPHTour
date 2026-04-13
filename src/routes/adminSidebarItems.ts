import AddDivision from "@/pages/Admin/AddDivision";
import AddTour from "@/pages/Admin/AddTour";
import AddTourType from "@/pages/Admin/AddTourType";
import { ISidebarItem } from "@/types";
import { lazy } from "react"

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

export const adminSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Analytics",
                url: "/admin/analytics",
                component: Analytics,
            },
        ],
    },
    {
        title: "Tour Management",
        items: [
            {
                title: "Manage Divisions",
                url: "/admin/add-division ",
                component: AddDivision,
            },
            {
                title: "Manage Tour Types",
                url: "/admin/add-tour-type ",
                component: AddTourType,
            },
            {
                title: "Manage Tours",
                url: "/admin/add-tour",
                component: AddTour,
            },
        ],
    },
]