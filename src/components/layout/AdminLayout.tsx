import { Outlet } from "react-router";

export const AdminLayout = () => {
    return (
        <div>
            <h2>This is Admin  Layout</h2>
            <Outlet></Outlet>
        </div>
    );
};