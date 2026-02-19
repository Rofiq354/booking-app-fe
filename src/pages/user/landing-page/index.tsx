import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gray-900 h-150 flex items-center overflow-hidden">
        {/* Overlay Background (Bisa ganti pakai image lapangan) */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
            MAIN FUTSAL <br />{" "}
            <span className="text-green-500">GAK PAKE RIBET.</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-200">
            Cek ketersediaan lapangan secara real-time, booking dalam hitungan
            detik, dan siap tanding bareng tim kesayanganmu.
          </p>
          <div className="flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-lg">
              Booking Sekarang
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition">
              Lihat Lapangan
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 bg-green-600">
        <div className="container mx-auto px-6 flex flex-wrap justify-around text-center text-white">
          <div className="p-4">
            <h3 className="text-4xl font-bold">20+</h3>
            <p className="opacity-80">Lapangan Berkelas</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold">5000+</h3>
            <p className="opacity-80">User Aktif</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="opacity-80">Sistem Booking</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
          Kenapa Booking di FutsalHub?
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Real-time Chat",
              desc: "Konfirmasi jadwal langsung tanpa nunggu lama.",
              icon: "⚡",
            },
            {
              title: "Pembayaran Mudah",
              desc: "Dukung berbagai metode e-wallet dan transfer bank.",
              icon: "💳",
            },
            {
              title: "Kualitas Lapangan",
              desc: "Semua partner kami memiliki rumput sintetis standar pro.",
              icon: "⚽",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <span className="text-2xl font-bold text-green-500">FutsalHub</span>
            <p className="mt-4 max-w-xs text-gray-400">
              Solusi digital terbaik untuk manajemen dan pemesanan lapangan
              futsal di Indonesia.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Navigasi</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-green-500">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500">
                  Cari Lapangan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500">
                  Promo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Bantuan</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-green-500">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© 2026 FutsalHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
