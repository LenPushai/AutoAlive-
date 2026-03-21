"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/* ── helpers ── */
function formatZAR(n) {
  return "R " + Number(n).toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

function calcMonthly(price, dep, term, rate) {
  var p = price - (dep || 0);
  if (p <= 0) return 0;
  var r = (rate || 13.75) / 100 / 12;
  var t = term || 72;
  return Math.round(p * (r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1));
}

/* ── main component ── */
export default function VehicleDetailPage() {
  var params = useParams();
  var id = params.id;

  var [v, setV] = useState(null);
  var [loading, setLoading] = useState(true);
  var [activeImg, setActiveImg] = useState(0);
  var [lightbox, setLightbox] = useState(false);
  var [showForm, setShowForm] = useState(false);
  var [form, setForm] = useState({ name: "", phone: "", email: "", msg: "" });
  var [sent, setSent] = useState(false);
  var [dep, setDep] = useState(0);
  var [term, setTerm] = useState(72);

  /* ── fetch vehicle ── */
  useEffect(function () {
    function go() {
      var sb = createClient();
      sb.from("vehicles").select("*").eq("id", id).single().then(function (r) {
        if (r.data) {
          setV(r.data);
          setDep(Math.round(r.data.price * 0.1));
        }
        if (r.error) console.error(r.error);
        setLoading(false);
      });
    }
    if (id) go();
  }, [id]);

  /* ── keyboard nav for lightbox ── */
  useEffect(function () {
    if (!lightbox) return;
    function handleKey(e) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    return function () { window.removeEventListener("keydown", handleKey); };
  });

  /* ── image helpers ── */
  function getImages() {
    if (!v) return [];
    var imgs = [];
    if (v.thumbnail) imgs.push(v.thumbnail);
    if (v.images && Array.isArray(v.images)) {
      v.images.forEach(function (img) {
        if (img !== v.thumbnail) imgs.push(img);
      });
    }
    return imgs;
  }

  function goPrev() {
    setActiveImg(function (a) {
      var len = getImages().length;
      return a > 0 ? a - 1 : len - 1;
    });
  }

  function goNext() {
    setActiveImg(function (a) {
      var len = getImages().length;
      return a < len - 1 ? a + 1 : 0;
    });
  }

  /* ── enquiry submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    const sb = createClient();
    const payload = {
      dealer_id: v.dealer_id,
      vehicle_id: v.id,
      first_name: (form.name || '').split(' ')[0],
      last_name: (form.name || '').split(' ').slice(1).join(' ') || null,
      phone: form.phone,
      email: form.email || null,
      notes: form.msg || null,
      source: "website",
      status: "new",
    };
    console.log('=== LEAD INSERT PAYLOAD ===', payload);
    const { data, error } = await sb
      .from('leads')
      .insert(payload)
      .select()
      .single();
    console.log('=== FULL RESPONSE ===', { data, error });
    if (error) {
      console.error('SUPABASE INSERT ERROR:', { code: error.code, message: error.message, details: error.details, hint: error.hint });
      alert('Error ' + error.code + ': ' + error.message);
    } else {
      console.log('Inserted successfully:', data);
      setSent(true);
    }
  }

  function updateForm(key, val) {
    var u = Object.assign({}, form);
    u[key] = val;
    setForm(u);
  }

  /* ── loading ── */
  if (loading) {
    return (
      <div style={S.centerScreen}>
        <div style={{ textAlign: "center" }}>
          <div style={S.spinner} />
          <p style={{ color: "#999", marginTop: "1rem" }}>Loading vehicle...</p>
        </div>
      </div>
    );
  }

  /* ── 404 ── */
  if (!v) {
    return (
      <div style={S.centerScreen}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--navy)", marginBottom: "0.5rem" }}>Vehicle Not Found</h2>
          <p style={{ color: "#999", marginBottom: "1.5rem" }}>This vehicle may have been sold or removed.</p>
          <Link href="/#inventory" className="btn-primary">Browse Inventory</Link>
        </div>
      </div>
    );
  }

  /* ── derived data ── */
  var title = (v.year + " " + v.make + " " + v.model + " " + (v.variant || "")).trim();
  var images = getImages();
  var currentImg = images[activeImg] || images[0] || "";
  var photoCount = images.length;

  var wa = "https://wa.me/27000000000?text=" +
    encodeURIComponent("Hi, I\u2019m interested in the " + title + " (" + formatZAR(v.price) + ") on Auto Alive.");

  var specs = [
    { l: "Year", v: String(v.year) },
    { l: "Make", v: v.make },
    { l: "Model", v: v.model },
    { l: "Variant", v: v.variant || "\u2014" },
    { l: "Body Type", v: v.body_type || "\u2014" },
    { l: "Mileage", v: Number(v.mileage).toLocaleString() + " km" },
    { l: "Transmission", v: v.transmission === "automatic" ? "Automatic" : "Manual" },
    { l: "Fuel Type", v: (v.fuel_type || "").charAt(0).toUpperCase() + (v.fuel_type || "").slice(1) },
    { l: "Colour", v: v.colour ? v.colour.charAt(0).toUpperCase() + v.colour.slice(1) : "\u2014" },
    { l: "Condition", v: v.condition ? v.condition.charAt(0).toUpperCase() + v.condition.slice(1) : "\u2014" },
  ];

  /* ════════════════════════════════════ */
  /*              RENDER                  */
  /* ════════════════════════════════════ */
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
          <a href="/#contact" className="nav-cta">Get In Touch</a>
        </div>
      </nav>

      {/* ── BREADCRUMB ── */}
      <div style={S.breadcrumb}>
        <Link href="/" style={S.bcLink}>Home</Link>
        <span style={S.bcSep}> / </span>
        <Link href="/#inventory" style={S.bcLink}>Inventory</Link>
        <span style={S.bcSep}> / </span>
        <span style={{ color: "var(--dark-text)", fontWeight: 500 }}>{v.make} {v.model}</span>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={S.container}>
        <div style={S.grid}>

          {/* ════ LEFT: GALLERY ════ */}
          <div style={{ width: "60%", minWidth: 0, maxWidth: "60%", overflow: "hidden", flexShrink: 0 }}>

            {/* Main Image */}
            <div
              style={S.galleryMain}
              onClick={function () { if (images.length > 0) setLightbox(true); }}
            >
              {images.length > 0 ? (
                <Image
                  src={currentImg}
                  alt={title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 900px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div style={S.noPhoto}>No Photos</div>
              )}

              {/* Featured Badge */}
              {v.is_featured && (
                <div style={S.badge}>Featured</div>
              )}

              {/* Prev Arrow */}
              {images.length > 1 && (
                <button
                  onClick={function (e) { e.stopPropagation(); goPrev(); }}
                  style={Object.assign({}, S.arrow, { left: 12 })}
                >{"\u2039"}</button>
              )}

              {/* Next Arrow */}
              {images.length > 1 && (
                <button
                  onClick={function (e) { e.stopPropagation(); goNext(); }}
                  style={Object.assign({}, S.arrow, { right: 12 })}
                >{"\u203A"}</button>
              )}

              {/* Photo Counter */}
              {photoCount > 0 && (
                <div style={S.counter}>
                  {activeImg + 1} / {photoCount}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div style={S.thumbStrip}>
                {images.map(function (img, i) {
                  var isActive = activeImg === i;
                  return (
                    <button
                      key={i}
                      onClick={function () { setActiveImg(i); }}
                      style={{
                        position: "relative",
                        width: 96,
                        height: 64,
                        borderRadius: 6,
                        overflow: "hidden",
                        border: isActive ? "2.5px solid var(--gold)" : "2.5px solid transparent",
                        cursor: "pointer",
                        padding: 0,
                        flexShrink: 0,
                        background: "#eee",
                        opacity: isActive ? 1 : 0.6,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Image
                        src={img}
                        alt={title + " photo " + (i + 1)}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="96px"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Photo Label */}
            {photoCount > 0 && (
              <div style={S.photoLabel}>
                Photo {activeImg + 1} of {photoCount}
              </div>
            )}
          </div>

          {/* ════ RIGHT: VEHICLE INFO ════ */}
          <div style={S.infoCol}>

            {/* Header */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={S.yearTag}>{v.year}</div>
              <h1 style={S.title}>{title}</h1>
              <div style={S.priceBlock}>
                {formatZAR(v.price)}
              </div>
              <div style={S.pricePm}>
                or from {formatZAR(calcMonthly(v.price, 0, 72, 13.75))}/pm
              </div>
            </div>

            {/* Quick Specs */}
            <div style={S.quickSpecs}>
              <div style={S.qsItem}>
                <div style={S.qsLabel}>Mileage</div>
                <div style={S.qsValue}>{Number(v.mileage).toLocaleString()} km</div>
              </div>
              <div style={S.qsItem}>
                <div style={S.qsLabel}>Transmission</div>
                <div style={S.qsValue}>{v.transmission === "automatic" ? "Automatic" : "Manual"}</div>
              </div>
              <div style={S.qsItem}>
                <div style={S.qsLabel}>Fuel</div>
                <div style={S.qsValue}>{(v.fuel_type || "").charAt(0).toUpperCase() + (v.fuel_type || "").slice(1)}</div>
              </div>
              <div style={S.qsItem}>
                <div style={S.qsLabel}>Colour</div>
                <div style={S.qsValue}>{v.colour ? v.colour.charAt(0).toUpperCase() + v.colour.slice(1) : "\u2014"}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={S.ctaStack}>
              <button
                className="btn-primary"
                onClick={function () { setShowForm(!showForm); }}
                style={{ width: "100%", textAlign: "center", padding: "0.9rem" }}
              >
                {showForm ? "Close Form" : "Enquire Now \u2192"}
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={wa}
                  className="whatsapp-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, textAlign: "center", padding: "0.8rem" }}
                >
                  WhatsApp
                </a>
                <a
                  href="tel:0161234567"
                  className="btn-secondary"
                  style={{ flex: 1, textAlign: "center", padding: "0.8rem", color: "var(--navy)", borderColor: "#e2e8f0" }}
                >
                  Call
                </a>
              </div>
            </div>

            {/* Enquiry Form */}
            {showForm && (
              <div style={S.formWrap}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "1.5rem" }}>
                    <h3 style={{ color: "var(--navy)", marginBottom: "0.3rem" }}>Enquiry Sent!</h3>
                    <p style={{ color: "#999", fontSize: "0.85rem" }}>We will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 style={S.formH3}>Enquire About This Vehicle</h3>
                    <div style={S.ff}>
                      <label style={S.fLabel}>Full Name *</label>
                      <input type="text" required value={form.name} onChange={function (e) { updateForm("name", e.target.value); }} placeholder="e.g. Thabo Molefe" style={S.fInput} />
                    </div>
                    <div style={S.ff}>
                      <label style={S.fLabel}>Phone Number *</label>
                      <input type="tel" required value={form.phone} onChange={function (e) { updateForm("phone", e.target.value); }} placeholder="e.g. 082 123 4567" style={S.fInput} />
                    </div>
                    <div style={S.ff}>
                      <label style={S.fLabel}>Email</label>
                      <input type="email" value={form.email} onChange={function (e) { updateForm("email", e.target.value); }} placeholder="Optional" style={S.fInput} />
                    </div>
                    <div style={S.ff}>
                      <label style={S.fLabel}>Message</label>
                      <textarea rows={3} value={form.msg} onChange={function (e) { updateForm("msg", e.target.value); }} placeholder="Any questions..." style={Object.assign({}, S.fInput, { resize: "vertical" })} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: "100%" }}>Send Enquiry</button>
                  </form>
                )}
              </div>
            )}

            {/* Finance Estimator */}
            <div style={S.finBlock}>
              <h3 style={S.finTitle}>Finance Estimator</h3>
              <div style={{ marginBottom: "1rem" }}>
                <div style={S.rangeHdr}>
                  <span>Deposit</span>
                  <span style={S.rangeVal}>{formatZAR(dep)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.round(v.price * 0.5)}
                  step={5000}
                  value={dep}
                  onChange={function (e) { setDep(Number(e.target.value)); }}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={S.rangeHdr}>
                  <span>Term</span>
                  <span style={S.rangeVal}>{term} months</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={84}
                  step={12}
                  value={term}
                  onChange={function (e) { setTerm(Number(e.target.value)); }}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={S.finResult}>
                <div style={S.finLabel}>Estimated Monthly</div>
                <div style={S.finAmt}>{formatZAR(calcMonthly(v.price, dep, term, 13.75))}</div>
                <div style={S.finNote}>*Prime + 2%. Subject to credit approval.</div>
              </div>
            </div>

            {/* Specifications Table */}
            <div style={S.specsWrap}>
              <h3 style={S.sectionH3}>Vehicle Specifications</h3>
              {specs.map(function (s, i) {
                return (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.6rem 0",
                    borderBottom: i < specs.length - 1 ? "1px solid #f0f4f8" : "none",
                    fontSize: "0.88rem",
                  }}>
                    <span style={{ color: "#999" }}>{s.l}</span>
                    <span style={{ fontWeight: 600, color: "var(--navy)" }}>{s.v}</span>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            {v.description && (
              <div style={S.descWrap}>
                <h3 style={S.sectionH3}>Description</h3>
                <p style={{ color: "#555", lineHeight: 1.7, fontSize: "0.9rem" }}>{v.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════ FULLSCREEN LIGHTBOX ════ */}
      {lightbox && images.length > 0 && (
        <div style={S.lbOverlay}>
          {/* Dark background — click to close */}
          <div
            style={S.lbBg}
            onClick={function () { setLightbox(false); }}
          />

          {/* Close button */}
          <button
            onClick={function () { setLightbox(false); }}
            style={S.lbClose}
          >{"\u2715"}</button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={function () { goPrev(); }}
              style={Object.assign({}, S.lbArrow, { left: 16 })}
            >{"\u2039"}</button>
          )}

          {/* The image — regular img for full resolution */}
          <img
            src={currentImg}
            alt={title}
            style={S.lbImg}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={function () { goNext(); }}
              style={Object.assign({}, S.lbArrow, { right: 16 })}
            >{"\u203A"}</button>
          )}

          {/* Caption */}
          <div style={S.lbCaption}>
            <div style={{ fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: 4 }}>{activeImg + 1} / {photoCount}</div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer" style={{ marginTop: "3rem" }}>
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
            <ul>
              <li><a href="/#inventory">All Vehicles</a></li>
              <li><a href="/#finance">Finance</a></li>
              <li><a href="/#reviews">Reviews</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Visit Us</h4>
            <ul>
              <li><a href="#">17 Vaal Drive, Sylviaville</a></li>
              <li><a href="#">Vanderbijlpark, 1911</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{"\u00A9"} 2026 Auto Alive. All rights reserved.</span>
          <span>Powered by <a href="https://pushai.co.za" target="_blank" rel="noopener noreferrer">PUSH AI Foundation</a></span>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a href="https://wa.me/27000000000" className="whatsapp-float" target="_blank" rel="noopener noreferrer">{"\uD83D\uDCAC"}</a>
    </div>
  );
}

/* ════════════════════════════════════════════ */
/*              STYLE CONSTANTS                */
/* ════════════════════════════════════════════ */
var S = {
  centerScreen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "5rem",
    background: "var(--cream)",
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "3px solid #edf2f7",
    borderTopColor: "var(--gold)",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto",
  },

  /* breadcrumb */
  breadcrumb: {
    maxWidth: 1440,
    margin: "0 auto",
    padding: "5rem 1.5rem 0.6rem",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.82rem",
    color: "#999",
  },
  bcLink: { color: "var(--blue)", textDecoration: "none" },
  bcSep: { color: "#cbd5e0" },

  /* layout */
  container: {
    maxWidth: 1440,
    margin: "0 auto",
    padding: "0 1.5rem 3rem",
  },
  grid: {
    display: "flex",
    gap: "2rem",
    alignItems: "flex-start",
  },

  /* gallery */
  galleryMain: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    maxHeight: "65vh",
    borderRadius: 12,
    overflow: "hidden",
    background: "#e8e8e8",
    cursor: "pointer",
  },
  noPhoto: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    fontSize: "1.2rem",
    color: "#999",
  },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    background: "var(--gold)",
    color: "#fff",
    padding: "0.3rem 0.8rem",
    borderRadius: 6,
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    zIndex: 5,
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.5)",
    color: "#fff",
    fontSize: "1.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    transition: "background 0.2s",
  },
  counter: {
    position: "absolute",
    bottom: 14,
    right: 14,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: "0.3rem 0.8rem",
    borderRadius: 20,
    fontSize: "0.75rem",
    fontWeight: 600,
    zIndex: 5,
  },
  thumbStrip: {
    display: "flex",
    gap: 8,
    marginTop: 12,
    overflowX: "auto",
    paddingBottom: 8,
  },
  photoLabel: {
    fontSize: "0.8rem",
    color: "#999",
    marginTop: 6,
    paddingLeft: 2,
  },

  /* info column */
  infoCol: {
    position: "sticky",
    top: "5.5rem",
    alignSelf: "start",
    minWidth: 0,
    flex: 1,
  },
  yearTag: {
    fontSize: "0.72rem",
    color: "var(--blue)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "0.2rem",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "var(--navy)",
    lineHeight: 1.15,
    marginBottom: "0.4rem",
  },
  priceBlock: {
    fontFamily: "var(--font-display)",
    fontSize: "2.1rem",
    fontWeight: 700,
    color: "var(--gold-dark)",
    lineHeight: 1.2,
  },
  pricePm: {
    fontSize: "0.8rem",
    color: "#999",
    marginBottom: "0.2rem",
  },

  /* quick specs */
  quickSpecs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.6rem",
    marginBottom: "1.2rem",
    padding: "0.8rem",
    background: "#f7f8fa",
    borderRadius: 10,
    border: "1px solid #edf2f7",
  },
  qsItem: {
    padding: "0.4rem",
  },
  qsLabel: {
    fontSize: "0.65rem",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: 2,
  },
  qsValue: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "var(--navy)",
  },

  /* cta */
  ctaStack: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: "1.2rem",
  },

  /* form */
  formWrap: {
    background: "#f7f8fa",
    borderRadius: 12,
    padding: "1.2rem",
    border: "1px solid #edf2f7",
    marginBottom: "1.2rem",
  },
  formH3: {
    fontFamily: "var(--font-display)",
    fontSize: "1rem",
    color: "var(--navy)",
    fontWeight: 600,
    marginBottom: "0.8rem",
  },
  ff: { marginBottom: "0.7rem" },
  fLabel: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#666",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  fInput: {
    width: "100%",
    padding: "0.65rem 0.9rem",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontFamily: "var(--font-body)",
    fontSize: "0.85rem",
    outline: "none",
    background: "#fff",
  },

  /* finance */
  finBlock: {
    background: "linear-gradient(145deg, #0f1f38, var(--navy))",
    borderRadius: 12,
    padding: "1.3rem",
    marginBottom: "1.2rem",
    color: "#fff",
  },
  finTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#fff",
  },
  rangeHdr: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.45)",
    marginBottom: 5,
  },
  rangeVal: {
    color: "var(--gold)",
    fontWeight: 600,
    fontSize: "0.85rem",
  },
  finResult: {
    textAlign: "center",
    paddingTop: "1rem",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  finLabel: {
    fontSize: "0.65rem",
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  finAmt: {
    fontFamily: "var(--font-display)",
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--gold)",
    margin: "0.2rem 0",
  },
  finNote: {
    fontSize: "0.6rem",
    color: "rgba(255,255,255,0.25)",
  },

  /* specs */
  specsWrap: {
    background: "#fff",
    borderRadius: 12,
    padding: "1.3rem",
    border: "1px solid #edf2f7",
    marginBottom: "1.2rem",
  },
  sectionH3: {
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "var(--navy)",
    marginBottom: "0.7rem",
  },
  descWrap: {
    background: "#fff",
    borderRadius: 12,
    padding: "1.3rem",
    border: "1px solid #edf2f7",
  },

  /* lightbox */
  lbOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  lbBg: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,1)",
    cursor: "zoom-out",
  },
  lbClose: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "1.3rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  lbArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "2rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  lbImg: {
    maxWidth: "95vw",
    maxHeight: "95vh",
    objectFit: "contain",
    borderRadius: 6,
    position: "relative",
    zIndex: 5,
  },
  lbCaption: {
    position: "absolute",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    textAlign: "center",
    zIndex: 10,
  },
};
