import { Link } from "react-router-dom";

const CtaBanner = () => {
  return (
    <section className="py-16 px-6" style={{ background: "var(--background)" }}>
      <div
        className="max-w-5xl mx-auto rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), hsl(162 90% 28%))",
        }}
      >
        {/* Background grid */}
        <div
          className="lp-bg-grid absolute inset-0 pointer-events-none"
          style={{ opacity: 0.12 }}
        />

        {/* Glow blobs */}
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "hsl(162 90% 35%)",
            filter: "blur(48px)",
            opacity: 0.35,
          }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "var(--primary)",
            filter: "blur(48px)",
            opacity: 0.3,
          }}
        />

        {/* Content */}
        <div className="relative">
          <div
            className="lp-label mb-4"
            style={{ color: "var(--primary-foreground)", opacity: 0.75 }}
          >
            Ayo Bergabung
          </div>
          <h2
            className="lp-display font-black text-5xl lg:text-7xl uppercase italic leading-none mb-6"
            style={{ color: "var(--primary-foreground)" }}
          >
            Siap Tanding
            <br />
            Hari Ini?
          </h2>
          <p
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: "var(--primary-foreground)", opacity: 0.82 }}
          >
            Daftar gratis sekarang dan dapatkan promo booking perdana khusus
            member baru. Tidak perlu kartu kredit.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="lp-display font-black text-xl uppercase italic tracking-widest px-12 py-5 rounded-2xl transition-all duration-300 active:scale-95 shadow-2xl"
              style={{
                background: "var(--primary-foreground)",
                color: "var(--primary)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
            >
              Daftar Gratis →
            </Link>
            <Link
              to="/fields"
              className="lp-display font-black text-xl uppercase italic tracking-widest px-12 py-5 rounded-2xl border-2 transition-all duration-300"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--primary-foreground), transparent 50%)",
                color: "var(--primary-foreground)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "color-mix(in srgb, var(--primary-foreground), transparent 85%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              Lihat Lapangan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
