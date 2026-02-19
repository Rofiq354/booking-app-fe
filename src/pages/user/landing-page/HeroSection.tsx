import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="lp-hero-clip relative min-h-screen flex items-center pb-28 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Grid background */}
      <div className="lp-bg-grid absolute inset-0 pointer-events-none" />

      {/* Radial glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/3 w-[520px] h-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary), transparent 88%) 0%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, hsl(162 90% 35%), transparent 90%) 0%, transparent 70%)",
            filter: "blur(64px)",
          }}
        />
      </div>

      {/* Floating decorative shapes */}
      <div className="lp-float-1 absolute top-32 right-14 opacity-[0.15] hidden xl:block pointer-events-none">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle
            cx="65"
            cy="65"
            r="55"
            stroke="var(--primary)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 4"
          />
          <circle
            cx="65"
            cy="65"
            r="32"
            stroke="var(--primary)"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="65" cy="65" r="6" fill="var(--primary)" />
        </svg>
      </div>
      <div className="lp-float-2 absolute top-52 right-44 opacity-[0.1] hidden xl:block pointer-events-none">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <rect
            x="4"
            y="4"
            width="48"
            height="48"
            rx="6"
            stroke="var(--primary)"
            strokeWidth="2"
            fill="none"
            transform="rotate(22 28 28)"
          />
        </svg>
      </div>
      <div className="lp-float-3 absolute bottom-44 left-14 opacity-[0.12] hidden xl:block pointer-events-none">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <polygon
            points="45,5 85,75 5,75"
            stroke="hsl(162 90% 35%)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* LEFT: Copy */}
          <div className="flex-1 max-w-2xl">
            <div className="lp-label lp-slide-up mb-6 flex items-center gap-3">
              <span
                className="w-8 h-px"
                style={{ background: "var(--primary)" }}
              />
              Platform Futsal #1 Indonesia
            </div>

            <h1 className="lp-display font-black uppercase leading-none mb-6">
              <div
                className="lp-slide-up-1 text-6xl md:text-8xl xl:text-[7rem] tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                MAIN
              </div>
              <div className="lp-slide-up-2 flex items-baseline">
                <span className="text-6xl md:text-8xl xl:text-[7rem] tracking-tight italic lp-outline-text">
                  FUTSAL
                </span>
              </div>
              <div
                className="lp-slide-up-3 text-6xl md:text-8xl xl:text-[7rem] tracking-tight"
                style={{ color: "var(--primary)" }}
              >
                SEKARANG.
              </div>
            </h1>

            <p
              className="lp-slide-up-3 text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--muted-foreground)" }}
            >
              Booking lapangan futsal terbaik secara real-time. Tanpa telepon,
              tanpa antri — cukup pilih waktu, bayar, dan tanding.
            </p>

            <div className="lp-slide-up-4 flex flex-wrap gap-4">
              <Link
                to="/cari"
                className="lp-display lp-cta-glow font-black text-lg uppercase italic tracking-widest px-10 py-5 rounded-2xl transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), hsl(162 90% 35%))",
                  color: "var(--primary-foreground)",
                }}
              >
                Booking Sekarang →
              </Link>
              <Link
                to="/cari"
                className="lp-display font-black text-lg uppercase italic tracking-widest px-10 py-5 rounded-2xl border-2 transition-all duration-300"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--primary)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--muted-foreground)";
                }}
              >
                Lihat Lapangan
              </Link>
            </div>

            {/* Trust row */}
            <div className="lp-slide-up-4 mt-10 flex items-center gap-5">
              <div className="flex -space-x-2">
                {[
                  { bg: "var(--primary)", label: "A" },
                  { bg: "hsl(162 70% 38%)", label: "R" },
                  { bg: "hsl(38 92% 50%)", label: "D" },
                  { bg: "hsl(199 89% 48%)", label: "F" },
                ].map((av, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black text-white"
                    style={{
                      background: av.bg,
                      borderColor: "var(--background)",
                    }}
                  >
                    {av.label}
                  </div>
                ))}
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
                  5.000+
                </span>{" "}
                pemain aktif minggu ini
              </p>
            </div>
          </div>

          {/* RIGHT: Visual card */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Main orb */}
            <div
              className="relative w-72 h-72 lg:w-[400px] lg:h-[400px] rounded-3xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--primary), var(--card) 80%), var(--card))",
                boxShadow:
                  "0 0 0 1px var(--border), 0 48px 96px color-mix(in srgb, var(--primary), transparent 82%)",
              }}
            >
              {/* Court SVG */}
              <div
                className="lp-pulse-ring w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "color-mix(in srgb, var(--primary), transparent 86%)",
                }}
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    stroke="var(--primary)"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 26 L32 26 M26 20 L26 32"
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Floating stat: Real-time */}
              <div
                className="lp-float-1 absolute -top-7 -right-7 rounded-2xl p-4 shadow-2xl"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="lp-label mb-1">Real-time</div>
                <div
                  className="lp-display font-black text-2xl italic"
                  style={{ color: "var(--foreground)" }}
                >
                  3 Slot
                </div>
                <div className="text-xs" style={{ color: "var(--primary)" }}>
                  tersedia hari ini
                </div>
              </div>

              {/* Floating stat: Last booking */}
              <div
                className="lp-float-2 absolute -bottom-7 -left-7 rounded-2xl p-4 shadow-2xl"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="lp-label mb-1">Booking terakhir</div>
                <div
                  className="lp-display font-black text-2xl italic"
                  style={{ color: "var(--foreground)" }}
                >
                  2 mnt lalu
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Lapangan Arena A
                </div>
              </div>

              {/* Floating stat: Rating */}
              <div
                className="lp-float-3 absolute top-1/2 -right-24 -translate-y-1/2 rounded-2xl p-5 shadow-2xl hidden lg:block"
                style={{ background: "var(--primary)" }}
              >
                <div
                  className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: "var(--primary-foreground)", opacity: 0.75 }}
                >
                  Rating
                </div>
                <div
                  className="lp-display font-black text-3xl italic"
                  style={{ color: "var(--primary-foreground)" }}
                >
                  4.9★
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 lp-scroll-bounce">
          <span
            className="text-[9px] font-black uppercase tracking-[0.3em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            Scroll
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <rect
              x="7"
              y="5"
              width="2"
              height="6"
              rx="1"
              fill="var(--primary)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
