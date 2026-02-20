import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fieldService, type FieldRequest } from "../../../../services/field";
import { formatPrice } from "../../../../utils/format";

/* ── Simulasi Helper (Sesuai dengan Card sebelumnya) ── */
const getSimulatedRating = (id: string | number) => {
  const hash = String(id)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (hash % 11) / 10 + 4;
  const reviews = (hash % 80) + 10;
  return { rating: rating.toFixed(1), reviews };
};

const FieldDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [field, setField] = useState<FieldRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const res = await fieldService.getDetailField(id);
        // Response detail biasanya langsung object di dalam res.data
        setField(res.data as FieldRequest);
      } catch (err: unknown) {
        console.log(err);
        setError("Gagal memuat detail lapangan.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-pulse font-['Barlow_Condensed'] text-2xl italic font-black text-muted-foreground uppercase tracking-widest">
        Memuat Lapangan...
      </div>
    );
  if (error || !field)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive font-bold">
          {error || "Lapangan tidak ditemukan"}
        </p>
        <Link
          to="/lapangan"
          className="px-6 py-2 bg-primary text-white rounded-full"
        >
          Kembali
        </Link>
      </div>
    );

  const { rating, reviews } = getSimulatedRating(field.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Hero Section ── */}
      <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
        {field.image ? (
          <img
            src={field.image}
            alt={field.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-primary/20">
            <span className="text-9xl">🏟️</span>
          </div>
        )}
        {/* Overlay agar text putih terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Back Button */}
        <Link
          to="/fields"
          className="absolute top-6 left-6 glass p-3 rounded-full hover:scale-110 transition-transform"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* ── Content Section ── */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Utama (Kiri) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest glass ${field.slots && field.slots.length > 0 ? "badge-available" : "badge-booked"}`}
                >
                  {field.slots && field.slots.length > 0
                    ? "Tersedia Hari Ini"
                    : "Penuh"}
                </span>
                <div className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border">
                  <span className="text-warning text-sm">★</span>
                  <span className="text-xs font-bold">{rating}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({reviews} Ulasan)
                  </span>
                </div>
              </div>

              <h1 className="font-['Barlow_Condensed'] text-5xl md:text-7xl font-black italic uppercase leading-[0.9] text-foreground">
                {field.name}
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                {field.description || "Tidak ada deskripsi untuk lapangan ini."}
              </p>
            </div>

            {/* Fasilitas (Dummy) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Lantai Interlock", "Lampu LED", "Kantin", "Parkir Luas"].map(
                (feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card/30 backdrop-blur-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-tight">
                      {feat}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Sidebar Booking (Kanan) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass p-8 rounded-3xl border border-border shadow-2xl space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Biaya Sewa
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-['Barlow_Condensed'] text-5xl font-black italic text-primary leading-none">
                    {formatPrice(field.price)}
                  </span>
                  <span className="text-muted-foreground italic font-medium">
                    /jam
                  </span>
                </div>
              </div>

              <div className="h-[1px] w-full bg-border" />

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Status Jadwal
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70 font-medium">
                    Total Slot Aktif
                  </span>
                  <span className="font-black italic text-primary">
                    {field.slots?.length || 0} Slot
                  </span>
                </div>
              </div>

              <button className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-['Barlow_Condensed'] text-xl font-black italic uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                Booking Sekarang
                <svg
                  className="group-hover:translate-x-1 transition-transform"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <p className="text-[10px] text-center text-muted-foreground font-medium uppercase leading-tight">
                Konfirmasi instan setelah pembayaran berhasil dilakukan via
                Midtrans
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailPage;
