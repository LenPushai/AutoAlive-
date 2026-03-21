"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  var [form, setForm] = useState({ name: "", phone: "", email: "", msg: "" });
  var [sent, setSent] = useState(false);
  var [sending, setSending] = useState(false);

  function updateForm(key, val) {
    var u = Object.assign({}, form);
    u[key] = val;
    setForm(u);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      var sb = createClient();
      await sb.from("leads").insert({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        notes: form.msg || "General enquiry from contact page",
        source: "website",
        status: "new",
      });
      setSent(true);
    } catch (er) {
      console.error(er);
      alert("Something went wrong. Please try WhatsApp or phone instead.");
    } finally {
      setSending(false);
    }
  }

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
          <a href="/about">About</a>
          <a href="/contact" className="nav-cta">Get In Touch</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <div style={S.heroTag}>Get In Touch</div>
          <h1 style={S.heroH1}>We Would Love to Hear From You</h1>
          <p style={S.heroSub}>
            Whether you are ready to buy, have a question, or just want to browse — reach out. We are here to help.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={S.mainGrid}>

            {/* LEFT: Contact Details */}
            <div>
              <div style={S.sectionTag}>Contact Details</div>
              <h2 style={S.sectionH2}>Visit Our Dealership</h2>

              <div style={S.detailsGrid}>
                {/* Address */}
                <div style={S.detailCard}>
                  <div style={S.detailIcon}>{"\uD83D\uDCCD"}</div>
                  <div>
                    <h3 style={S.detailTitle}>Address</h3>
                    <p style={S.detailText}>17 Vaal Drive<br />Sylviaville<br />Vanderbijlpark, 1911</p>
                  </div>
                </div>

                {/* Phone */}
                <div style={S.detailCard}>
                  <div style={S.detailIcon}>{"\uD83D\uDCDE"}</div>
                  <div>
                    <h3 style={S.detailTitle}>Phone</h3>
                    <p style={S.detailText}>
                      <a href="tel:0161234567" style={S.detailLink}>016 123 4567</a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div style={S.detailCard}>
                  <div style={S.detailIcon}>{"\uD83D\uDCAC"}</div>
                  <div>
                    <h3 style={S.detailTitle}>WhatsApp</h3>
                    <p style={S.detailText}>
                      <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer" style={S.detailLink}>
                        Chat with us now
                      </a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div style={S.detailCard}>
                  <div style={S.detailIcon}>{"\uD83D\uDD52"}</div>
                  <div>
                    <h3 style={S.detailTitle}>Business Hours</h3>
                    <p style={S.detailText}>
                      Mon - Fri: 08:00 - 17:00<br />
                      Sat: 08:00 - 13:00<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div style={S.mapWrap}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.1!2d27.83!3d-26.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQyJzM2LjAiUyAyN8KwNDknNDguMCJF!5e0!3m2!1sen!2sza!4v1"
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: 14 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Auto Alive Location"
                />
              </div>
            </div>

            {/* RIGHT: Enquiry Form */}
            <div>
              <div style={S.formCard}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>{"\u2705"}</div>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "0.5rem", fontSize: "1.3rem" }}>
                      Message Sent!
                    </h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                      Thank you for reaching out. We will get back to you as soon as possible.
                    </p>
                    <a
                      href="https://wa.me/27000000000"
                      className="whatsapp-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-block", padding: "0.8rem 1.5rem" }}
                    >
                      {"\uD83D\uDCAC"} WhatsApp for Faster Response
                    </a>
                  </div>
                ) : (
                  <>
                    <h3 style={S.formTitle}>Send Us a Message</h3>
                    <p style={S.formSub}>
                      Fill in the form below and we will get back to you within 24 hours. For faster response, WhatsApp us directly.
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div style={S.ff}>
                        <label style={S.fLabel}>Full Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={function (e) { updateForm("name", e.target.value); }}
                          placeholder="e.g. Thabo Molefe"
                          style={S.fInput}
                        />
                      </div>
                      <div style={S.ff}>
                        <label style={S.fLabel}>Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={function (e) { updateForm("phone", e.target.value); }}
                          placeholder="e.g. 082 123 4567"
                          style={S.fInput}
                        />
                      </div>
                      <div style={S.ff}>
                        <label style={S.fLabel}>Email Address</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={function (e) { updateForm("email", e.target.value); }}
                          placeholder="Optional"
                          style={S.fInput}
                        />
                      </div>
                      <div style={S.ff}>
                        <label style={S.fLabel}>Your Message *</label>
                        <textarea
                          rows={5}
                          required
                          value={form.msg}
                          onChange={function (e) { updateForm("msg", e.target.value); }}
                          placeholder="Tell us what you are looking for, or ask us anything..."
                          style={Object.assign({}, S.fInput, { resize: "vertical" })}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={sending}
                        style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem" }}
                      >
                        {sending ? "Sending..." : "Send Message \u2192"}
                      </button>
                    </form>
                    <div style={S.formDivider}>
                      <span style={S.formDividerText}>or reach us directly</span>
                    </div>
                    <div style={S.directRow}>
                      <a
                        href="https://wa.me/27000000000"
                        className="whatsapp-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: 1, textAlign: "center", padding: "0.8rem" }}
                      >
                        {"\uD83D\uDCAC"} WhatsApp
                      </a>
                      <a
                        href="tel:0161234567"
                        className="btn-secondary"
                        style={{ flex: 1, textAlign: "center", padding: "0.8rem", color: "var(--navy)" }}
                      >
                        {"\uD83D\uDCDE"} Call Now
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
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
  hero: { position: "relative", minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #0a1628, var(--navy), #1a365d)", overflow: "hidden", marginTop: "3.5rem" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(200,168,78,0.08) 0%, transparent 70%)" },
  heroContent: { position: "relative", zIndex: 2, textAlign: "center", padding: "3rem 2rem" },
  heroTag: { display: "inline-block", background: "rgba(200,168,78,0.15)", color: "var(--gold)", padding: "0.3rem 1rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem", border: "1px solid rgba(200,168,78,0.2)" },
  heroH1: { fontFamily: "var(--font-display)", fontSize: "2.3rem", fontWeight: 700, color: "#fff", marginBottom: "0.8rem", lineHeight: 1.1 },
  heroSub: { fontSize: "1rem", color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 },

  section: { padding: "3rem 0 4rem" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 2rem" },
  sectionTag: { fontSize: "0.72rem", fontWeight: 700, color: "var(--gold-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" },
  sectionH2: { fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--navy)", marginBottom: "1.5rem", lineHeight: 1.2 },

  mainGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" },

  detailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" },
  detailCard: { display: "flex", gap: "0.8rem", alignItems: "flex-start", background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #edf2f7" },
  detailIcon: { fontSize: "1.4rem", flexShrink: 0 },
  detailTitle: { fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.2rem" },
  detailText: { fontSize: "0.82rem", color: "var(--mid-text)", lineHeight: 1.5 },
  detailLink: { color: "var(--blue)", textDecoration: "none", fontWeight: 500 },

  mapWrap: { borderRadius: 14, overflow: "hidden", border: "1px solid #edf2f7" },

  formCard: { background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #edf2f7", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", position: "sticky", top: "5rem" },
  formTitle: { fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.3rem" },
  formSub: { fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "1.2rem" },
  ff: { marginBottom: "0.8rem" },
  fLabel: { display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--mid-text)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.03em" },
  fInput: { width: "100%", padding: "0.7rem 0.9rem", borderRadius: 8, border: "1px solid #e2e8f0", fontFamily: "var(--font-body)", fontSize: "0.88rem", outline: "none", background: "var(--cream)", transition: "border-color 0.2s" },

  formDivider: { position: "relative", textAlign: "center", margin: "1.3rem 0", borderTop: "1px solid #edf2f7" },
  formDividerText: { position: "relative", top: "-0.6rem", background: "#fff", padding: "0 0.8rem", fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" },
  directRow: { display: "flex", gap: 10 },
};
