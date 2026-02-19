import { Link } from "react-router-dom";

const NAV_LINKS = ["Beranda", "Cari Lapangan", "Jadwal Saya", "Promo"];
const HELP_LINKS = [
  "Hubungi Kami",
  "Syarat & Ketentuan",
  "Kebijakan Privasi",
  "FAQ",
];

const FooterSection = () => {
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
            <Link to="/" className="flex items-center gap-3 mb-5 w-fit">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), hsl(162 90% 35%))",
                }}
              >
                <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <span
                className="lp-display font-black text-2xl italic uppercase"
                style={{ color: "var(--foreground)" }}
              >
                Futsal
                <span style={{ color: "var(--primary)" }}>Hub</span>
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Solusi digital terbaik untuk booking lapangan futsal di Indonesia.
              Real-time, cepat, dan terpercaya.
            </p>

            {/* Social chips */}
            <div className="flex gap-3 mt-6">
              {["IG", "TW", "TK", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="lp-display font-black italic text-xs px-3 py-2 rounded-xl border transition-all duration-200"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--primary)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--border)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--muted-foreground)";
                  }}
                >
                  {s}
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
