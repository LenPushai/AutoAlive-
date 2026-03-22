export const dynamic = "force-dynamic"

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const REVIEWS = [
  { initials: "PM", name: "Peter Mee", text: "Paul has given me excellent service from the beginning to the end. Good after sales service as well. Highly recommend him." },
  { initials: "GR", name: "Graham Ruiters", text: "We travelled overnight from Kokstad in KZN. Our salesman Paul was kind enough to pick us up at Park Station. The vehicle was exactly as advertised ? no surprises at all." },
  { initials: "MN", name: "Milano Naidoo", text: "Two weeks later the car had a mechanical breakdown. One phone call to Paul and they PAID for the full mechanical fix. Who does that these days?!" },
];

const WHY_US = [
  { icon: "\ud83d\udee1", title: "Quality Guaranteed", desc: "Every vehicle undergoes a comprehensive multi-point inspection before it hits our floor. No surprises, no hidden issues." },
  { icon: "\ud83d\udcb0", title: "Transparent Pricing", desc: "What you see is what you pay. No hidden fees, no last-minute additions. Straightforward deals you can trust." },
  { icon: "\ud83e\udd1d", title: "Personal Service", desc: "From airport pickups to after-hours viewings ? Paul and the team go above and beyond for every customer." },
  { icon: "\ud83d\udccb", title: "Finance Assistance", desc: "We work with all major banks to find you the best rate. Bad credit? We'll still try our best to get you approved." },
];

function formatZAR(n) {
  return "R " + Number(n).toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

function calcMonthly(price, deposit = 0, termMonths = 72, ratePercent = 13.75) {
  const principal = price - deposit;
  if (principal <= 0) return 0;
  const r = ratePercent / 100 / 12;
  return Math.round(principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1));
}

