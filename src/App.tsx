import { Outlet } from "react-router"
import { CommonLayout } from "./components/layout/CommonLayout"

function App() {

  // console.log("generateRoutes(adminSidebarItems) : ", generateRoutes(adminSidebarItems));
  return (
    <CommonLayout>
      <Outlet></Outlet>
    </CommonLayout>
  )
}

export default App
