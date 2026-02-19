import { Outlet } from "react-router-dom";
import Sidebar from "../../layouts/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <main className="flex-1 ml-0 pt-16 md:pt-0 md:ml-16 lg:ml-64 p-6 lg:p-10 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