function getBodyEmoji(bodyType) {
  const map = { 'Double Cab': '\ud83d\udefb', 'Single Cab': '\ud83d\udefb', 'Motorcycle': '\ud83c\udfcd', 'Hatchback': '\ud83d\ude99', 'SUV': '\ud83d\ude99', 'Crossover': '\ud83d\ude99', 'Sedan': '\ud83d\ude97' };
  return map[bodyType] || '\ud83d\ude97';
}

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [price, setPrice] = useState(300000);
  const [deposit, setDeposit] = useState(30000);
  const [term, setTerm] = useState(72);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false });
        if (data) setVehicles(data);
        if (error) console.error("Supabase error:", error);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const monthly = calcMonthly(price, deposit, term);

  const filtered = vehicles.filter((v) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Cars") return ["Hatchback", "Sedan", "SUV", "Crossover"].includes(v.body_type);
    if (activeFilter === "Bakkies") return ["Double Cab", "Single Cab"].includes(v.body_type);
    if (activeFilter === "Motorcycles") return v.body_type === "Motorcycle";
    if (activeFilter === "Under R200K") return v.price < 200000;
    return true;
  });

  const makes = [...new Set(vehicles.map(v => v.make))].sort();

  return (
    <>
      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="nav-brand">
          <span className="nav-brand-auto">AUTO</span>
          <span className="nav-brand-alive">ALIVE</span>
        </Link>
        <div className="nav-links">
          <a href="#inventory">Inventory</a>
          <a href="#finance">Finance</a>
          <a href="#reviews">Reviews</a>
          <a href="#about">About</a>
          <a href="#contact" className="nav-cta">Get In Touch</a>
        </div>
        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-grid-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              <span>Now Open ? Vanderbijlpark</span>
            </div>
            <h1 className="hero-title">Find Your<br /><em>Perfect</em> Ride</h1>
            <p className="hero-subtitle">
              Premium pre-owned vehicles backed by 15 years of trusted service.
              Quality cars, bakkies, and motorcycles ? all under one roof in the heart of the Vaal.
            </p>
            <div className="hero-actions">
              <a href="#inventory" className="btn-primary">Browse Inventory ?</a>
              <a href="#finance" className="btn-secondary">Calculate Finance</a>
            </div>
            <div className="hero-stats">
              <div><div className="hero-stat-number">15+</div><div className="hero-stat-label">Years Experience</div></div>
              <div><div className="hero-stat-number">32</div><div className="hero-stat-label">Google Reviews</div></div>
              <div><div className="hero-stat-number">4.8?</div><div className="hero-stat-label">Average Rating</div></div>
            </div>
          </div>
          <div className="hero-search">
            <div className="search-card">
              <div className="search-card-title">Search Vehicles</div>
              <div className="search-card-sub">Find the perfect match from our current stock</div>
              <div className="search-field">
                <label>Vehicle Type</label>
                <select><option>All Types</option><option>Cars</option><option>Bakkies</option><option>Motorcycles</option></select>
              </div>
              <div className="search-row">
                <div className="search-field">
                  <label>Make</label>
                  <select><option>Any Make</option>{makes.map(m => <option key={m}>{m}</option>)}</select>
                </div>
                <div className="search-field">
                  <label>Model</label>
                  <select><option>Any Model</option></select>
                </div>
              </div>
              <div className="search-row">
                <div className="search-field">
                  <label>Min Price</label>
                  <select><option>No Min</option><option>R 100,000</option><option>R 200,000</option><option>R 300,000</option></select>
                </div>
                <div className="search-field">
                  <label>Max Price</label>
                  <select><option>No Max</option><option>R 300,000</option><option>R 500,000</option><option>R 700,000</option></select>
                </div>
              </div>
              <button className="search-btn">Search {vehicles.length} Vehicles ?</button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="featured" id="inventory">
        <div className="section-header">
          <div>
            <div className="section-overline">Our Selection</div>
            <h2 className="section-title">Featured Vehicles</h2>
          </div>
          <a href="/inventory" className="section-link">View All Stock ?</a>
        </div>
        <div className="filter-tabs">
          {["All", "Cars", "Bakkies", "Motorcycles", "Under R200K"].map((f) => (
            <button key={f} className={`filter-tab ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="vehicles-grid">
          {loading ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--muted)" }}>Loading vehicles...</div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--muted)" }}>No vehicles found in this category.</div>
          ) : (
            filtered.map((v) => (
              <Link href={`/inventory/${v.id}`} key={v.id} className="vehicle-card" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="vehicle-img">
                  {v.thumbnail ? (
                    <Image src={v.thumbnail} alt={`${v.year} ${v.make} ${v.model}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
                  ) : (
                    <div className="vehicle-img-placeholder">{getBodyEmoji(v.body_type)}</div>
                  )}
                  {v.is_featured && <div className="vehicle-badge">Featured</div>}
                  <div className="vehicle-photos-count">?? {v.images?.length || 1}</div>
                </div>
                <div className="vehicle-info">
                  <div className="vehicle-year">{v.year}</div>
                  <div className="vehicle-name">{v.make} {v.model} {v.variant || ""}</div>
                  <div className="vehicle-specs">
                    <span className="vehicle-spec">? {Number(v.mileage).toLocaleString()} km</span>
                    <span className="vehicle-spec">? {v.transmission === "automatic" ? "Automatic" : "Manual"}</span>
                    <span className="vehicle-spec">? {v.fuel_type.charAt(0).toUpperCase() + v.fuel_type.slice(1)}</span>
                  </div>
                  <div className="vehicle-footer">
                    <div className="vehicle-price">{formatZAR(v.price)}<span>or {formatZAR(calcMonthly(v.price))}/pm</span></div>
                    <button className="vehicle-enquire">Enquire</button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* FINANCE */}
      <section className="finance" id="finance">
        <div className="finance-glow" />
        <div className="finance-inner">
          <div className="finance-text">
            <div className="section-overline">Affordability</div>
            <h2 className="section-title">Calculate Your<br />Monthly Payment</h2>
            <p className="finance-desc">Know exactly what you&apos;ll pay before you visit. Our instant finance calculator gives you real estimates based on current interest rates, so you can shop with confidence.</p>
            <div className="finance-features">
              <div className="finance-feature"><div className="finance-feature-icon">?</div><span>Instant estimates ? no personal info required</span></div>
              <div className="finance-feature"><div className="finance-feature-icon">?</div><span>Based on current prime lending rates</span></div>
              <div className="finance-feature"><div className="finance-feature-icon">?</div><span>Includes balloon payment options</span></div>
              <div className="finance-feature"><div className="finance-feature-icon">?</div><span>Apply for pre-approval via WhatsApp</span></div>
            </div>
          </div>
          <div className="calc-card">
            <div className="calc-title">Finance Estimator</div>
            <div className="range-container">
              <div className="range-header"><span className="range-label">Vehicle Price</span><span className="range-value">{formatZAR(price)}</span></div>
              <input type="range" min={50000} max={800000} step={10000} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div className="range-container">
              <div className="range-header"><span className="range-label">Deposit</span><span className="range-value">{formatZAR(deposit)}</span></div>
              <input type="range" min={0} max={300000} step={5000} value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} />
            </div>
            <div className="range-container">
              <div className="range-header"><span className="range-label">Term</span><span className="range-value">{term} months</span></div>
              <input type="range" min={12} max={84} step={12} value={term} onChange={(e) => setTerm(Number(e.target.value))} />
            </div>
            <div className="calc-result">
              <div className="calc-result-label">Estimated Monthly Payment</div>
              <div className="calc-result-amount">{formatZAR(monthly)}</div>
              <div className="calc-result-note">*Based on prime + 2% interest rate. Subject to credit approval.</div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="trust" id="reviews">
        <div className="section-header">
          <div className="section-overline">Testimonials</div>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="google-rating">
          <span className="google-stars">?????</span>
          <span className="google-text"><strong>4.8 out of 5</strong> ? 32 Google Reviews</span>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-quote">&ldquo;</div>
              <p className="review-text">{r.text}</p>
              <div className="review-author">
                <div className="review-avatar">{r.initials}</div>
                <div><div className="review-name">{r.name}</div><div className="review-stars">?????</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="why" id="about">
        <div className="why-inner">
          <div className="section-header">
            <div>
              <div className="section-overline">The Auto Alive Difference</div>
              <h2 className="section-title">Why Customers Choose Us</h2>
            </div>
          </div>
          <div className="why-grid">
            {WHY_US.map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="contact">
        <div className="cta-pattern" />
        <div className="cta-inner">
          <Image src="/images/logo/auto-alive-logo.jpg" alt="Auto Alive" width={200} height={75} style={{ objectFit: "contain", margin: "0 auto 1.5rem" }} />
          <div className="section-overline">Ready to Drive Away?</div>
          <h2 className="section-title">Your Next Vehicle<br />Is Waiting</h2>
          <p className="cta-desc">Whether you know exactly what you want or need help deciding, our team is ready to assist. Reach out on WhatsApp for the fastest response.</p>
          <div className="cta-buttons">
            <a href="https://wa.me/27000000000" className="whatsapp-btn">?? WhatsApp Us Now</a>
            <a href="tel:0161234567" className="btn-secondary">?? Call Us: 016 123 4567</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Image src="/images/logo/auto-alive-logo.jpg" alt="Auto Alive" width={140} height={52} style={{ objectFit: "contain" }} />
            <p className="footer-desc">Vanderbijlpark&apos;s premier destination for quality pre-owned vehicles since 2010. Trusted by hundreds of happy customers across South Africa.</p>
            <div className="footer-social"><a href="#">f</a><a href="#">in</a><a href="#">?</a></div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul><li><a href="/inventory">All Vehicles</a></li><li><a href="#">Cars</a></li><li><a href="#">Bakkies</a></li><li><a href="#">Motorcycles</a></li><li><a href="#finance">Finance</a></li></ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul><li><a href="#about">About Us</a></li><li><a href="#">Our Team</a></li><li><a href="#reviews">Reviews</a></li><li><a href="#contact">Contact</a></li></ul>
          </div>
          <div>
            <h4>Visit Us</h4>
            <ul><li><a href="#">17 Vaal Drive</a></li><li><a href="#">Sylviaville</a></li><li><a href="#">Vanderbijlpark, 1911</a></li><li><a href="#" style={{ color: "var(--gold)" }}>Get Directions ?</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>? 2026 Auto Alive. All rights reserved.</span>
          <span>Powered by{" "}<a href="https://pushai.co.za" target="_blank" rel="noopener noreferrer">PUSH AI Foundation</a></span>
        </div>
      </footer>

      <a href="https://wa.me/27000000000" className="whatsapp-float" target="_blank" rel="noopener noreferrer">??</a>
    </>
  );
}

