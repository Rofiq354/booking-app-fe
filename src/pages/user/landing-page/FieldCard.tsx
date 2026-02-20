import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/format";

interface FieldCardProps {
  id: number;
  name: string;
  description: string | null;
  image: string | null; // sudah full URL (Cloudinary)
  price: number; // dalam rupiah, misal 100000
  delay?: string;
}

const getSimulatedRating = (id: string) => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (hash % 11) / 10 + 4; // Menghasilkan angka antara 4.0 - 5.0
  const reviews = (hash % 80) + 10; // Menghasilkan 10 - 90 ulasan
  return { rating: rating.toFixed(1), reviews };
};

const FutsalCourtIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <rect
      x="6"
      y="6"
      width="60"
      height="60"
      rx="4"
      stroke="var(--primary)"
      strokeWidth="1.8"
      strokeDasharray="5 3"
    />
    <line
      x1="36"
      y1="6"
      x2="36"
      y2="66"
      stroke="var(--primary)"
      strokeWidth="1.2"
    />
    <circle cx="36" cy="36" r="11" stroke="var(--primary)" strokeWidth="1.4" />
    <circle cx="36" cy="36" r="2.5" fill="var(--primary)" />
    <line
      x1="6"
      y1="36"
      x2="18"
      y2="36"
      stroke="var(--primary)"
      strokeWidth="1.4"
    />
    <line
      x1="54"
      y1="36"
      x2="66"
      y2="36"
      stroke="var(--primary)"
      strokeWidth="1.4"
    />
    {/* Goal boxes */}
    <rect
      x="6"
      y="26"
      width="10"
      height="20"
      rx="2"
      stroke="var(--primary)"
      strokeWidth="1.2"
    />
    <rect
      x="56"
      y="26"
      width="10"
      height="20"
      rx="2"
      stroke="var(--primary)"
      strokeWidth="1.2"
    />
  </svg>
);

const FieldCard = ({
  id,
  name,
  image,
  price,
  delay = "0s",
}: FieldCardProps) => {
  // image sudah berupa full URL dari Cloudinary
  const imageUrl = image ?? null;
  const { rating, reviews } = getSimulatedRating(id.toString() || name);

  return (
    <Link
      to={`fields/${id}`}
      className="lp-hover-lift group relative overflow-hidden rounded-2xl border cursor-pointer lp-slide-up"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        animationDelay: delay,
      }}
    >
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary), transparent 90%) 0%, transparent 60%)",
        }}
      />

      {/* Court preview / Image */}
      <div
        className="h-44 relative overflow-hidden flex items-center justify-center"
        style={{
          background: "color-mix(in srgb, var(--muted), var(--card) 50%)",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            {/* Fallback grid + icon */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-300">
              <FutsalCourtIcon />
            </div>
          </>
        )}
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="mb-4">
          {/* Judul: Balikin ke 2xl biar gagah */}
          <h3 className="font-['Barlow_Condensed'] text-2xl font-black italic uppercase leading-none text-foreground transition-colors group-hover:text-primary mb-2">
            {name}
          </h3>

          {/* Rating Section: Dibuat Bold & Besar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    // Ukuran icon w-4 (16px) biar jelas
                    i < Math.floor(Number(rating))
                      ? "text-warning fill-warning"
                      : "text-muted fill-muted"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Angka Rating: Pake Barlow biar Bold nya mantap */}
            <span className="font-['Barlow_Condensed'] text-lg font-black italic text-foreground leading-none">
              {rating}
            </span>

            <span className="text-muted-foreground text-xs font-bold uppercase tracking-tighter">
              ({reviews} Ulasan)
            </span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Harga Mulai
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-['Barlow_Condensed'] text-2xl font-black italic leading-none text-primary">
                {formatPrice(price)}
              </span>
              <span className="text-xs text-muted-foreground italic">/jam</span>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-[-45deg]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FieldCard;
