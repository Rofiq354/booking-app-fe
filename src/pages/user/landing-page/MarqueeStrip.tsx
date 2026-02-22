import { useFieldStats } from "../../../hooks/useFieldStats";

const MarqueeStrip = () => {
  const { totalPlayers, slotsToday, globalRating, loading } = useFieldStats();
  const dynamicItems = [
    `⚽ ${loading ? "..." : slotsToday} SLOT TERSEDIA HARI INI`,
    `🏆 ${loading ? "5000" : totalPlayers.toLocaleString()}+ PEMAIN AKTIF`,
    `★ RATING TERBAIK ${loading ? "5.0" : globalRating}/5.0`,
    "⚡ KONFIRMASI INSTAN",
    "💳 BAYAR VIA QRIS & TRANSFER",
    "🛡️ LAPANGAN STANDAR FIFA",
  ];

  const doubled = [...dynamicItems, ...dynamicItems];

  return (
    <div className="py-4 overflow-hidden bg-primary">
      <div className="lp-marquee-track">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="lp-display text-primary-foreground/90 font-black italic text-sm uppercase tracking-widest px-8 shrink-0"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
