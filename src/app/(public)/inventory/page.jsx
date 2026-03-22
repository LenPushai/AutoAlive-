"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/* ── HELPERS ── */
function formatZAR(n) {
  return "R " + Number(n).toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

function calcMonthly(price, deposit, term, rate) {
  var p = price - (deposit || 0);
  if (p <= 0) return 0;
  var r = (rate || 13.75) / 100 / 12;
  return Math.round(p * (r * Math.pow(1 + r, term || 72)) / (Math.pow(1 + r, term || 72) - 1));
}

/* ── CATEGORY TABS ── */
var CATEGORIES = [
  { label: "All Vehicles", value: "all", icon: "\uD83D\uDE97" },
  { label: "Cars", value: "cars", types: ["Hatchback", "Sedan"], icon: "\uD83D\uDE98" },
  { label: "Bakkies", value: "bakkies", types: ["Double Cab", "Single Cab"], icon: "\uD83D\uDE9A" },
  { label: "SUVs", value: "suvs", types: ["SUV", "Crossover"], icon: "\uD83D\uDE99" },
  { label: "Motorcycles", value: "motorcycles", types: ["Motorcycle"], icon: "\uD83C\uDFCD\uFE0F" },
];

var SORT_OPTIONS = [
  { label: "Newest Listed", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Year: Newest First", value: "year_desc" },
  { label: "Mileage: Lowest First", value: "mileage_asc" },
];

var PRICE_RANGES = [
  { label: "Any Price", value: "all" },
  { label: "Under R200,000", value: "under200k" },
  { label: "R200K - R400K", value: "200k-400k" },
  { label: "R400K - R600K", value: "400k-600k" },
  { label: "Over R600,000", value: "over600k" },
];

/* ── STYLES ── */
var S = {
  page: {
    background: "var(--cream, #fdfcfb)",
    minHeight: "100vh",
  },
  hero: {
    background: "linear-gradient(135deg, #0f1f38 0%, #1a365d 60%, #234681 100%)",
    padding: "6.5rem 1.5rem 2.5rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 30% 80%, rgba(200,168,78,0.08) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  heroTitle: {
    fontFamily: "var(--font-display, 'Playfair Display', serif)",
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    position: "relative",
    zIndex: 1,
  },
  heroGold: {
    color: "var(--gold, #c8a84e)",
    fontStyle: "italic",
  },
  heroSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.95rem",
    marginTop: "0.4rem",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    position: "relative",
    zIndex: 1,
  },
  searchWrap: {
    maxWidth: 540,
    margin: "1.2rem auto 0",
    position: "relative",
    zIndex: 1,
  },
  searchInput: {
    width: "100%",
    padding: "0.8rem 1rem 0.8rem 2.6rem",
    borderRadius: 50,
    border: "2px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    outline: "none",
    backdropFilter: "blur(8px)",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1rem",
    opacity: 0.45,
    pointerEvents: "none",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 1.5rem",
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.8rem",
    padding: "1.2rem 0 0.8rem",
    borderBottom: "1px solid #edf2f7",
    marginBottom: "1rem",
  },
  categoryTabs: {
    display: "flex",
    gap: "0.35rem",
    flexWrap: "wrap",
  },
  catTab: {
    padding: "0.45rem 1rem",
    borderRadius: 50,
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    fontSize: "0.78rem",
    fontWeight: 500,
    color: "var(--mid-text, #4a5568)",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
  },
  catTabActive: {
    background: "var(--navy, #1a365d)",
    color: "#fff",
    borderColor: "var(--navy, #1a365d)",
  },
  sortWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sortLabel: {
    fontSize: "0.75rem",
    color: "var(--muted, #718096)",
    fontWeight: 500,
  },
  select: {
    padding: "0.4rem 0.7rem",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: "0.78rem",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    color: "var(--navy, #1a365d)",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
    minWidth: 120,
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    padding: "0.8rem 0",
    alignItems: "center",
  },
  clearBtn: {
    padding: "0.4rem 0.9rem",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "var(--gold, #c8a84e)",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
  },
  resultCount: {
    fontSize: "0.8rem",
    color: "var(--muted, #718096)",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    padding: "0 0 0.6rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
    gap: "1.3rem",
    paddingBottom: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #edf2f7",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    position: "relative",
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  cardHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 10px 35px rgba(0,0,0,0.07)",
  },
  cardImgWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/10",
    background: "linear-gradient(135deg, #f7fafc, #edf2f7)",
    overflow: "hidden",
  },
  cardBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "var(--gold, #c8a84e)",
    color: "#fff",
    fontSize: "0.6rem",
    fontWeight: 700,
    padding: "2px 9px",
    borderRadius: 50,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    zIndex: 2,
  },
  photoBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 600,
    padding: "2px 7px",
    borderRadius: 5,
    zIndex: 2,
  },
  cardBody: {
    padding: "0.85rem 1rem",
  },
  cardYear: {
    fontSize: "0.65rem",
    color: "var(--blue, #2c5282)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardTitle: {
    fontFamily: "var(--font-display, 'Playfair Display', serif)",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--navy, #1a365d)",
    margin: "0.15rem 0 0.4rem",
    lineHeight: 1.25,
  },
  cardVariant: {
    fontWeight: 400,
    fontSize: "0.8rem",
    color: "var(--muted, #718096)",
    display: "block",
  },
  cardSpecs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.3rem",
    marginBottom: "0.7rem",
  },
  specChip: {
    fontSize: "0.65rem",
    color: "var(--mid-text, #4a5568)",
    background: "#f7fafc",
    padding: "2px 7px",
    borderRadius: 5,
    border: "1px solid #edf2f7",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTop: "1px solid #f7fafc",
    paddingTop: "0.7rem",
  },
  cardPrice: {
    fontFamily: "var(--font-display, 'Playfair Display', serif)",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "var(--gold-dark, #b8941e)",
    lineHeight: 1,
  },
  cardMonthly: {
    fontSize: "0.65rem",
    color: "var(--muted, #718096)",
    marginTop: 2,
  },
  cardCTA: {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "var(--blue, #2c5282)",
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    color: "var(--muted, #718096)",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "0.8rem",
    opacity: 0.35,
  },
  loadWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    flexDirection: "column",
    gap: "1rem",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #edf2f7",
    borderTop: "3px solid var(--gold, #c8a84e)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  whatsappFloat: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#25D366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
    zIndex: 50,
    fontSize: "1.5rem",
    textDecoration: "none",
    transition: "transform 0.2s",
  },
};

