import App from "@/App"
import About from "@/pages/About"
import Publication from "@/pages/Publication"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                Component: About,
                path: "/about"
            },
            {
                Component: Publication,
                path: "/publication"
            },
        ],
    },

])