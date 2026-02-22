import { Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_LINKS = ["Beranda", "Cari Lapangan", "Jadwal Saya", "Promo"];
const HELP_LINKS = [
  "Hubungi Kami",
  "Syarat & Ketentuan",
  "Kebijakan Privasi",
  "FAQ",
];

const FooterSection = () => {
  const SOCIALS = [
    {
      icon: <Instagram size={16} />,
      href: "https://ig.com/futsalhub",
    },
    {
      icon: <Twitter size={16} />,
      href: "https://twitter.com/futsalhub",
    },
    {
      icon: <Youtube size={16} />,
      href: "https://youtube.com/futsalhub",
    },
  ];
  return (
    <footer
      className="border-t pt-16 pb-8"
      style={{
        background: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top row */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 w-fit group">
              {/* Kotak Logo dengan Gradient Tailwind */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br from-primary to-emerald-600 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <img
                  src="/brand.svg"
                  alt="Logo"
                  className="w-6 h-6 object-contain brightness-0 invert"
                />
              </div>

              {/* Teks Brand */}
              <span className="lp-display font-black text-2xl italic uppercase tracking-tighter text-foreground">
                Futsal<span className="text-primary">Hub</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs text-muted-foreground">
              Solusi digital terbaik untuk booking lapangan futsal di Indonesia.
            </p>

            {/* Social chips */}
            <div className="flex gap-3 mt-6">
              {SOCIALS.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center justify-center w-10 h-10 rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5 hover:-translate-y-1 shadow-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h5
              className="lp-display font-black uppercase italic tracking-wide mb-5"
              style={{ color: "var(--foreground)" }}
            >
              Navigasi
            </h5>
            <ul className="space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--muted-foreground)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--muted-foreground)")
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h5
              className="lp-display font-black uppercase italic tracking-wide mb-5"
              style={{ color: "var(--foreground)" }}
            >
              Bantuan
            </h5>
            <ul className="space-y-3">
              {HELP_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--muted-foreground)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--muted-foreground)")
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Glow divider */}
        <div className="lp-glow-line mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-sm"
            style={{ color: "var(--muted-foreground)", opacity: 0.7 }}
          >
            © 2026 FutsalHub. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="text-sm"
              style={{ color: "var(--muted-foreground)", opacity: 0.7 }}
            >
              Made with
            </span>
            <span style={{ color: "var(--primary)" }}>⚽</span>
            <span
              className="text-sm"
              style={{ color: "var(--muted-foreground)", opacity: 0.7 }}
            >
              for futsal lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
