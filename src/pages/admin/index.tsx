import { Outlet } from "react-router-dom";
import Sidebar from "../../layouts/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
