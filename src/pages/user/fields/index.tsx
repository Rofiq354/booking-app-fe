import { useEffect, useMemo, useState } from "react";
import { fieldService, type FieldRequest } from "../../../services/field";
import useDebounce from "../../../hooks/useDebounce";
import FieldCard, { FieldCardSkeleton } from "./FieldCard";

/* ── Types ───────────────────────────────────────────────────── */
type SortOption = "default" | "price-asc" | "price-desc" | "slots-desc";
type FilterOption = "all" | "available" | "unavailable";

const FILTER_CHIPS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "available", label: "Ada Slot" },
  { value: "unavailable", label: "Tidak Ada Slot" },
];

/* ── Components ──────────────────────────────────────────────── */

const EmptyState = ({ query }: { query: string }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 rounded-2xl border border-border bg-card">
    <span className="text-6xl mb-5">🏟️</span>
    <p className="font-['Barlow_Condensed'] font-black italic uppercase text-2xl mb-2 text-foreground">
      {query ? "Tidak Ditemukan" : "Belum Ada Lapangan"}
    </p>
    <p className="text-sm text-muted-foreground">
      {query
        ? `Tidak ada hasil untuk "${query}"`
        : "Lapangan akan segera tersedia."}
    </p>
  </div>
);

const FieldsPage = () => {
  const [fields, setFields] = useState<FieldRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [filter, setFilter] = useState<FilterOption>("all");

  const debouncedSearch = useDebounce(search, 400);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fieldService.getAllFields();
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setFields(data);
    } catch {
      setError("Gagal memuat data lapangan. Periksa koneksi dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const filtered = useMemo(() => {
    let result = [...fields];

    // Search Logic
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.description ?? "").toLowerCase().includes(q),
      );
    }

    // Filter Logic
    if (filter === "available")
      result = result.filter((f) => (f.slots?.length ?? 0) > 0);
    if (filter === "unavailable")
      result = result.filter((f) => (f.slots?.length ?? 0) === 0);

    // Sort Logic
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "slots-desc")
      result.sort((a, b) => (b.slots?.length ?? 0) - (a.slots?.length ?? 0));

    return result;
  }, [fields, debouncedSearch, sort, filter]);

  const totalSlots = fields.reduce((s, f) => s + (f.slots?.length ?? 0), 0);
  const availableCount = fields.filter(
    (f) => (f.slots?.length ?? 0) > 0,
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground font-['DM_Sans']">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="relative overflow-hidden py-14 border-b border-border bg-primary/5">
        {/* Background Grid Replacement */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <p className="font-['Barlow_Condensed'] font-bold tracking-[0.3em] uppercase text-[0.7rem] text-primary mb-4 flex items-center gap-2">
            <a
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Beranda
            </a>
            <span className="text-muted-foreground italic">/</span>
            Cari Lapangan
          </p>

          <h1 className="font-['Barlow_Condensed'] font-black uppercase italic leading-none mb-3 text-foreground text-[clamp(3rem,6vw,5rem)]">
            Cari <span className="text-primary">Lapangan</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Temukan lapangan futsal terbaik dan booking slot waktu favoritmu.
          </p>

          {!loading && !error && (
            <div className="flex flex-wrap gap-3 mt-7">
              {[
                { label: "Total Lapangan", value: fields.length },
                { label: "Tersedia Hari Ini", value: availableCount },
                { label: "Total Slot Aktif", value: totalSlots },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
                >
                  <span className="font-['Barlow_Condensed'] font-black italic text-xl leading-none text-primary">
                    {s.value}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="sticky top-[80px] z-40 border-b border-border py-4 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="7" cy="7" r="5" />
                  <path d="m11 11 3 3" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                placeholder="Cari nama atau deskripsi lapangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full text-muted-foreground"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              className="sm:w-48 w-full bg-card border border-border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value="default">Urutan Default</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Termahal</option>
              <option value="slots-desc">Slot: Terbanyak</option>
            </select>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setFilter(chip.value)}
                className={`whitespace-nowrap px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all
                  ${
                    filter === chip.value
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {!loading && !error && (
          <p className="text-xs mb-6 font-medium text-muted-foreground uppercase tracking-widest">
            Menampilkan{" "}
            <span className="text-foreground font-bold">{filtered.length}</span>{" "}
            dari {fields.length} lapangan
          </p>
        )}

        {error && (
          <div className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-2xl border border-destructive/20 bg-destructive/5 mb-8">
            <span className="text-3xl">⚠️</span>
            <p className="flex-1 font-semibold text-sm text-destructive">
              {error}
            </p>
            <button
              className="font-['Barlow_Condensed'] font-black italic text-xs uppercase tracking-widest px-6 py-3 rounded-xl bg-destructive text-white hover:opacity-90 active:scale-95 transition-all"
              onClick={fetchFields}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Glow Divider */}
        {!loading && !error && (
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 mb-10 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <FieldCardSkeleton key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((field, i) => (
              <FieldCard key={field.id} field={field} delay={`${i * 0.1}s`} />
            ))
          ) : (
            <EmptyState query={debouncedSearch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldsPage;
