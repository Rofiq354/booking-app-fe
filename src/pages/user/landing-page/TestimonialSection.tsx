const TESTIMONIALS = [
  {
    name: "Arif Santoso",
    role: "Kapten Tim Garuda FC",
    avatar: "A",
    avatarBg: "var(--primary)",
    text: "Dulu harus telepon dulu, sekarang langsung booking dari HP. Prosesnya cepat banget, slot langsung terkunci dan tidak bisa di-booking orang lain.",
  },
  {
    name: "Rizky Maulana",
    role: "Pengguna Rutin",
    avatar: "R",
    avatarBg: "hsl(162 70% 38%)",
    text: "Lapangannya bersih semua, harga transparan tanpa biaya tersembunyi. Langsung jadi aplikasi wajib setiap akhir pekan bareng teman-teman!",
  },
  {
    name: "Dewi Anggraini",
    role: "Manajer Turnamen",
    avatar: "D",
    avatarBg: "hsl(199 89% 48%)",
    text: "Untuk booking multiple slot turnamen, sangat membantu banget. Konfirmasi instan, tidak ada kebingungan jadwal, dan admin responsif.",
  },
];

const StarRow = () => (
  <div className="flex gap-1 mb-5">
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} style={{ color: "hsl(38 92% 50%)" }}>
          ★
        </span>
      ))}
  </div>
);

const TestimonialSection = () => {
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
          {TESTIMONIALS.map((testi, i) => (
            <div
              key={i}
              className="lp-hover-lift p-8 rounded-2xl border flex flex-col justify-between"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <StarRow />
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  "{testi.text}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white shrink-0"
                  style={{ background: testi.avatarBg }}
                >
                  {testi.avatar}
                </div>
                <div>
                  <p
                    className="lp-display font-black text-sm uppercase italic leading-none mb-0.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    {testi.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {testi.role}
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
