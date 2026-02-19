import { useCallback, useEffect, useState } from "react";
import FormField from "./Form";
import DataTable from "../../../components/DataTable";
import { fieldService, type FieldRequest } from "../../../services/field";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";
import ConfirmModal from "../../../components/ConfirmDeleteModal";
import FormTimeSlot from "./FormTimeSlot";
import DetailSlotModal from "./DetailSlotModal";
import type { TimeSlot } from "../../../services/time-slot";
import { TrashIcon } from "../../../components/icon/Trash";
import { EditIcon } from "../../../components/icon/Edit";

export interface FieldWithSlots extends FieldRequest {
  slots: TimeSlot[];
}

const FieldPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState<FieldWithSlots[]>([]);
  const [selectedField, setSelectedField] = useState<FieldWithSlots | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle Delete Field
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Time Slot For Create
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Detail Time Slot by Field id
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchFields = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsInitialLoad(true);
    try {
      const res = await fieldService.getAllFields();
      setFields(res.data as FieldWithSlots[]);
    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      if (!isSilent) {
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleEdit = (field: FieldWithSlots) => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedField(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    setFieldToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fieldToDelete) return;

    setIsDeleting(true);
    try {
      const result = await fieldService.deleteField(fieldToDelete.id);
      if (result.status === "success") {
        toast.success(result.message);
        fetchFields(true);
        setIsConfirmOpen(false); // Tutup modal
      }
    } catch (error) {
      const errorData = getErrorMessage(error);
      toast.error(errorData.message as string);
    } finally {
      setIsDeleting(false);
      setFieldToDelete(null);
    }
  };

  const handleOpenAddSlotFromDetail = () => {
    setIsDetailModalOpen(false);
    setIsTimeModalOpen(true);
  };

  // Definisi Kolom Tabel
  const columns = [
    {
      header: "No.",
      render: (_: FieldWithSlots, index: number) => (
        <span className="font-medium text-slate-400">{index + 1}</span>
      ),
    },
    {
      header: "Nama Lapangan",
      key: "name",
    },
    {
      header: "Deskripsi",
      key: "description",
      render: (item: FieldWithSlots) => (
        <span className="text-slate-500 italic">
          {item.description || "Tidak ada deskripsi"}
        </span>
      ),
    },
    {
      header: "Harga / Jam",
      key: "price",
      render: (item: FieldWithSlots) => (
        <span className="font-semibold text-green-600">
          Rp {item.price.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Jadwal Operasional",
      render: (item: FieldWithSlots) => {
        // const slots = item.slots;
        console.log("Data Item:", item);

        // Coba cek kedua kemungkinan nama property
        const slots = item.slots;

        // JIKA BELUM ADA JADWAL
        if (!slots || slots.length === 0) {
          return (
            <button
              onClick={() => {
                setActiveField({ id: item.id, name: item.name });
                setIsTimeModalOpen(true); // Buka modal tambah
              }}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 transition-all"
            >
              <span>📅</span> Set Jadwal
            </button>
          );
        }

        // JIKA SUDAH ADA JADWAL (Logic Ringkasan)
        const sortedDates = [...slots].sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );

        const firstDate = new Date(sortedDates[0].startTime);
        const lastDate = new Date(
          sortedDates[sortedDates.length - 1].startTime,
        );

        const formatDate = (d: Date) =>
          d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        const getDayName = (d: Date) =>
          d.toLocaleDateString("id-ID", { weekday: "short" });

        return (
          <div
            className="cursor-pointer group flex flex-col gap-0.5"
            onClick={() => {
              setActiveField({ id: item.id, name: item.name });
              setIsDetailModalOpen(true);
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-600 text-sm group-hover:underline">
                {getDayName(firstDate)} - {getDayName(lastDate)}
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                Detail
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {formatDate(firstDate)} - {formatDate(lastDate)}
            </span>
          </div>
        );
      },
    },
    {
      header: "Aksi",
      render: (item: FieldWithSlots) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all shadow-sm"
            title="Edit Admin"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => handleDelete(item.id, item.name)}
            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
            title="Cabut Akses"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Lapangan</h1>
          <p className="text-slate-500 text-sm">
            Kelola harga dan jenis lapangan Anda
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2 font-medium"
        >
          <span className="text-xl">+</span> Tambah Lapangan
        </button>
      </div>

      <DataTable
        columns={columns}
        data={fields}
        isLoading={isInitialLoad}
        emptyMessage="Belum ada lapangan yang didaftarkan."
      />

      {/* Komponen Modal */}
      <FormField
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchFields(true)}
        initialData={selectedField}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus "${fieldToDelete?.name}"? Tindakan ini tidak bisa dibatalkan.`}
        isLoading={isDeleting}
      />

      {/* Modal Time Slot */}
      {activeField && (
        <FormTimeSlot
          isOpen={isTimeModalOpen}
          onClose={() => {
            setIsTimeModalOpen(false);
            setActiveField(null);
          }}
          onSuccess={() => {
            fetchFields(true);
            setIsTimeModalOpen(false);
            setIsDetailModalOpen(true);
          }}
          fieldId={activeField.id}
          fieldName={activeField.name}
        />
      )}

      {/* Modal Detail */}
      {activeField && (
        <DetailSlotModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setActiveField(null);
          }}
          onAddClick={handleOpenAddSlotFromDetail}
          fieldId={activeField.id}
          fieldName={activeField.name}
        />
      )}
    </div>
  );
};

export default FieldPage;
