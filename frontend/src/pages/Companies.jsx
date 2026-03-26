import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api";
import CompanyCard from "../components/CompanyCard";

/* ── inject keyframes once ── */
if (!document.getElementById("co-styles")) {
  const s = document.createElement("style");
  s.id = "co-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    @keyframes co-fade-down {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes co-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes co-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes co-shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }
    @keyframes co-chip-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(0.92); }
      100% { transform: scale(1); }
    }
    @keyframes co-count-pop {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.18); }
      100% { transform: scale(1); }
    }
    @keyframes co-grid-in {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes co-label-in {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes co-search-focus {
      from { box-shadow: 0 0 0 0 rgba(27,58,107,0); }
      to   { box-shadow: 0 0 0 3px rgba(27,58,107,0.1); }
    }

    /* ── Responsive grid — mobile first ── */
    .co-card-grid,
    .co-skeleton-grid {
      display: grid !important;
      gap: 10px;
      grid-template-columns: 1fr;
      width: 100%;
      box-sizing: border-box;
    }

    /* ── Mobile responsive overrides ── */
    @media (max-width: 600px) {
      .co-header { padding: 20px 16px 0 !important; }
      .co-eyebrow { font-size: 8.5px !important; letter-spacing: 2px !important; }
      .co-title { font-size: 24px !important; letter-spacing: -0.4px !important; margin-bottom: 4px !important; }
      .co-meta { font-size: 12px !important; margin-bottom: 16px !important; }
      .co-toolbar { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; padding-bottom: 12px !important; padding-top: 12px !important; }
      .co-search-wrap { max-width: 100% !important; }
      .co-filter-row { overflow-x: auto !important; flex-wrap: nowrap !important; padding-bottom: 4px !important; -webkit-overflow-scrolling: touch !important; }
      .co-filter-row::-webkit-scrollbar { display: none; }
      .co-count-badge { margin-left: 0 !important; align-self: flex-start !important; }
      .co-body { padding: 12px 12px 48px !important; }
    }

    @media (min-width: 601px) and (max-width: 900px) {
      .co-header { padding: 24px 24px 0 !important; }
      .co-body { padding: 20px 24px 48px !important; }
      .co-card-grid,
      .co-skeleton-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
    }

    @media (min-width: 901px) and (max-width: 1200px) {
      .co-card-grid,
      .co-skeleton-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
    }

    @media (min-width: 1201px) {
      .co-card-grid,
      .co-skeleton-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 14px !important; }
    }
  `;
  document.head.appendChild(s);
}

const T = {
  ff:      "'Plus Jakarta Sans', sans-serif",
  bg:      "#F4F6F9",
  white:   "#FFFFFF",
  ink:     "#0D1C33",
  ink2:    "#4A5568",
  ink3:    "#7A8599",
  ink4:    "#B0BAC8",
  blue:    "#1B3A6B",
  blue2:   "#3B7DED",
  blueLt:  "#EBF2FD",
  border:  "#E2E4E9",
};

const FILTERS = ["All","Technology","IT Services","Consulting","Financial Services","Healthcare"];

function getSector(name = "") {
  const n = name.toLowerCase();
  if (["google","microsoft","amazon","apple","meta","netflix","nvidia","intel","samsung"].some(k=>n.includes(k))) return "Technology";
  if (["infosys","wipro","tcs","cognizant","hcl","accenture","capgemini"].some(k=>n.includes(k))) return "IT Services";
  if (["deloitte","consulting","stanley","mckinsey","pwc","kpmg"].some(k=>n.includes(k))) return "Consulting";
  if (["bank","finance","capital","razorpay","paytm","deutsche"].some(k=>n.includes(k))) return "Financial Services";
  if (["health","pharma","med","bio"].some(k=>n.includes(k))) return "Healthcare";
  return "Technology";
}

/* ── Skeleton card ── */
function Skeleton({ delay = 0 }) {
  return (
    <div style={{
      background: T.white,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      opacity: 0,
      animation: `co-fade-up 0.4s ease ${delay}s both`,
    }}>
      <div style={{
        width: 90, flexShrink: 0,
        background: "linear-gradient(90deg, #EAECF0 25%, #F4F6F9 50%, #EAECF0 75%)",
        backgroundSize: "200% 100%",
        animation: "co-shimmer 1.5s ease infinite",
      }} />
      <div style={{ flex: 1, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
          height: 14, width: "60%", borderRadius: 4,
          background: "linear-gradient(90deg, #EAECF0 25%, #F4F6F9 50%, #EAECF0 75%)",
          backgroundSize: "200% 100%",
          animation: "co-shimmer 1.5s 0.1s ease infinite",
        }} />
        <div style={{
          height: 12, width: "40%", borderRadius: 4,
          background: "linear-gradient(90deg, #EAECF0 25%, #F4F6F9 50%, #EAECF0 75%)",
          backgroundSize: "200% 100%",
          animation: "co-shimmer 1.5s 0.2s ease infinite",
        }} />
        <div style={{
          height: 30, width: "45%", borderRadius: 6, marginTop: 4,
          background: "linear-gradient(90deg, #EAECF0 25%, #F4F6F9 50%, #EAECF0 75%)",
          backgroundSize: "200% 100%",
          animation: "co-shimmer 1.5s 0.3s ease infinite",
        }} />
      </div>
    </div>
  );
}

/* ── Filter chip ── */
function FilterChip({ label, active, onClick }) {
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
    onClick();
  };

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
      style={{
        height: 34, padding: "0 13px", borderRadius: 5,
        fontFamily: T.ff,
        fontSize: 11.5, fontWeight: 500, letterSpacing: "0.2px",
        cursor: "pointer",
        border: `1px solid ${active ? T.blue : hover ? T.blue : T.border}`,
        background: active ? T.blue : hover ? T.blueLt : T.white,
        color: active ? "#fff" : hover ? T.blue : T.ink2,
        boxShadow: active
          ? "0 2px 8px rgba(27,58,107,0.2)"
          : hover ? "0 1px 4px rgba(27,58,107,0.08)" : "none",
        transform: clicked ? "scale(0.93)" : hover && !active ? "translateY(-1px)" : "scale(1)",
        transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

/* ── Search input ── */
function SearchInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="co-search-wrap" style={{ position: "relative", flex: 1, maxWidth: 320 }}>
      <span style={{
        position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
        color: focused ? T.blue : T.ink4, pointerEvents: "none",
        transition: "color 0.2s",
        display: "flex", alignItems: "center",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transition: "transform 0.3s", transform: focused ? "scale(1.1)" : "scale(1)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by company name…"
        style={{
          width: "100%", height: 40,
          padding: "0 13px 0 38px",
          background: focused ? T.white : "#F4F6F9",
          border: `1px solid ${focused ? T.blue : T.border}`,
          borderRadius: 7,
          fontFamily: T.ff,
          fontSize: 13, fontWeight: 400, color: T.ink,
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(27,58,107,0.08)" : "none",
          transition: "border-color 0.2s, background 0.2s, box-shadow 0.25s",
        }}
      />
    </div>
  );
}

/* ── Animated count badge ── */
function CountBadge({ count }) {
  const prevRef = useRef(count);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (prevRef.current !== count) {
      setAnim(true);
      setTimeout(() => setAnim(false), 350);
      prevRef.current = count;
    }
  }, [count]);

  return (
    <span className="co-count-badge" style={{
      marginLeft: "auto",
      fontSize: 11.5, fontWeight: 600, color: T.ink3,
      background: T.bg, border: `1px solid ${T.border}`,
      borderRadius: 5, padding: "4px 11px",
      whiteSpace: "nowrap", letterSpacing: "0.2px",
      fontFamily: T.ff,
      display: "inline-block",
      transform: anim ? "scale(1.15)" : "scale(1)",
      transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {count} result{count !== 1 ? "s" : ""}
    </span>
  );
}

/* ── Grid label ── */
function GridLabel({ label }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase",
      color: T.ink4, marginBottom: 16,
      display: "flex", alignItems: "center", gap: 10,
      fontFamily: T.ff,
      animation: "co-label-in 0.35s ease both",
    }}>
      {label}
      <span style={{ flex: 1, height: 1, background: T.border, display: "block" }} />
    </div>
  );
}

/* ── Animated grid ── */
function CardGrid({ companies, user, gridKey }) {
  return (
    <div className="co-card-grid">
      {companies.map((company, i) => (
        <div
          key={company._id}
          style={{
            opacity: 0,
            animation: `co-grid-in 0.4s ease ${Math.min(i * 0.06, 0.5)}s both`,
          }}
        >
          <CompanyCard company={company} user={user} />
        </div>
      ))}
    </div>
  );
}

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [gridKey, setGridKey]     = useState(0);

  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("search") || "";
    setSearch(q);
  }, [location.search]);

  useEffect(() => {
    API.get("/company")
      .then(res => setCompanies(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (f) => {
    setFilter(f);
    setGridKey(k => k + 1);
  };
  const handleSearch = (v) => {
    setSearch(v);
    setGridKey(k => k + 1);
  };

  const filtered = companies.filter(c => {
    const matchSearch = c.companyName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || getSector(c.companyName) === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Layout>
      <div style={{
        fontFamily: T.ff, minHeight: "100vh",
        background: T.bg, position: "relative",
        overflowX: "hidden",
        width: "100%",
      }}>

        {/* ── HEADER ── */}
        <div className="co-header" style={{
          position: "relative", zIndex: 1,
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          padding: "36px 48px 0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          animation: "co-fade-down 0.45s ease both",
        }}>
          {/* eyebrow */}
          <div className="co-eyebrow" style={{
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 9.5, fontWeight: 700, letterSpacing: "2.8px", textTransform: "uppercase",
            color: T.ink3, marginBottom: 10,
            animation: "co-fade-down 0.4s 0.05s ease both",
          }}>
            <span style={{ width: 24, height: 1, background: T.ink4, display: "block" }} />
            Campus Recruitment · 2025
          </div>

          {/* title */}
          <h1 className="co-title" style={{
            fontFamily: T.ff,
            fontSize: 36, fontWeight: 700, color: T.ink,
            letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 6,
            animation: "co-fade-down 0.45s 0.1s ease both",
          }}>
            Recruiting Companies
          </h1>

          {/* meta */}
          <p className="co-meta" style={{
            fontSize: 13, fontWeight: 400, color: T.ink3,
            marginBottom: 24, lineHeight: 1.5,
            animation: "co-fade-down 0.45s 0.15s ease both",
          }}>
            <strong style={{ fontWeight: 600, color: "#3D5A8A" }}>{companies.length} organisations</strong>{" "}
            are actively recruiting this season. Review eligibility criteria and apply before deadlines.
          </p>

          {/* toolbar */}
          <div className="co-toolbar" style={{
            display: "flex", alignItems: "center", gap: 10,
            paddingBottom: 18, flexWrap: "wrap",
            borderTop: `1px solid #EEF0F4`,
            paddingTop: 16, marginTop: 4,
            animation: "co-fade-up 0.4s 0.2s ease both",
          }}>
            <SearchInput value={search} onChange={handleSearch} />

            <div className="co-filter-row" style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <FilterChip
                  key={f}
                  label={f}
                  active={filter === f}
                  onClick={() => handleFilter(f)}
                />
              ))}
            </div>

            {!loading && <CountBadge count={filtered.length} />}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="co-body" style={{
          position: "relative", zIndex: 1,
          padding: "28px 32px 64px",
          animation: "co-fade-up 0.5s 0.25s ease both",
        }}>
          {!loading && (
            <GridLabel label={filter === "All" ? "All Organisations" : filter} />
          )}

          {loading ? (
            <div className="co-skeleton-grid">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} delay={i * 0.05} />)}
            </div>
          ) : filtered.length > 0 ? (
            <CardGrid key={gridKey} companies={filtered} user={user} />
          ) : (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              animation: "co-fade-up 0.4s ease both",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 10,
                background: "#EEF0F4",
                margin: "0 auto 16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: T.ink4,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div style={{ fontFamily: T.ff, fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 6 }}>
                No Results Found
              </div>
              <div style={{ fontSize: 13, color: T.ink3, fontWeight: 400, lineHeight: 1.6 }}>
                No organisations match your current search or filter criteria.<br />
                Please refine your query and try again.
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}

export default Companies;