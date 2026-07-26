import Link from "next/link";

/* Placeholders in [ … ] are for Auto Alive to complete (US-AA-043). */
const S = {
  page: { background: "var(--cream)", minHeight: "100vh" },
  wrap: { maxWidth: 760, margin: "0 auto", padding: "7rem 1.5rem 3rem" },
  title: { fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--navy)", margin: "0 0 0.3rem" },
  updated: { fontSize: "0.8rem", color: "var(--muted)", margin: "0 0 2rem" },
  h2: { fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", margin: "1.8rem 0 0.5rem" },
  p: { fontSize: "0.92rem", color: "var(--mid-text)", lineHeight: 1.7, margin: "0 0 0.6rem" },
  a: { color: "var(--gold)", fontWeight: 600 },
};

export default function PrivacyPage() {
  return (
    <div style={S.page}>
      {/* NAV */}
      <nav className="nav scrolled">
        <Link href="/" className="nav-brand">
          <span className="nav-brand-auto">AUTO</span>
          <span className="nav-brand-alive">ALIVE</span>
        </Link>
        <div className="nav-links">
          <Link href="/#inventory">Inventory</Link>
          <Link href="/about">About</Link>
          <Link href="/contact" className="nav-cta">Get In Touch</Link>
        </div>
      </nav>

      <div style={S.wrap}>
        <h1 style={S.title}>Privacy Notice</h1>
        <p style={S.updated}>Last updated: [DATE]</p>

        <p style={S.p}>
          Auto Alive (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal
          information in line with the Protection of Personal Information Act, 2013 (POPIA).
        </p>

        <h2 style={S.h2}>Who processes your information</h2>
        <p style={S.p}>
          Auto Alive [registered name], [company registration number], of [physical address],
          Vanderbijlpark. Information Officer: [name], [email], [phone].
        </p>

        <h2 style={S.h2}>What we collect</h2>
        <p style={S.p}>
          When you submit an enquiry we collect your name, phone number, email address (if provided),
          and your message, together with the vehicle you enquired about.
        </p>

        <h2 style={S.h2}>Why we collect it</h2>
        <p style={S.p}>
          Solely to respond to your enquiry and assist you with the vehicle. We rely on <strong>your
          consent</strong>, given when you submit the form.
        </p>

        <h2 style={S.h2}>Sharing</h2>
        <p style={S.p}>
          We do not sell your information. We share it only with [our finance partners, where you ask
          us to arrange finance / no third parties] and as required by law.
        </p>

        <h2 style={S.h2}>Retention</h2>
        <p style={S.p}>
          We keep enquiry details for [retention period, e.g. 24 months] after our last contact, then
          delete them.
        </p>

        <h2 style={S.h2}>Your rights</h2>
        <p style={S.p}>
          You may request access to, correction of, or deletion of your personal information, or
          withdraw consent, at any time by emailing [privacy email]. We will respond within a
          reasonable period.
        </p>

        <h2 style={S.h2}>Complaints</h2>
        <p style={S.p}>
          You may complain to the Information Regulator (South Africa):{" "}
          <a style={S.a} href="mailto:inforeg@justice.gov.za">inforeg@justice.gov.za</a>,{" "}
          <a style={S.a} href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer">inforegulator.org.za</a>.
        </p>

        <h2 style={S.h2}>Cookies</h2>
        <p style={S.p}>This website does not use tracking or advertising cookies.</p>

        <p style={{ ...S.p, marginTop: "2rem" }}>
          <Link href="/inventory" style={S.a}>← Back to inventory</Link>
        </p>
      </div>

      {/* FOOTER */}
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
            <ul><li><a href="/#inventory">All Vehicles</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="/privacy">Privacy Notice</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{"©"} 2026 Auto Alive. All rights reserved.</span>
          <span>Powered by <a href="https://pushai.co.za" target="_blank" rel="noopener noreferrer">PUSH AI Foundation</a></span>
        </div>
      </footer>
    </div>
  );
}
