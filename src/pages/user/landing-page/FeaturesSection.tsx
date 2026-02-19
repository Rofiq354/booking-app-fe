import Counter from "./Counter";

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-time Availability",
    desc: "Slot booking diupdate otomatis setiap detik. Tidak ada lagi double booking atau konflik jadwal.",
  },
  {
    icon: "🤝",
    title: "Konfirmasi Instan",
    desc: "Notifikasi booking langsung via WhatsApp & email dalam hitungan detik setelah pembayaran.",
  },
  {
    icon: "⭐",
    title: "Lapangan Terverifikasi",
    desc: "Setiap lapangan partner telah melewati standar kualitas ketat FutsalHub.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, color-mix(in srgb, var(--primary), var(--background) 92%) 0%, var(--background) 60%)",
        }}
      />
      <div className="lp-bg-grid absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT: Feature list */}
          <div>
            <div className="lp-label mb-4">Keunggulan Kami</div>
            <h2
              className="lp-display font-black text-5xl lg:text-6xl uppercase italic leading-none mb-12"
              style={{ color: "var(--foreground)" }}
            >
              Kenapa Pilih
              <br />
              <span style={{ color: "var(--primary)" }}>FutsalHub?</span>
            </h2>

            <div className="space-y-5">
              {FEATURES.map((feat, i) => (
                <div
                  key={i}
                  className="group flex gap-5 p-5 rounded-2xl border transition-all duration-300 cursor-default"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "color-mix(in srgb, var(--primary), transparent 55%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--border)";
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background:
                        "color-mix(in srgb, var(--primary), transparent 88%)",
                    }}
                  >
                    {feat.icon}
                  </div>
                  <div>
                    <h4
                      className="lp-display font-black text-xl uppercase italic mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {feat.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Big stat cards */}
          <div className="hidden lg:flex flex-col gap-5">
            {/* Rating card */}
            <div
              className="lp-hover-lift p-10 rounded-3xl relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), hsl(162 90% 32%))",
                boxShadow:
                  "0 0 64px color-mix(in srgb, var(--primary), transparent 60%)",
              }}
            >
              <div
                className="lp-display font-black italic absolute -right-4 -top-4 leading-none select-none"
                style={{
                  fontSize: "8rem",
                  color: "var(--primary-foreground)",
                  opacity: 0.1,
                }}
              >
                4.9
              </div>
              <div
                className="lp-label mb-3"
                style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
              >
                Rating Platform
              </div>
              <div
                className="lp-display font-black italic leading-none mb-2"
                style={{ fontSize: "5rem", color: "var(--primary-foreground)" }}
              >
                4.9★
              </div>
              <p style={{ color: "var(--primary-foreground)", opacity: 0.75 }}>
                dari 2.000+ ulasan pengguna
              </p>
            </div>

            {/* Two mini stat cards */}
            <div className="grid grid-cols-2 gap-5">
              <div
                className="lp-hover-lift p-8 rounded-3xl border"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="lp-label mb-2">Booking hari ini</div>
                <div
                  className="lp-display font-black italic leading-none"
                  style={{ fontSize: "3.5rem", color: "var(--foreground)" }}
                >
                  <Counter end={234} />
                </div>
              </div>
              <div
                className="lp-hover-lift p-8 rounded-3xl border"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="lp-label mb-2">Lapangan aktif</div>
                <div
                  className="lp-display font-black italic leading-none"
                  style={{ fontSize: "3.5rem", color: "var(--foreground)" }}
                >
                  <Counter end={20} suffix="+" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
