import { Star } from "lucide-react";
import { useFieldStats } from "../../../hooks/useFieldStats";

const TestimonialSection = () => {
  const { testimonials, loading } = useFieldStats();

  const fallbackTesti = [
    {
      name: "Andi Saputra",
      text: "Booking lapangan jadi gampang banget, tinggal klik langsung main!",
      avatar: "A",
      avatarBg: "#00A63E",
      rating: 5,
    },
    {
      name: "Budi Cahyono",
      text: "Fasilitas lapangan di sini top semua, sistem pembayarannya juga aman.",
      avatar: "B",
      avatarBg: "#14522B",
      rating: 5,
    },
    {
      name: "Citra Dewi",
      text: "Adminnya responsif kalau ada kendala jadwal. Rekomendasi banget!",
      avatar: "C",
      avatarBg: "#059669",
      rating: 4,
    },
  ];

  const displayTestis = testimonials?.length > 0 ? testimonials : fallbackTesti;

  return (
    <section className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="lp-label mb-4">Testimoni</div>
        <h2
          className="lp-display font-black text-5xl lg:text-6xl uppercase italic leading-none mb-14"
          style={{ color: "var(--foreground)" }}
        >
          Kata Mereka yang
          <br />
          <span style={{ color: "var(--primary)" }}>Sudah Booking</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {displayTestis.map((testi, i) => (
            <div
              key={i}
              className={`lp-hover-lift p-8 rounded-2xl border flex flex-col justify-between transition-all duration-500 ${loading ? "opacity-50 blur-sm" : "opacity-100"}`}
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                {/* StarRow dinamis berdasarkan rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      fill={
                        index < testi.rating ? "var(--warning)" : "transparent"
                      }
                      className={
                        index < testi.rating
                          ? "text-warning"
                          : "text-muted-border"
                      }
                    />
                  ))}
                </div>

                <p className="text-sm italic leading-relaxed mb-6 text-muted-foreground">
                  "{testi.text}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white shrink-0 shadow-sm"
                  style={{ background: testi.avatarBg }}
                >
                  {testi.avatar}
                </div>
                <div>
                  <p className="lp-display font-black text-sm uppercase italic leading-none mb-0.5 text-foreground">
                    {testi.name}
                  </p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    Verified Player
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
