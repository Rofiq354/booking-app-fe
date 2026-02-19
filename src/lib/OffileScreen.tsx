import React from "react";

const OfflineScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-9999 bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Ilustrasi Visual: Kartu Merah */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-32 bg-red-500 rounded-lg shadow-2xl rotate-12 flex items-center justify-center border-4 border-red-600 animate-bounce">
            <span className="text-5xl">🚫</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2 rounded-full shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>

        {/* Pesan Error */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 italic">
          KONEKSI <span className="text-red-600 uppercase">Offside!</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Waduh, sepertinya sinyal kamu lagi kena{" "}
          <span className="font-bold text-red-500">kartu merah</span>. Cek Wi-Fi
          atau kuota biar bisa lanjut booking lapangan!
        </p>

        {/* Tombol Aksi */}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Coba Refresh Lapangan
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Status:{" "}
          <span className="text-red-400">
            Disconnected dari Server FutsalHub
          </span>
        </p>
      </div>
    </div>
  );
};

export default OfflineScreen;
