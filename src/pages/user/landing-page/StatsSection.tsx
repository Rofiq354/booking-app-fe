import { useFieldStats } from "../../../hooks/useFieldStats";
import Counter from "./Counter";

const StatsSection = () => {
  const { totalFields, totalPlayers, globalRating, loading } = useFieldStats();

  const dynamicStats = [
    {
      value: loading ? 0 : totalFields,
      suffix: "+",
      label: "Lapangan Premium",
    },
    {
      value: loading ? 0 : totalPlayers,
      suffix: "+",
      label: "User Aktif",
    },
    {
      value: loading ? 0 : parseFloat(globalRating) * 20,
      suffix: "%",
      label: "Kepuasan User",
    },
    {
      value: 24,
      suffix: "/7",
      label: "Sistem Online",
    },
  ];

  return (
    <section className="py-24 relative bg-background">
      {/* Background grid */}
      <div className="lp-bg-grid absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicStats.map((stat, i) => (
            <div
              key={i}
              className="lp-hover-lift bg-card border-border text-center p-8 rounded-2xl border"
            >
              <div className="lp-display text-primary font-black italic text-6xl lg:text-7xl leading-none mb-3">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
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
