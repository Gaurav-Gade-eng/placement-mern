import { useEffect, useState, useRef } from "react";
import TpoNavbar from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import AdminCompanyCard from "../components/AdminCompanyCard";
import API from "../api";

/* ── inject styles once ── */
if (!document.getElementById("tpoco-styles")) {
  const s = document.createElement("style");
  s.id = "tpoco-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Page animations (same as Companies.jsx) ── */
    @keyframes tco-fade-down {
      from { opacity:0; transform:translateY(-12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes tco-fade-up {
      from { opacity:0; transform:translateY(16px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes tco-shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }
    @keyframes tco-chip-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(0.92); }
      100% { transform: scale(1); }
    }
    @keyframes tco-grid-in {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes tco-label-in {
      from { opacity:0; transform:translateX(-10px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes tcoSpin { to { transform:rotate(360deg); } }
    @keyframes tcoPopIn {
      from { opacity:0; transform:scale(0.95) translateY(6px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @keyframes tcoToastIn {
      from { opacity:0; transform:translateY(12px) scale(0.96); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes tcoFormSlide {
      from { opacity:0; transform:translateY(-10px); max-height:0; }
      to   { opacity:1; transform:translateY(0); max-height:900px; }
    }

    /* ── Root ── */
    .tco-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .tco-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }

    /* ── Header (mirrors Companies.jsx header) ── */
    .tco-header {
      position:relative; z-index:1;
      background:#fff; border-bottom:1px solid #E2E4E9;
      padding:36px 48px 0;
      box-shadow:0 1px 4px rgba(0,0,0,0.04);
      animation:tco-fade-down 0.45s ease both;
    }
    .tco-eyebrow {
      display:flex; align-items:center; gap:10px;
      font-size:9.5px; font-weight:700; letter-spacing:2.8px; text-transform:uppercase;
      color:#7A8599; margin-bottom:10px;
      animation:tco-fade-down 0.4s 0.05s ease both;
    }
    .tco-eyebrow span { width:24px; height:1px; background:#B0BAC8; display:block; }
    .tco-title {
      font-size:36px; font-weight:700; color:#0D1C33;
      letter-spacing:-0.8px; line-height:1.1; margin-bottom:6px;
      animation:tco-fade-down 0.45s 0.1s ease both;
    }
    .tco-meta {
      font-size:13px; color:#7A8599; margin-bottom:24px; line-height:1.5;
      animation:tco-fade-down 0.45s 0.15s ease both;
    }
    .tco-meta strong { font-weight:600; color:#3D5A8A; }

    /* toolbar row */
    .tco-toolbar {
      display:flex; align-items:center; gap:10px;
      padding-bottom:18px; flex-wrap:wrap;
      border-top:1px solid #EEF0F4; padding-top:16px; margin-top:4px;
      animation:tco-fade-up 0.4s 0.2s ease both;
    }

    /* search — same as Companies.jsx SearchInput */
    .tco-search-wrap { position:relative; flex:1; max-width:320px; }
    .tco-search-icon {
      position:absolute; left:13px; top:50%; transform:translateY(-50%);
      pointer-events:none; display:flex; align-items:center; transition:color 0.2s;
    }
    .tco-search-input {
      width:100%; height:40px; padding:0 13px 0 38px;
      background:#F4F6F9; border:1px solid #E2E4E9; border-radius:7px;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#0D1C33;
      outline:none;
      transition:border-color 0.2s, background 0.2s, box-shadow 0.25s;
    }
    .tco-search-input:focus {
      background:#fff; border-color:#1B3A6B;
      box-shadow:0 0 0 3px rgba(27,58,107,0.08);
    }
    .tco-search-input::placeholder { color:#B0BAC8; }

    /* filter chips */
    .tco-filters { display:flex; gap:5px; flex-wrap:wrap; }
    .tco-chip {
      height:34px; padding:0 13px; border-radius:5px;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:11.5px; font-weight:500; letter-spacing:0.2px;
      cursor:pointer; border:1px solid #E2E4E9;
      background:#fff; color:#4A5568;
      transition:all 0.18s cubic-bezier(0.34,1.56,0.64,1);
      white-space:nowrap;
    }
    .tco-chip:hover { border-color:#1B3A6B; color:#1B3A6B; background:#EBF2FD; transform:translateY(-1px); }
    .tco-chip.active {
      background:#1B3A6B; border-color:#1B3A6B; color:#fff;
      box-shadow:0 2px 8px rgba(27,58,107,0.2);
    }

    /* count badge */
    .tco-count {
      margin-left:auto;
      font-size:11.5px; font-weight:600; color:#7A8599;
      background:#F4F6F9; border:1px solid #E2E4E9;
      border-radius:5px; padding:4px 11px;
      white-space:nowrap; letter-spacing:0.2px;
      font-family:'Plus Jakarta Sans',sans-serif;
      transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }

    /* add button */
    .tco-add-btn {
      display:inline-flex; align-items:center; gap:6px;
      height:34px; padding:0 14px; border-radius:5px;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:12px; font-weight:700; cursor:pointer;
      background:linear-gradient(135deg,#1B3A6B,#2563EB);
      color:#fff; border:none;
      box-shadow:0 3px 10px rgba(27,58,107,0.2);
      transition:transform 0.15s, box-shadow 0.15s;
      flex-shrink:0;
    }
    .tco-add-btn:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(27,58,107,0.28); }

    /* ── Body ── */
    .tco-body {
      position:relative; z-index:1;
      padding:28px 48px 64px;
      animation:tco-fade-up 0.5s 0.25s ease both;
    }

    /* grid label (same as Companies.jsx GridLabel) */
    .tco-grid-label {
      font-size:10px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase;
      color:#B0BAC8; margin-bottom:16px;
      display:flex; align-items:center; gap:10px;
      font-family:'Plus Jakarta Sans',sans-serif;
      animation:tco-label-in 0.35s ease both;
    }
    .tco-grid-label span { flex:1; height:1px; background:#E2E4E9; display:block; }

    /* grid — same 3-col as Companies.jsx */
    .tco-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

    /* skeleton */
    .tco-skel {
      background:#fff; border:1px solid #E5E7EB; border-radius:12px;
      overflow:hidden; display:flex;
      opacity:0; animation:tco-fade-up 0.4s ease both;
    }
    .tco-skel-shine {
      background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%);
      background-size:200% 100%; animation:tco-shimmer 1.5s ease infinite;
    }

    /* empty state */
    .tco-empty { text-align:center; padding:80px 24px; animation:tco-fade-up 0.4s ease both; }
    .tco-empty-icon {
      width:52px; height:52px; border-radius:10px; background:#EEF0F4;
      margin:0 auto 16px; display:flex; align-items:center; justify-content:center; color:#B0BAC8;
    }

    /* ── Add form panel ── */
    .tco-form-panel {
      background:#fff; border:1px solid #E2E4E9; border-radius:16px;
      overflow:hidden; margin-bottom:24px;
      animation:tcoPopIn 0.3s ease both;
    }
    .tco-form-head {
      padding:16px 20px; border-bottom:1px solid #F0F2F6;
      display:flex; align-items:center; justify-content:space-between;
    }
    .tco-form-title { font-size:14px; font-weight:800; color:#0D1C33; display:flex; align-items:center; gap:9px; }
    .tco-form-icon  { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
    .tco-form-body  { padding:20px; animation:tcoFormSlide 0.35s ease both; }

    /* form grid */
    .tco-fg { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px; }
    .tco-field  { display:flex; flex-direction:column; gap:5px; }
    .tco-label  { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; }
    .tco-iw {
      display:flex; align-items:center;
      height:40px; border:1px solid #E2E4E9; border-radius:8px;
      background:#F9FAFB; padding:0 12px; gap:8px;
      transition:border-color 0.18s, box-shadow 0.18s, background 0.18s;
    }
    .tco-iw:focus-within { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .tco-iw svg { flex-shrink:0; color:#C0C8D5; transition:color 0.18s; }
    .tco-iw:focus-within svg { color:#3B7DED; }
    .tco-in {
      flex:1; border:none; background:transparent; outline:none;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33;
    }
    .tco-in::placeholder { color:#C0C8D5; }

    /* logo preview */
    .tco-logo-prev {
      width:28px; height:28px; border-radius:6px; background:#F0F2F6;
      display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0;
    }
    .tco-logo-prev img { width:100%; height:100%; object-fit:contain; }

    /* skill chips */
    .tco-skill-wrap {
      min-height:40px; border:1px solid #E2E4E9; border-radius:8px;
      background:#F9FAFB; padding:4px 10px;
      display:flex; align-items:center; flex-wrap:wrap; gap:5px;
      transition:border-color 0.18s, box-shadow 0.18s, background 0.18s; cursor:text;
    }
    .tco-skill-wrap:focus-within { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .tco-sk-chip {
      display:inline-flex; align-items:center; gap:5px;
      background:#EBF2FD; border:1px solid #C2D6FA;
      border-radius:5px; padding:2px 8px;
      font-size:11px; font-weight:700; color:#1B3A6B;
    }
    .tco-sk-x {
      background:none; border:none; cursor:pointer; color:#7A8599; padding:0; line-height:1;
      display:flex; align-items:center; transition:color 0.12s;
    }
    .tco-sk-x:hover { color:#DC2626; }
    .tco-sk-in {
      flex:1; min-width:80px; border:none; background:transparent; outline:none;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33;
    }
    .tco-sk-in::placeholder { color:#C0C8D5; }

    /* form buttons */
    .tco-submit-btn {
      height:40px; border:none; border-radius:8px; cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700;
      display:inline-flex; align-items:center; gap:6px; padding:0 18px;
      background:linear-gradient(135deg,#1B3A6B,#2563EB); color:#fff;
      box-shadow:0 3px 10px rgba(27,58,107,0.2);
      transition:transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    }
    .tco-submit-btn:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(27,58,107,0.28); }
    .tco-submit-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
    .tco-spinner {
      width:14px; height:14px; border-radius:50%;
      border:2px solid rgba(255,255,255,0.4); border-top-color:#fff;
      animation:tcoSpin 0.7s linear infinite;
    }

    /* error */
    .tco-error {
      display:flex; align-items:center; gap:8px;
      background:#FEF2F2; border:1px solid #FECACA; border-radius:8px;
      padding:9px 13px; margin-bottom:14px;
      font-size:12.5px; color:#DC2626; font-weight:500;
    }

    /* ── Delete modal ── */
    .tco-overlay {
      position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.35);
      display:flex; align-items:center; justify-content:center;
      animation:tcoPopIn 0.2s ease both;
    }
    .tco-modal {
      background:#fff; border-radius:16px; padding:28px 28px 24px; width:380px;
      box-shadow:0 20px 60px rgba(0,0,0,0.18); font-family:'Plus Jakarta Sans',sans-serif;
      animation:tcoPopIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .tco-modal-title { font-size:16px; font-weight:800; color:#0D1C33; margin-bottom:8px; }
    .tco-modal-sub   { font-size:13px; color:#7A8599; line-height:1.6; margin-bottom:24px; }
    .tco-modal-btns  { display:flex; gap:10px; justify-content:flex-end; }

    /* toast */
    .tco-toast {
      position:fixed; bottom:28px; right:28px; z-index:999;
      display:flex; align-items:center; gap:10px;
      background:#fff; border:1px solid #E2E4E9; border-radius:12px;
      padding:12px 16px; box-shadow:0 8px 28px rgba(0,0,0,0.1);
      animation:tcoToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
      font-size:13px; font-weight:600; color:#0D1C33;
      font-family:'Plus Jakarta Sans',sans-serif;
    }

    /* ── Mobile Responsive ── */
    @media (max-width: 768px) {
      .tco-header { padding: 20px 16px 0; }
      .tco-title  { font-size: 24px; }
      .tco-meta   { font-size: 12px; margin-bottom: 16px; }

      .tco-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding-top: 12px;
        padding-bottom: 14px;
      }
      .tco-search-wrap { max-width: 100%; }
      .tco-filters { flex-wrap: wrap; }
      .tco-chip   { font-size: 11px; height: 30px; padding: 0 10px; }
      .tco-count  { display: none; }
      .tco-add-btn { width: 100%; justify-content: center; height: 38px; }

      .tco-body { padding: 16px 16px 48px; }
      .tco-grid { grid-template-columns: 1fr; gap: 10px; }

      .tco-fg { grid-template-columns: 1fr; }
      .tco-form-body { padding: 14px; }

      .tco-modal { width: calc(100vw - 32px); padding: 20px 18px 18px; }
      .tco-toast { right: 16px; bottom: 16px; left: 16px; }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .tco-header { padding: 28px 28px 0; }
      .tco-body   { padding: 20px 28px 48px; }
      .tco-grid   { grid-template-columns: repeat(2, 1fr); }
      .tco-fg     { grid-template-columns: 1fr 1fr; }
    }
  `;
  document.head.appendChild(s);
}

const FILTERS = ["All", "Technology", "IT Services", "Consulting", "Financial Services", "Core Engineering"];

function getSector(name = "") {
  const n = name.toLowerCase();
  if (["servicenow","amazon","nvidia","cadence","applied","druva","veritas","snowflake","workday","salesforce","adobe","microsoft","google","apple"].some(k => n.includes(k))) return "Technology";
  if (["infosys","wipro","tcs","cognizant","hcl","accenture","capgemini","persistent","techverito","zensar"].some(k => n.includes(k))) return "IT Services";
  if (["deloitte","consulting","stanley","mckinsey","pwc","kpmg","gupshup","pubmatic","forescout"].some(k => n.includes(k))) return "Consulting";
  if (["bank","finance","capital","razorpay","paytm","deutsche","hsbc","oracle fss","futures first"].some(k => n.includes(k))) return "Financial Services";
  return "Core Engineering";
}

/* ── Skeleton (same as Companies.jsx) ── */
function Skeleton({ delay = 0 }) {
  return (
    <div className="tco-skel" style={{ animationDelay: `${delay}s` }}>
      <div className="tco-skel-shine" style={{ width:110, flexShrink:0 }} />
      <div style={{ flex:1, padding:"22px 20px", display:"flex", flexDirection:"column", gap:10 }}>
        <div className="tco-skel-shine" style={{ height:14, width:"60%", borderRadius:4 }} />
        <div className="tco-skel-shine" style={{ height:12, width:"40%", borderRadius:4 }} />
        <div className="tco-skel-shine" style={{ height:30, width:"45%", borderRadius:6, marginTop:4 }} />
      </div>
    </div>
  );
}

const token = () => localStorage.getItem("token");

export default function TpoCompanies() {
  const [companies,    setCompanies]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState("All");
  const [search,       setSearch]       = useState("");
  const [gridKey,      setGridKey]      = useState(0);
  const [showForm,     setShowForm]     = useState(false);
  const [addLoading,   setAddLoading]   = useState(false);
  const [error,        setError]        = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [toast,        setToast]        = useState("");
  const [searchFocus,  setSearchFocus]  = useState(false);

  /* form state */
  const [companyName, setCompanyName] = useState("");
  const [salary,      setSalary]      = useState("");
  const [offers,      setOffers]      = useState("");
  const [minCGPA,     setMinCGPA]     = useState("");
  const [logoDomain,  setLogoDomain]  = useState("");
  const [skillInput,  setSkillInput]  = useState("");
  const [skillsList,  setSkillsList]  = useState([]);

  useEffect(() => { fetchCompanies(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await API.get("/company",
        { headers: { Authorization: `Bearer ${token()}` } });
      setCompanies(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleFilter = (f) => { setFilter(f); setGridKey(k => k + 1); };
  const handleSearch = (v) => { setSearch(v); setGridKey(k => k + 1); };

  /* skills chip */
  const handleSkillKey = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, "");
      if (val && !skillsList.includes(val)) setSkillsList(p => [...p, val]);
      setSkillInput("");
    }
    if (e.key === "Backspace" && !skillInput && skillsList.length)
      setSkillsList(p => p.slice(0, -1));
  };

  const addCompany = async () => {
    if (!companyName) { setError("Company name is required."); return; }
    if (!salary)      { setError("Please enter the salary package."); return; }
    setAddLoading(true); setError("");
    try {
      await API.post("/company/create",
        { companyName, salary, offers, minimumCGPA: minCGPA, requiredSkills: skillsList, logo: logoDomain },
        { headers: { Authorization: `Bearer ${token()}` } });
      setCompanyName(""); setSalary(""); setOffers(""); setMinCGPA("");
      setLogoDomain(""); setSkillsList([]); setSkillInput("");
      showToast(`${companyName} added!`);
      setShowForm(false);
      fetchCompanies();
    } catch { setError("Failed to add. Please try again."); }
    finally { setAddLoading(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await API.delete(`/company/${deleteTarget._id}`,
        { headers: { Authorization: `Bearer ${token()}` } });
      showToast(`${deleteTarget.companyName} removed.`);
      setDeleteTarget(null);
      fetchCompanies();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const filtered = companies.filter(c => {
    const matchSearch = c.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || getSector(c.companyName) === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="tco-root">
      <TpoSidebar />
      <div className="tco-main">
        <TpoNavbar />

        {/* ════ HEADER — mirrors Companies.jsx exactly ════ */}
        <div className="tco-header">
          <div className="tco-eyebrow">
            <span />
            Campus Recruitment · 2025 — Admin View
          </div>
          <h1 className="tco-title">Recruiting Companies</h1>
          <p className="tco-meta">
            <strong>{companies.length} organisations</strong>{" "}
            in the portal this season. Add, remove, and manage company listings below.
          </p>

          {/* toolbar */}
          <div className="tco-toolbar">
            {/* search */}
            <div className="tco-search-wrap">
              <span className="tco-search-icon" style={{ color: searchFocus ? "#1B3A6B" : "#B0BAC8" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transition:"transform 0.3s", transform: searchFocus ? "scale(1.1)" : "scale(1)" }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                className="tco-search-input"
                placeholder="Search by company name…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
              />
            </div>

            {/* filter chips */}
            <div className="tco-filters">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`tco-chip${filter === f ? " active" : ""}`}
                  onClick={() => handleFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* count badge */}
            {!loading && (
              <span className="tco-count">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}

            {/* Add Company button */}
            <button className="tco-add-btn" onClick={() => { setShowForm(p => !p); setError(""); }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {showForm
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
              </svg>
              {showForm ? "Cancel" : "Add Company"}
            </button>
          </div>
        </div>

        {/* ════ BODY ════ */}
        <div className="tco-body">

          {/* ── Collapsible add form ── */}
          {showForm && (
            <div className="tco-form-panel">
              <div className="tco-form-head">
                <div className="tco-form-title">
                  <div className="tco-form-icon" style={{ background:"#EBF2FD", border:"1px solid #C2D6FA" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.3">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                  New Company
                </div>
              </div>
              <div className="tco-form-body">
                {error && (
                  <div className="tco-error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}
                <div className="tco-fg">
                  {/* Company Name */}
                  <div className="tco-field">
                    <label className="tco-label">Company Name *</label>
                    <div className="tco-iw">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                      <input className="tco-in" placeholder="e.g. Infosys" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                    </div>
                  </div>
                  {/* Salary */}
                  <div className="tco-field">
                    <label className="tco-label">Salary (LPA) *</label>
                    <div className="tco-iw">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      <input className="tco-in" placeholder="e.g. 12" type="number" value={salary} onChange={e => setSalary(e.target.value)} />
                    </div>
                  </div>
                  {/* Offers */}
                  <div className="tco-field">
                    <label className="tco-label">No. of Offers</label>
                    <div className="tco-iw">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      <input className="tco-in" placeholder="e.g. 5" type="number" value={offers} onChange={e => setOffers(e.target.value)} />
                    </div>
                  </div>
                  {/* Min CGPA */}
                  <div className="tco-field">
                    <label className="tco-label">Minimum CGPA</label>
                    <div className="tco-iw">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>
                      <input className="tco-in" placeholder="e.g. 7.5" type="number" step="0.1" value={minCGPA} onChange={e => setMinCGPA(e.target.value)} />
                    </div>
                  </div>
                  {/* Logo domain */}
                  <div className="tco-field">
                    <label className="tco-label">Logo Domain</label>
                    <div className="tco-iw">
                      {logoDomain ? (
                        <div className="tco-logo-prev">
                          <img src={`https://logo.clearbit.com/${logoDomain}`} alt="" onError={e => e.target.style.display="none"} />
                        </div>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      )}
                      <input className="tco-in" placeholder="e.g. infosys.com" value={logoDomain} onChange={e => setLogoDomain(e.target.value)} />
                    </div>
                  </div>
                  {/* Skills */}
                  <div className="tco-field" style={{ gridColumn:"1 / -1" }}>
                    <label className="tco-label">Required Skills — Enter or comma to add</label>
                    <div className="tco-skill-wrap" onClick={e => e.currentTarget.querySelector("input").focus()}>
                      {skillsList.map(sk => (
                        <span className="tco-sk-chip" key={sk}>
                          {sk}
                          <button className="tco-sk-x" onClick={() => setSkillsList(p => p.filter(x => x !== sk))}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </span>
                      ))}
                      <input
                        className="tco-sk-in"
                        placeholder={skillsList.length === 0 ? "e.g. React, Node.js…" : ""}
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKey}
                        onBlur={() => {
                          if (skillInput.trim()) {
                            setSkillsList(p => [...new Set([...p, skillInput.trim()])]);
                            setSkillInput("");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button className="tco-submit-btn" onClick={addCompany} disabled={addLoading}>
                  {addLoading
                    ? <><div className="tco-spinner"/>Adding…</>
                    : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Company</>}
                </button>
              </div>
            </div>
          )}

          {/* ── Grid label ── */}
          {!loading && (
            <div className="tco-grid-label">
              {filter === "All" ? "All Organisations" : filter}
              <span />
            </div>
          )}

          {/* ── Cards grid (same 3-col as Companies.jsx) ── */}
          {loading ? (
            <div className="tco-grid">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} delay={i * 0.05} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div key={gridKey} className="tco-grid">
              {filtered.map((company, i) => (
                <div
                  key={company._id}
                  style={{
                    opacity: 0,
                    animation: `tco-grid-in 0.4s ease ${Math.min(i * 0.06, 0.5)}s both`,
                  }}
                >
                  <AdminCompanyCard
                    company={company}
                    onDelete={setDeleteTarget}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="tco-empty">
              <div className="tco-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:600, color:"#0D1C33", marginBottom:6 }}>
                No Results Found
              </div>
              <div style={{ fontSize:13, color:"#7A8599", lineHeight:1.6 }}>
                No organisations match your current search or filter.<br />
                Try a different query or add a new company above.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete modal ── */}
      {deleteTarget && (
        <div className="tco-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="tco-modal" onClick={e => e.stopPropagation()}>
            <div style={{
              width:44, height:44, borderRadius:11, background:"#FEF2F2",
              border:"1px solid #FECACA", display:"flex", alignItems:"center",
              justifyContent:"center", marginBottom:16,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <div className="tco-modal-title">Delete {deleteTarget.companyName}?</div>
            <div className="tco-modal-sub">
              This will permanently remove <strong>{deleteTarget.companyName}</strong> from the placement portal.
              Students will no longer see this company.
            </div>
            <div className="tco-modal-btns">
              <button
                style={{ height:38, padding:"0 16px", borderRadius:8, border:"1px solid #E2E4E9", background:"#F0F2F6", color:"#4A5568", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12.5, cursor:"pointer" }}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                style={{ height:38, padding:"0 16px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"#fff", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12.5, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity: deleting ? 0.7 : 1 }}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? <><div className="tco-spinner" style={{ borderTopColor:"#fff" }}/>Deleting…</> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="tco-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}