const ITEMS = [
  "⚽ BOOKING REAL-TIME",
  "★ LAPANGAN PREMIUM",
  "⚡ KONFIRMASI INSTAN",
  "💳 BAYAR MUDAH",
  "🏆 5000+ PEMAIN AKTIF",
  "📅 CEK JADWAL 24/7",
];

const MarqueeStrip = () => {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      className="py-4 overflow-hidden"
      style={{ background: "var(--primary)" }}
    >
      <div className="lp-marquee-track">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="lp-display font-black italic text-sm uppercase tracking-widest px-8 shrink-0"
            style={{ color: "var(--primary-foreground)", opacity: 0.92 }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
