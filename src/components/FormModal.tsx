import React from "react";
import { X } from "lucide-react"; // Pakai icon lucide supaya konsisten

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl"; // Tambahkan prop size
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  if (!isOpen) return null;

  // Map ukuran modal
  const sizeClasses = {
    md: "max-w-md", // Untuk form simpel (Set Jadwal)
    lg: "max-w-2xl", // Untuk form medium
    xl: "max-w-4xl", // Untuk layout 2 kolom (Tambah Lapangan)
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop dengan blur yang lebih halus */}
      <div
        className="absolute inset-0 bg-background/10 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Container Modal */}
      <div
        className={`
        bg-card w-full ${sizeClasses[size]} 
        relative z-10 
        rounded-2xl shadow-card border border-border
        animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300
        overflow-hidden
      `}
      >
        {/* Header Modal - Style Sporty */}
        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-full transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
