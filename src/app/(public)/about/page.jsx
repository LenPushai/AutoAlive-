"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav className="nav scrolled">
        <Link href="/" className="nav-brand">
          <span className="nav-brand-auto">AUTO</span>
          <span className="nav-brand-alive">ALIVE</span>
        </Link>
        <div className="nav-links">
          <a href="/#inventory">Inventory</a>
          <a href="/#finance">Finance</a>
          <a href="/#reviews">Reviews</a>
          <a href="/contact" className="nav-cta">Get In Touch</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <div style={S.heroTag}>Est. 2010</div>
          <h1 style={S.heroH1}>The Auto Alive Story</h1>
          <p style={S.heroSub}>
            More than a dealership — a commitment to putting Vaal Triangle families behind the wheel of quality vehicles they can trust.
          </p>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={S.storyGrid}>
            <div>
              <div style={S.sectionTag}>Who We Are</div>
              <h2 style={S.sectionH2}>Built on Trust, Driven by Passion</h2>
              <p style={S.bodyText}>
                Founded in 2010, Auto Alive started with a simple mission: to change how people in the Vaal Triangle experience buying a car. No pressure, no hidden surprises — just honest deals and vehicles you can rely on.
              </p>
              <p style={S.bodyText}>
                Over the years we have grown from a small yard to one of Vanderbijlpark&apos;s most trusted dealerships, with over 85 vehicles in stock and customers travelling from across South Africa to buy from us. Our Google reviews speak for themselves — real people sharing real experiences.
              </p>
              <p style={S.bodyText}>
                What sets us apart is simple: we treat every customer like family. When you walk through our doors, you are not just a transaction. We take the time to understand what you need, find the right vehicle, and support you long after you drive away.
              </p>
            </div>
            <div style={S.statsCard}>
              <div style={S.stat}>
                <div style={S.statNum}>15+</div>
                <div style={S.statLabel}>Years in Business</div>
              </div>
              <div style={S.statDivider} />
              <div style={S.stat}>
                <div style={S.statNum}>85+</div>
                <div style={S.statLabel}>Vehicles in Stock</div>
              </div>
              <div style={S.statDivider} />
              <div style={S.stat}>
                <div style={S.statNum}>32</div>
                <div style={S.statLabel}>Google Reviews</div>
              </div>
              <div style={S.statDivider} />
              <div style={S.stat}>
                <div style={S.statNum}>100%</div>
                <div style={S.statLabel}>Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={Object.assign({}, S.section, { background: "var(--light-bg)" })}>
        <div style={S.container}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={S.sectionTag}>Our Promise</div>
            <h2 style={S.sectionH2}>The Auto Alive Difference</h2>
          </div>
          <div style={S.valuesGrid}>
            {[
              { icon: "\uD83E\uDD1D", title: "Honest Deals", desc: "Transparent pricing with no hidden fees. What you see is what you pay. We believe trust is earned, not assumed." },
              { icon: "\uD83D\uDD0D", title: "Quality Inspected", desc: "Every vehicle undergoes thorough inspection before it reaches our lot. We stand behind every car we sell." },
              { icon: "\uD83D\uDCAC", title: "Open Communication", desc: "From your first enquiry to long after the sale, we keep you informed every step of the way. No ghosting, no runaround." },
              { icon: "\u2764\uFE0F", title: "After-Sales Care", desc: "Our relationship does not end when you drive off. We are here for you — whether it is a question, service recommendation, or just a check-in." },
              { icon: "\uD83D\uDE97", title: "Wide Selection", desc: "Cars, bakkies, motorcycles, and more. From R60K to R650K, there is something for every budget and lifestyle." },
              { icon: "\uD83C\uDFE0", title: "Family Welcome", desc: "We are not a corporate franchise. We are a family business that treats you like family. Come see the difference." },
            ].map(function (v, i) {
              return (
                <div key={i} style={S.valueCard}>
                  <div style={S.valueIcon}>{v.icon}</div>
                  <h3 style={S.valueTitle}>{v.title}</h3>
                  <p style={S.valueDesc}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CUSTOMER SPOTLIGHT ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={S.sectionTag}>What Customers Say</div>
            <h2 style={S.sectionH2}>Real Stories, Real People</h2>
          </div>
          <div style={S.reviewsGrid}>
            {[
              { name: "Graham R.", loc: "Kokstad, KZN", text: "We travelled overnight from KZN by bus. Paul picked us up at Park Station. The vehicle was exactly as advertised with no surprises. Would highly recommend anyone to use Auto Alive." },
              { name: "Milano N.", loc: "KwaZulu-Natal", text: "Paul is off-the-charts amazing. Picked up at the airport in a luxury BMW, welcomed like family. Two weeks later the car had a breakdown — they paid for the full mechanical fix. Who does that these days?" },
              { name: "Gershon N.", loc: "Local", text: "The level of service was top-notch. Open and transparent communication throughout. They kept me informed, answered all questions promptly. Thrilled with my VW Amarok!" },
            ].map(function (r, i) {
              return (
                <div key={i} style={S.reviewCard}>
                  <div style={S.reviewStars}>{"\u2B50\u2B50\u2B50\u2B50\u2B50"}</div>
                  <p style={S.reviewText}>&ldquo;{r.text}&rdquo;</p>
                  <div style={S.reviewAuthor}>
                    <strong style={{ color: "var(--navy)" }}>{r.name}</strong>
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{r.loc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={S.ctaSection}>
        <div style={S.ctaInner}>
          <h2 style={S.ctaH2}>Ready to Find Your Next Vehicle?</h2>
          <p style={S.ctaText}>Browse our full inventory or get in touch — we are here to help.</p>
          <div style={S.ctaBtns}>
            <Link href="/#inventory" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
              Browse Inventory
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ padding: "1rem 2rem", fontSize: "1rem", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.3rem", color: "var(--gold)" }}>AUTO</span>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 300, fontSize: "1.3rem", color: "var(--navy)" }}>ALIVE</span>
            </div>
            <p className="footer-desc">Vanderbijlpark&apos;s premier destination for quality pre-owned vehicles since 2010.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul><li><a href="/#inventory">All Vehicles</a></li><li><a href="/#finance">Finance</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul>
          </div>
          <div>
            <h4>Visit Us</h4>
            <ul><li><a href="#">17 Vaal Drive, Sylviaville</a></li><li><a href="#">Vanderbijlpark, 1911</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{"\u00A9"} 2026 Auto Alive. All rights reserved.</span>
          <span>Powered by <a href="https://pushai.co.za" target="_blank" rel="noopener noreferrer">PUSH AI Foundation</a></span>
        </div>
      </footer>

      <a href="https://wa.me/27000000000" className="whatsapp-float" target="_blank" rel="noopener noreferrer">{"\uD83D\uDCAC"}</a>
    </div>
  );
}

/* ════════════════════════════════════════════════ */
var S = {
  hero: { position: "relative", minHeight: 340, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #0a1628, var(--navy), #1a365d)", overflow: "hidden", marginTop: "3.5rem" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(200,168,78,0.08) 0%, transparent 70%)" },
  heroContent: { position: "relative", zIndex: 2, textAlign: "center", padding: "3rem 2rem" },
  heroTag: { display: "inline-block", background: "rgba(200,168,78,0.15)", color: "var(--gold)", padding: "0.3rem 1rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem", border: "1px solid rgba(200,168,78,0.2)" },
  heroH1: { fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.8rem", lineHeight: 1.1 },
  heroSub: { fontSize: "1.05rem", color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 },

  section: { padding: "4rem 0" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 2rem" },
  sectionTag: { fontSize: "0.72rem", fontWeight: 700, color: "var(--gold-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" },
  sectionH2: { fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "1rem", lineHeight: 1.2 },
  bodyText: { color: "var(--mid-text)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1rem" },

  storyGrid: { display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "3rem", alignItems: "center" },
  statsCard: { background: "linear-gradient(145deg, #0f1f38, var(--navy))", borderRadius: 16, padding: "2rem", color: "#fff" },
  stat: { textAlign: "center", padding: "1rem 0" },
  statNum: { fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 700, color: "var(--gold)" },
  statLabel: { fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" },
  statDivider: { height: 1, background: "rgba(255,255,255,0.08)", margin: "0 1rem" },

  valuesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" },
  valueCard: { background: "#fff", borderRadius: 14, padding: "1.5rem", border: "1px solid #edf2f7", transition: "transform 0.2s, box-shadow 0.2s" },
  valueIcon: { fontSize: "1.8rem", marginBottom: "0.8rem" },
  valueTitle: { fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.4rem" },
  valueDesc: { fontSize: "0.85rem", color: "var(--mid-text)", lineHeight: 1.6 },

  reviewsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" },
  reviewCard: { background: "#fff", borderRadius: 14, padding: "1.5rem", border: "1px solid #edf2f7" },
  reviewStars: { fontSize: "0.9rem", marginBottom: "0.6rem" },
  reviewText: { fontSize: "0.88rem", color: "var(--mid-text)", lineHeight: 1.7, fontStyle: "italic", marginBottom: "1rem" },
  reviewAuthor: { display: "flex", flexDirection: "column", gap: 2 },

  ctaSection: { background: "linear-gradient(145deg, #0a1628, var(--navy))", padding: "4rem 0" },
  ctaInner: { maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "0 2rem" },
  ctaH2: { fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.6rem" },
  ctaText: { color: "rgba(255,255,255,0.55)", fontSize: "1rem", marginBottom: "1.5rem" },
  ctaBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
};
