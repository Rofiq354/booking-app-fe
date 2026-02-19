import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <span className="text-2xl font-bold text-green-600">Futsal</span>
            <span className="text-2xl font-light text-gray-800">Hub</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Cari Lapangan
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Jadwal Saya
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Promo
            </a>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <button className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition">
              Profil
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <a href="#" className="block px-4 py-2 text-gray-700">
            Cari Lapangan
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700">
            Jadwal Saya
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700">
            Promo
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
