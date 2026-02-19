import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true, type: "classic" }, // Penting agar fitur ini aktif saat coding (dev mode)
      workbox: {
        // Menghindari error "glob patterns" tadi dengan memberitahu
        // workbox untuk tidak panik jika folder dev-dist kosong
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: "Sistem Booking Lapangan Futsal",
        short_name: "FutsalHub",
        theme_color: "#ffffff",
      },
    }),
  ],
});
