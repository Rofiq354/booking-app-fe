const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Pilih Lapangan",
    desc: "Cari lapangan terdekat sesuai anggaran dan fasilitas yang kamu butuhkan dengan filter canggih.",
  },
  {
    num: "02",
    icon: "📅",
    title: "Tentukan Waktu",
    desc: "Pilih tanggal dan slot jam bermain secara real-time tanpa khawatir bentrok booking.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Bayar & Main!",
    desc: "Bayar via e-wallet atau transfer, konfirmasi instan, dan kamu siap tanding!",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Right-side glow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at right, color-mix(in srgb, var(--primary), transparent 92%) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Section header */}
        <div className="mb-16">
          <div className="lp-label mb-4">Cara Kerja</div>
          <h2
            className="lp-display font-black text-5xl lg:text-6xl uppercase italic leading-none"
            style={{ color: "var(--foreground)" }}
          >
            Booking dalam{" "}
            <span style={{ color: "var(--primary)" }}>3 Langkah</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector arrows (desktop) */}
          {STEPS.slice(0, -1).map((_, i) => (
            <div
              key={i}
              className="hidden md:block absolute top-[4.5rem] text-2xl"
              style={{
                left: `calc(${(i + 1) * 33.33}% - 0.75rem)`,
                color: "var(--primary)",
                zIndex: 10,
              }}
            >
              →
            </div>
          ))}

          {STEPS.map((step, i) => (
            <div
              key={i}
              className="lp-hover-lift relative p-8 rounded-2xl border overflow-hidden"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              {/* Watermark number */}
              <span className="lp-step-watermark">{step.num}</span>

              <div className="relative">
                <div className="text-4xl mb-5">{step.icon}</div>
                <div className="lp-label mb-2">{step.num}</div>
                <h3
                  className="lp-display font-black text-2xl uppercase italic mb-3"
                  style={{ color: "var(--foreground)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "var(--primary)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
