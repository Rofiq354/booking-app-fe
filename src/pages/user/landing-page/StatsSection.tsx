import Counter from "./Counter";

const STATS = [
  { value: 20, suffix: "+", label: "Lapangan Tersedia" },
  { value: 5000, suffix: "+", label: "User Aktif Bulanan" },
  { value: 99, suffix: "%", label: "Tingkat Kepuasan" },
  { value: 24, suffix: "/7", label: "Sistem Online" },
];

const StatsSection = () => {
  return (
    <section
      className="py-24 relative"
      style={{ background: "var(--background)" }}
    >
      {/* Background grid */}
      <div className="lp-bg-grid absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="lp-hover-lift text-center p-8 rounded-2xl border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="lp-display font-black italic text-6xl lg:text-7xl leading-none mb-3"
                style={{ color: "var(--primary)" }}
              >
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