/* ── VEHICLE CARD ── */
function VehicleCard(props) {
  var v = props.vehicle;
  var hovered = props.hovered;
  var onEnter = props.onEnter;
  var onLeave = props.onLeave;

  var monthly = calcMonthly(v.price, 0, 72, 13.75);
  var photoCount = 1;
  if (v.images && Array.isArray(v.images)) {
    photoCount = v.images.length;
  }

  var specs = [];
  if (v.mileage) specs.push(Number(v.mileage).toLocaleString() + " km");
  if (v.transmission) specs.push(v.transmission === "automatic" ? "Auto" : "Manual");
  if (v.fuel_type) specs.push(v.fuel_type.charAt(0).toUpperCase() + v.fuel_type.slice(1));
  if (v.body_type) specs.push(v.body_type);
  if (v.colour) specs.push(v.colour);

  var cardStyle = Object.assign({}, S.card);
  if (hovered) {
    cardStyle = Object.assign({}, S.card, S.cardHover);
  }

  return (
    <Link
      href={"/inventory/" + v.id}
      style={cardStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Image */}
      <div style={S.cardImgWrap}>
        {v.is_featured && <div style={S.cardBadge}>Featured</div>}
        {photoCount > 1 && (
          <div style={S.photoBadge}>{"\uD83D\uDCF7 " + photoCount}</div>
        )}
        {v.thumbnail ? (
          <Image
            src={v.thumbnail}
            alt={v.year + " " + v.make + " " + v.model}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "2.5rem", opacity: 0.25 }}>
            {"\uD83D\uDE97"}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={S.cardBody}>
        <div style={S.cardYear}>{v.year}</div>
        <h3 style={S.cardTitle}>
          {v.make + " " + v.model}
          {v.variant ? <span style={S.cardVariant}>{v.variant}</span> : null}
        </h3>

        <div style={S.cardSpecs}>
          {specs.map(function (s, i) {
            return <span key={i} style={S.specChip}>{s}</span>;
          })}
        </div>

        <div style={S.cardFooter}>
          <div>
            <div style={S.cardPrice}>{formatZAR(v.price)}</div>
            <div style={S.cardMonthly}>{"From " + formatZAR(monthly) + "/pm"}</div>
          </div>
          <span style={S.cardCTA}>
            {"View Details \u2192"}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── MAIN PAGE ── */
export default function InventoryPage() {
  var [vehicles, setVehicles] = useState([]);
  var [loading, setLoading] = useState(true);
  var [category, setCategory] = useState("all");
  var [sortBy, setSortBy] = useState("newest");
  var [makeFilter, setMakeFilter] = useState("all");
  var [transFilter, setTransFilter] = useState("all");
  var [fuelFilter, setFuelFilter] = useState("all");
  var [priceRange, setPriceRange] = useState("all");
  var [searchTerm, setSearchTerm] = useState("");
  var [hoveredId, setHoveredId] = useState(null);

  /* ── Fetch from Supabase ── */
  useEffect(function () {
    async function loadVehicles() {
      try {
        var sb = createClient();
        var result = await sb
          .from("vehicles")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false });

        if (result.data) {
          setVehicles(result.data);
        }
        if (result.error) {
          console.error("Supabase error:", result.error);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  /* ── Derived: unique makes ── */
  var uniqueMakes = useMemo(function () {
    var makes = {};
    vehicles.forEach(function (v) {
      if (v.make) makes[v.make] = true;
    });
    return Object.keys(makes).sort();
  }, [vehicles]);

  /* ── Filter + Sort ── */
  var filtered = useMemo(function () {
    var result = vehicles.slice();

    /* Category */
    if (category !== "all") {
      var catDef = CATEGORIES.find(function (c) { return c.value === category; });
      if (catDef && catDef.types) {
        result = result.filter(function (v) {
          return catDef.types.indexOf(v.body_type) > -1;
        });
      }
    }

    /* Make */
    if (makeFilter !== "all") {
      result = result.filter(function (v) { return v.make === makeFilter; });
    }

    /* Transmission */
    if (transFilter !== "all") {
      result = result.filter(function (v) { return v.transmission === transFilter; });
    }

    /* Fuel */
    if (fuelFilter !== "all") {
      result = result.filter(function (v) { return v.fuel_type === fuelFilter; });
    }

    /* Price range */
    if (priceRange !== "all") {
      var ranges = {
        "under200k": [0, 200000],
        "200k-400k": [200000, 400000],
        "400k-600k": [400000, 600000],
        "over600k": [600000, 99999999],
      };
      var range = ranges[priceRange];
      if (range) {
        result = result.filter(function (v) {
          return v.price >= range[0] && v.price < range[1];
        });
      }
    }

    /* Search */
    if (searchTerm.trim()) {
      var term = searchTerm.toLowerCase();
      result = result.filter(function (v) {
        var haystack = [v.make, v.model, v.variant || "", v.body_type || "", v.colour || ""].join(" ").toLowerCase();
        return haystack.indexOf(term) > -1;
      });
    }

    /* Sort */
    result.sort(function (a, b) {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "year_desc") return b.year - a.year;
      if (sortBy === "mileage_asc") return (a.mileage || 0) - (b.mileage || 0);
      return 0;
    });

    return result;
  }, [vehicles, category, makeFilter, transFilter, fuelFilter, priceRange, searchTerm, sortBy]);

  /* ── Active filter count ── */
  var activeFilterCount = 0;
  if (makeFilter !== "all") activeFilterCount++;
  if (transFilter !== "all") activeFilterCount++;
  if (fuelFilter !== "all") activeFilterCount++;
  if (priceRange !== "all") activeFilterCount++;
  if (searchTerm.trim()) activeFilterCount++;

  function clearFilters() {
    setCategory("all");
    setMakeFilter("all");
    setTransFilter("all");
    setFuelFilter("all");
    setPriceRange("all");
    setSearchTerm("");
    setSortBy("newest");
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={S.page}>
        <nav className="nav scrolled">
          <Link href="/" className="nav-brand">
            <span className="nav-brand-auto">AUTO</span>
            <span className="nav-brand-alive">ALIVE</span>
          </Link>
        </nav>
        <div style={S.loadWrap}>
          <div style={S.spinner}></div>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Loading inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* ── NAV ── */}
      <nav className="nav scrolled">
        <Link href="/" className="nav-brand">
          <span className="nav-brand-auto">AUTO</span>
          <span className="nav-brand-alive">ALIVE</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/inventory" style={{ color: "var(--gold)" }}>Inventory</Link>
          <Link href="/about">About</Link>
          <Link href="/contact" className="nav-cta">Get In Touch</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={S.hero}>
        <div style={S.heroOverlay}></div>
        <h1 style={S.heroTitle}>
          Browse Our <span style={S.heroGold}>Inventory</span>
        </h1>
        <p style={S.heroSub}>
          {vehicles.length + " quality pre-owned vehicles available in the Vaal Triangle"}
        </p>
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>{"\uD83D\uDD0D"}</span>
          <input
            type="text"
            value={searchTerm}
            onChange={function (e) { setSearchTerm(e.target.value); }}
            placeholder="Search by make, model, or type..."
            style={S.searchInput}
          />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={S.container}>
        {/* Toolbar: Categories + Sort */}
        <div style={S.toolbar}>
          <div style={S.categoryTabs}>
            {CATEGORIES.map(function (cat) {
              var isActive = category === cat.value;
              var style = Object.assign({}, S.catTab);
              if (isActive) {
                style = Object.assign({}, S.catTab, S.catTabActive);
              }
              return (
                <button
                  key={cat.value}
                  onClick={function () { setCategory(cat.value); }}
                  style={style}
                >
                  {cat.icon + " " + cat.label}
                </button>
              );
            })}
          </div>

          <div style={S.sortWrap}>
            <span style={S.sortLabel}>Sort by:</span>
            <select
              value={sortBy}
              onChange={function (e) { setSortBy(e.target.value); }}
              style={S.select}
            >
              {SORT_OPTIONS.map(function (opt) {
                return <option key={opt.value} value={opt.value}>{opt.label}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Filters */}
        <div style={S.filterBar}>
          <select
            value={makeFilter}
            onChange={function (e) { setMakeFilter(e.target.value); }}
            style={S.select}
          >
            <option value="all">All Makes</option>
            {uniqueMakes.map(function (make) {
              return <option key={make} value={make}>{make}</option>;
            })}
          </select>

          <select
            value={priceRange}
            onChange={function (e) { setPriceRange(e.target.value); }}
            style={S.select}
          >
            {PRICE_RANGES.map(function (pr) {
              return <option key={pr.value} value={pr.value}>{pr.label}</option>;
            })}
          </select>

          <select
            value={transFilter}
            onChange={function (e) { setTransFilter(e.target.value); }}
            style={S.select}
          >
            <option value="all">Any Transmission</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>

          <select
            value={fuelFilter}
            onChange={function (e) { setFuelFilter(e.target.value); }}
            style={S.select}
          >
            <option value="all">Any Fuel</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} style={S.clearBtn}>
              {"\u2715 Clear (" + activeFilterCount + ")"}
            </button>
          )}
        </div>

        {/* Result Count */}
        <div style={S.resultCount}>
          {filtered.length === vehicles.length
            ? "Showing all " + vehicles.length + " vehicles"
            : "Showing " + filtered.length + " of " + vehicles.length + " vehicles"
          }
        </div>

        {/* ── VEHICLE GRID ── */}
        {filtered.length > 0 ? (
          <div style={S.grid}>
            {filtered.map(function (v) {
              return (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  hovered={hoveredId === v.id}
                  onEnter={function () { setHoveredId(v.id); }}
                  onLeave={function () { setHoveredId(null); }}
                />
              );
            })}
          </div>
        ) : (
          <div style={S.empty}>
            <div style={S.emptyIcon}>{"\uD83D\uDD0D"}</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "0.4rem" }}>
              No vehicles match your filters
            </h3>
            <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
              Try adjusting your search or clearing filters to see more results.
            </p>
            <button onClick={clearFilters} style={{
              padding: "0.65rem 1.4rem",
              borderRadius: 50,
              border: "none",
              background: "var(--navy)",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Clear All Filters
            </button>
          </div>
        )}

        {/* ── CAN'T FIND CTA ── */}
        <div style={{
          textAlign: "center",
          padding: "2rem 0 2.5rem",
          borderTop: "1px solid #edf2f7",
          marginTop: "0.5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            color: "var(--navy)",
            marginBottom: "0.4rem",
          }}>
            {"Can\u2019t find what you\u2019re looking for?"}
          </p>
          <p style={{
            color: "var(--muted)",
            fontSize: "0.85rem",
            marginBottom: "0.8rem",
          }}>
            Tell us what you need and we will source it for you.
          </p>
          <a
            href="https://wa.me/27000000000?text=Hi%2C%20I%27m%20looking%20for%20a%20specific%20vehicle.%20Can%20you%20help%3F"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0.7rem 1.8rem",
              borderRadius: 50,
              background: "#25D366",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {"\uD83D\uDCAC WhatsApp Us"}
          </a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer" style={{ marginTop: 0 }}>
        <div className="footer-brand">
          Auto <span className="footer-gold">Alive</span>
          <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "rgba(255,255,255,0.25)", marginLeft: 8 }}>
            {"\u00D7 PUSH AI Foundation"}
          </span>
        </div>
        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", margin: "0.3rem 0 0" }}>
          17 Vaal Drive, Sylviaville, Vanderbijlpark 1911
        </p>
      </footer>

      {/* ── WHATSAPP FLOAT ── */}
      <a
        href="https://wa.me/27000000000"
        target="_blank"
        rel="noopener noreferrer"
        style={S.whatsappFloat}
      >
        {"\uD83D\uDCAC"}
      </a>
    </div>
  );
}
