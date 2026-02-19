import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DataTable from "../../../components/DataTable";
import AddAdminModal from "./Form";
import { adminService, type AdminUser } from "../../../services/user-admin";
import { getErrorMessage } from "../../../utils/error";

const SetAdminPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllAdmins();
      console.log(res);
      setAdmins(res.data);
    } catch (error) {
      const errorData = getErrorMessage(error);
      toast.error(errorData.message as string);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const columns = [
    {
      header: "Administrator",
      render: (item: AdminUser) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {item.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">
              {item.name}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {item.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Role Access",
      render: (item: AdminUser) => (
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-wider">
          {item.role}
        </span>
      ),
    },
    {
      header: "Tanggal Bergabung",
      render: (item: AdminUser) => (
        <span className="text-xs text-slate-500 font-medium">
          {/* Sesuai backend: item.created_at */}
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <Toaster position="top-center" />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manajemen Admin
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Kelola staf yang dapat mengakses dashboard manajemen
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2 font-medium"
        >
          <span className="text-xl">+</span> Tambah Lapangan
        </button>
      </div>

      <DataTable columns={columns} data={admins} isLoading={isLoading} />

      <AddAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Re-fetch data admin
          toast.success("Admin baru berhasil ditambahkan!");
        }}
      />
    </div>
  );
};

export default SetAdminPage;
