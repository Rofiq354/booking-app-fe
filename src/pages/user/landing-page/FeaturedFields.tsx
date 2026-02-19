import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fieldService, type FieldRequest } from "../../../services/field";
import FieldCard from "./FieldCard";

// Skeleton loader untuk card lapangan
const FieldCardSkeleton = () => (
  <div
    className="rounded-2xl border overflow-hidden animate-pulse"
    style={{ background: "var(--card)", borderColor: "var(--border)" }}
  >
    <div className="h-44" style={{ background: "var(--muted)" }} />
    <div className="p-5 space-y-3">
      <div
        className="h-5 w-3/4 rounded-lg"
        style={{ background: "var(--muted)" }}
      />
      <div className="flex justify-between items-center">
        <div
          className="h-7 w-24 rounded-lg"
          style={{ background: "var(--muted)" }}
        />
        <div
          className="h-9 w-20 rounded-xl"
          style={{ background: "var(--muted)" }}
        />
      </div>
    </div>
  </div>
);

const FeaturedFields = () => {
  const [fields, setFields] = useState<FieldRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const response = await fieldService.getAllFields();

        // data bisa FieldRequest[] | FieldRequest, pastikan array
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];

        // Tampilkan maksimal 3 di landing page
        setFields(data.slice(0, 3));
      } catch (err) {
        setError("Gagal memuat data lapangan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  return (
    <section className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="lp-label mb-4">Lapangan Unggulan</div>
            <h2
              className="lp-display font-black text-5xl lg:text-6xl uppercase italic leading-none"
              style={{ color: "var(--foreground)" }}
            >
              Paling <span style={{ color: "var(--primary)" }}>Populer</span>
            </h2>
          </div>

          <Link
            to="/cari"
            className="lp-display font-black text-sm uppercase italic tracking-widest px-6 py-3 rounded-xl border transition-all duration-300 self-start md:self-auto"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--primary)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--primary-foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--primary)";
            }}
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Error state */}
        {error && (
          <div
            className="flex items-center gap-4 p-5 rounded-2xl border mb-8"
            style={{
              background:
                "color-mix(in srgb, var(--destructive), transparent 90%)",
              borderColor:
                "color-mix(in srgb, var(--destructive), transparent 70%)",
            }}
          >
            <span className="text-2xl">⚠️</span>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: "var(--destructive)" }}
              >
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs underline mt-1 transition-opacity hover:opacity-70"
                style={{ color: "var(--destructive)" }}
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? // Skeleton saat loading
              Array(3)
                .fill(0)
                .map((_, i) => <FieldCardSkeleton key={i} />)
            : fields.length > 0
              ? // Data dari API
                fields.map((field, i) => (
                  <FieldCard
                    key={field.id}
                    id={field.id}
                    name={field.name}
                    description={field.description}
                    image={field.image}
                    price={field.price}
                    delay={`${i * 0.1}s`}
                  />
                ))
              : // Empty state
                !error && (
                  <div
                    className="col-span-3 text-center py-20 rounded-2xl border"
                    style={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="text-5xl mb-4">🏟️</div>
                    <p
                      className="lp-display font-black text-xl uppercase italic"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Belum ada lapangan tersedia
                    </p>
                  </div>
                )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFields;
