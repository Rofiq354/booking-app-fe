import { Link } from "react-router-dom";

interface FieldCardProps {
  id: number;
  name: string;
  description: string | null;
  image: string | null; // sudah full URL (Cloudinary)
  price: number; // dalam rupiah, misal 100000
  delay?: string;
}

// Format harga: 150000 → "Rp 150K"
const formatPrice = (price: number): string => {
  if (price >= 1_000_000)
    return `Rp ${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}Jt`;
  if (price >= 1_000) return `Rp ${Math.round(price / 1_000)}K`;
  return `Rp ${price}`;
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
  description,
  image,
  price,
  delay = "0s",
}: FieldCardProps) => {
  // image sudah berupa full URL dari Cloudinary
  const imageUrl = image ?? null;

  return (
    <Link to={id.toString()}
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
        <div className="mb-3">
          <h3
            className="lp-display font-black uppercase italic text-lg leading-none mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {name}
          </h3>
          {description && (
            <p
              className="text-xs leading-relaxed line-clamp-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span
              className="lp-display font-black italic text-xl"
              style={{ color: "var(--primary)" }}
            >
              {formatPrice(price)}
            </span>
            <span
              className="text-xs ml-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              /jam
            </span>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 group-hover:scale-105"
            style={{
              background: "color-mix(in srgb, var(--primary), transparent 88%)",
              color: "var(--primary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--primary)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--primary-foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "color-mix(in srgb, var(--primary), transparent 88%)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--primary)";
            }}
          >
            Pesan →
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FieldCard;
