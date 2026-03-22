import { useState, useEffect } from "react";
import TpoNavbar  from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import API from "../api";

/* ── styles ── */
if (!document.getElementById("tpoa-styles")) {
  const s = document.createElement("style");
  s.id = "tpoa-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes tpoaUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tpoaIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tpoaPop   { from{opacity:0;transform:scale(0.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes tpoaFade  { from{opacity:0} to{opacity:1} }
    @keyframes tpoaToast { from{opacity:0;transform:translateY(12px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes tpoaSpin  { to{transform:rotate(360deg)} }
    @keyframes tpoaShim  { from{background-position:200% 0} to{background-position:-200% 0} }

    .tpoa-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .tpoa-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .tpoa-body { flex:1; padding:30px 36px 60px; overflow-y:auto; }

    .tpoa-hd    { margin-bottom:22px; animation:tpoaUp 0.45s ease both; }
    .tpoa-ey    { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#3B7DED; margin-bottom:6px; display:flex; align-items:center; gap:7px; }
    .tpoa-ey::before { content:''; width:18px; height:2px; background:#3B7DED; border-radius:2px; }
    .tpoa-title { font-size:26px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; }
    .tpoa-sub   { font-size:13px; color:#7A8599; margin-top:4px; }

    .tpoa-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:22px; animation:tpoaUp 0.45s 0.04s ease both; }
    .tpoa-stat  { background:#fff; border:1px solid #E2E4E9; border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:12px; transition:box-shadow 0.2s,transform 0.2s; }
    .tpoa-stat:hover { box-shadow:0 4px 16px rgba(0,0,0,0.07); transform:translateY(-2px); }
    .tpoa-stat-ico { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .tpoa-stat-val { font-size:22px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; line-height:1; }
    .tpoa-stat-lbl { font-size:11px; color:#7A8599; margin-top:3px; }

    .tpoa-card { background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden; margin-bottom:20px; }
    .tpoa-ch   { padding:15px 20px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; justify-content:space-between; }
    .tpoa-ct   { font-size:14px; font-weight:800; color:#0D1C33; display:flex; align-items:center; gap:9px; }
    .tpoa-ci   { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
    .tpoa-cb   { padding:22px 24px; }

    .tpoa-fg  { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px; }
    .tpoa-fw  { grid-column:1/-1; }
    .tpoa-field { display:flex; flex-direction:column; gap:6px; }
    .tpoa-lbl   { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; }
    .tpoa-iw  { height:40px; border:1px solid #E2E4E9; border-radius:8px; background:#F9FAFB; padding:0 12px; display:flex; align-items:center; gap:8px; transition:border-color 0.18s, box-shadow 0.18s, background 0.18s; }
    .tpoa-iw:focus-within { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .tpoa-in  { flex:1; border:none; background:transparent; outline:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; }
    .tpoa-in::placeholder { color:#C0C8D5; }
    .tpoa-sel { flex:1; border:none; background:transparent; outline:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; appearance:none; cursor:pointer; }
    .tpoa-ta  { width:100%; border:1px solid #E2E4E9; border-radius:8px; padding:10px 12px; background:#F9FAFB; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; outline:none; resize:vertical; min-height:88px; transition:border-color 0.18s, box-shadow 0.18s, background 0.18s; }
    .tpoa-ta:focus { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .tpoa-ta::placeholder { color:#C0C8D5; }

    .tpoa-chips { display:flex; gap:7px; flex-wrap:wrap; }
    .tpoa-chip { display:inline-flex; align-items:center; gap:5px; padding:5px 13px; border-radius:7px; border:1px solid #E2E4E9; background:#F9FAFB; font-size:12px; font-weight:600; color:#7A8599; cursor:pointer; user-select:none; transition:all 0.15s cubic-bezier(0.34,1.56,0.64,1); }
    .tpoa-chip:hover { border-color:#C2D6FA; color:#1B3A6B; }
    .tpoa-chip.sel { background:#EBF2FD; border-color:#3B7DED; color:#1B3A6B; }
    .tpoa-chip-dot { width:5px; height:5px; border-radius:50%; background:#3B7DED; opacity:0; transition:opacity 0.15s; flex-shrink:0; }
    .tpoa-chip.sel .tpoa-chip-dot { opacity:1; }

    .tpoa-toggle-row { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:10px; border:1px solid #E2E4E9; background:#F9FAFB; cursor:pointer; transition:border-color 0.15s, background 0.15s; user-select:none; }
    .tpoa-toggle-row.on { border-color:#3B7DED; background:#EBF2FD; }
    .tpoa-toggle { width:38px; height:22px; border-radius:11px; flex-shrink:0; background:#CBD5E1; position:relative; transition:background 0.2s; }
    .tpoa-toggle.on { background:#2563EB; }
    .tpoa-toggle-knob { width:16px; height:16px; border-radius:50%; background:#fff; position:absolute; top:3px; left:3px; transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 1px 3px rgba(0,0,0,0.2); }
    .tpoa-toggle.on .tpoa-toggle-knob { transform:translateX(16px); }
    .tpoa-toggle-lbl { font-size:13px; font-weight:700; color:#0D1C33; }
    .tpoa-toggle-sub { font-size:11.5px; color:#7A8599; margin-top:1px; }

    .tpoa-err { display:flex; align-items:center; gap:8px; background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:9px 13px; margin-bottom:14px; font-size:12.5px; color:#DC2626; font-weight:500; }

    .tpoa-btn { height:38px; border:none; border-radius:8px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:6px; padding:0 16px; transition:transform 0.15s, box-shadow 0.15s, opacity 0.15s; white-space:nowrap; }
    .tpoa-btn:hover:not(:disabled) { transform:translateY(-1px); }
    .tpoa-btn:disabled { opacity:0.5; cursor:not-allowed; }
    .tpoa-btn-primary { background:linear-gradient(135deg,#1B3A6B,#2563EB); color:#fff; box-shadow:0 3px 10px rgba(27,58,107,0.2); }
    .tpoa-btn-primary:hover:not(:disabled) { box-shadow:0 6px 16px rgba(27,58,107,0.28); }
    .tpoa-btn-outline { background:#fff; color:#7A8599; border:1px solid #E2E4E9; }
    .tpoa-btn-outline:hover:not(:disabled) { color:#0D1C33; border-color:#C7D9F5; }
    .tpoa-btn-danger  { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; }
    .tpoa-btn-danger:hover:not(:disabled)  { background:#FEE2E2; }
    .tpoa-btn-edit    { background:#EBF2FD; color:#1B3A6B; border:1px solid #C2D6FA; }
    .tpoa-btn-edit:hover:not(:disabled)    { background:#D6E8FC; }
    .tpoa-btn-sm { height:32px; font-size:11.5px; padding:0 12px; }
    .tpoa-spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.4); border-top-color:#fff; animation:tpoaSpin 0.7s linear infinite; }

    .tpoa-item { display:flex; align-items:flex-start; gap:14px; padding:18px 20px; border-bottom:1px solid #F5F7FA; transition:background 0.12s; }
    .tpoa-item:last-child { border-bottom:none; }
    .tpoa-item:hover { background:#FAFBFF; }
    .tpoa-item-num { width:34px; height:34px; border-radius:9px; background:#EBF2FD; border:1px solid #C2D6FA; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#1B3A6B; flex-shrink:0; margin-top:1px; }
    .tpoa-item-title { font-size:14px; font-weight:800; color:#0D1C33; margin-bottom:3px; }
    .tpoa-item-co    { font-size:12.5px; color:#3B7DED; font-weight:600; margin-bottom:5px; display:flex; align-items:center; gap:4px; }
    .tpoa-item-desc  { font-size:12.5px; color:#7A8599; line-height:1.65; margin-bottom:9px; }
    .tpoa-item-tags  { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
    .tpoa-item-btns  { display:flex; gap:7px; flex-shrink:0; margin-left:auto; padding-left:12px; flex-direction:column; align-items:flex-end; }
    .tpoa-tag { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:5px; font-size:11px; font-weight:700; }

    .tpoa-tabs { display:flex; align-items:center; background:#F0F2F6; border-radius:9px; padding:3px; gap:2px; border:1px solid #E2E4E9; }
    .tpoa-tab  { height:30px; padding:0 13px; border-radius:7px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:11.5px; font-weight:600; background:transparent; color:#7A8599; transition:all 0.15s; }
    .tpoa-tab.act { background:#fff; color:#1B3A6B; box-shadow:0 1px 4px rgba(0,0,0,0.08); }

    .tpoa-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.45); backdrop-filter:blur(2px); display:flex; align-items:center; justify-content:center; animation:tpoaFade 0.2s ease both; }
    .tpoa-modal   { background:#fff; border-radius:18px; width:600px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 24px 64px rgba(0,0,0,0.18); font-family:'Plus Jakarta Sans',sans-serif; animation:tpoaPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; overflow:hidden; }
    .tpoa-mh { padding:20px 24px 16px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
    .tpoa-mb { flex:1; overflow-y:auto; padding:20px 24px 24px; }

    .tpoa-sk { background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%); background-size:200% 100%; animation:tpoaShim 1.5s ease infinite; border-radius:4px; }

    .tpoa-empty { display:flex; flex-direction:column; align-items:center; padding:56px 24px; text-align:center; }
    .tpoa-empty-ico { width:52px; height:52px; border-radius:13px; background:#EBF2FD; border:1px solid #C2D6FA; display:flex; align-items:center; justify-content:center; margin-bottom:14px; color:#3B7DED; }

    .tpoa-toast { position:fixed; bottom:28px; right:28px; z-index:999; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #E2E4E9; border-radius:12px; padding:12px 16px; box-shadow:0 8px 28px rgba(0,0,0,0.1); animation:tpoaToast 0.3s cubic-bezier(0.34,1.56,0.64,1) both; font-size:13px; font-weight:600; color:#0D1C33; max-width:320px; }

    .tpoa-divider { height:1px; background:#F0F2F6; margin:18px 0; }
    .tpoa-section-lbl { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#B0BAC8; margin-bottom:10px; }
  `;
  document.head.appendChild(s);
}


const tk          = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const SEMESTERS   = [1, 2, 3, 4, 5, 6, 7, 8];
const DEPARTMENTS = ["IT", "CIVIL", "ENTC", "MECH", "Electrical"];

/* ─────────────────────────────
   Professional SVG Icon Library
───────────────────────────── */

// Megaphone — Total Announcements
const IcoMegaphone = ({ size = 16, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
);

// Building — Placement Drives / Company
const IcoBuilding = ({ size = 16, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
    <line x1="15" y1="3" x2="15" y2="21"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
  </svg>
);

// Clipboard — General Notices
const IcoClipboard = ({ size = 16, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

// Bell — Posted Announcements header / empty state
const IcoBell = ({ size = 14, color = "currentColor", sw = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

// Users — All Students tag
const IcoUsers = ({ size = 11, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// Calendar — Drive Date
const IcoCalendar = ({ size = 13, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// Book/Semester — Semesters tag
const IcoBook = ({ size = 10, color = "currentColor", sw = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// Home/Department — Departments tag
const IcoHome = ({ size = 10, color = "currentColor", sw = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// Warning Triangle
const IcoWarning = ({ size = 15, color = "#DC2626", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// TYPE metadata — labels with no emojis
const TYPE_META = {
  drive:   { bg:"#EBF2FD", color:"#1B3A6B", border:"#C2D6FA", label:"Placement Drive",  Icon: IcoBuilding },
  general: { bg:"#ECFDF5", color:"#065F46", border:"#A7F3D0", label:"General Notice",   Icon: IcoClipboard },
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : null;

/* ══════════════════
   Chip Toggle
══════════════════ */
function ChipGroup({ label, items, selected, onToggle, renderLabel }) {
  return (
    <div className="tpoa-field tpoa-fw">
      <label className="tpoa-lbl">{label}</label>
      <div className="tpoa-chips">
        {items.map(item => {
          const val = typeof item === "object" ? item.value : item;
          const lbl = renderLabel ? renderLabel(item) : String(item);
          return (
            <div key={val} className={`tpoa-chip${selected.includes(val) ? " sel" : ""}`} onClick={() => onToggle(val)}>
              <div className="tpoa-chip-dot" />
              {lbl}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════
   Announcement Form
══════════════════ */
function AnnForm({ initial, onSubmit, onCancel, loading, submitLabel = "Post Announcement" }) {
  const def = { title:"", company:"", description:"", type:"general", driveDate:"", ...initial };
  const [form,        setForm]        = useState(def);
  const [selSem,      setSelSem]      = useState(initial?.semesters  || []);
  const [selDept,     setSelDept]     = useState(initial?.departments || []);
  const [allStudents, setAllStudents] = useState(initial?.allStudents || false);
  const [err,         setErr]         = useState("");

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const toggleSem  = (v) => setSelSem(p  => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleDept = (v) => setSelDept(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const handleSubmit = () => {
    if (!form.title.trim())       { setErr("Title is required."); return; }
    if (!form.description.trim()) { setErr("Description is required."); return; }
    if (!allStudents && selDept.length === 0) { setErr("Select at least one department or enable 'All Students'."); return; }
    setErr("");
    onSubmit({ ...form, semesters: selSem, departments: selDept, allStudents });
  };

  return (
    <div>
      {err && (
        <div className="tpoa-err">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {err}
        </div>
      )}

      <div className="tpoa-fg">
        {/* Title */}
        <div className="tpoa-field">
          <label className="tpoa-lbl">Title *</label>
          <div className="tpoa-iw">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C0C8D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
            <input className="tpoa-in" value={form.title} onChange={f("title")} placeholder="e.g. Amazon SDE Placement Drive"/>
          </div>
        </div>
        {/* Company */}
        <div className="tpoa-field">
          <label className="tpoa-lbl">Company</label>
          <div className="tpoa-iw">
            <IcoBuilding size={13} color="#C0C8D5" sw={2} />
            <input className="tpoa-in" value={form.company} onChange={f("company")} placeholder="e.g. Amazon"/>
          </div>
        </div>
        {/* Type */}
        <div className="tpoa-field">
          <label className="tpoa-lbl">Type</label>
          <div className="tpoa-iw">
            <IcoBell size={13} color="#C0C8D5" sw={2} />
            <select className="tpoa-sel" value={form.type} onChange={f("type")}>
              <option value="general">General Notice</option>
              <option value="drive">Placement Drive</option>
            </select>
          </div>
        </div>
        {/* Drive Date */}
        {form.type === "drive" ? (
          <div className="tpoa-field">
            <label className="tpoa-lbl">Drive Date</label>
            <div className="tpoa-iw">
              <IcoCalendar size={13} color="#C0C8D5" sw={2} />
              <input className="tpoa-in" type="date" value={form.driveDate} onChange={f("driveDate")}/>
            </div>
          </div>
        ) : <div />}
        {/* Description */}
        <div className="tpoa-field tpoa-fw">
          <label className="tpoa-lbl">Description *</label>
          <textarea className="tpoa-ta" value={form.description} onChange={f("description")} placeholder="Write the announcement details…" rows={3}/>
        </div>
      </div>

      <div className="tpoa-divider"/>

      {/* All Students Toggle */}
      <div className={`tpoa-toggle-row${allStudents ? " on" : ""}`} onClick={() => setAllStudents(p => !p)} style={{ marginBottom:16 }}>
        <div className={`tpoa-toggle${allStudents ? " on" : ""}`}><div className="tpoa-toggle-knob"/></div>
        <div>
          <div className="tpoa-toggle-lbl">All Students</div>
          <div className="tpoa-toggle-sub">Show this announcement to every student regardless of semester or department</div>
        </div>
      </div>

      {!allStudents && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <ChipGroup label="Target Semesters" items={SEMESTERS} selected={selSem} onToggle={toggleSem} renderLabel={(s) => `Sem ${s}`} />
          <ChipGroup label="Target Departments" items={DEPARTMENTS} selected={selDept} onToggle={toggleDept} />
        </div>
      )}

      <div className="tpoa-divider"/>

      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        {onCancel && <button className="tpoa-btn tpoa-btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>}
        <button className="tpoa-btn tpoa-btn-primary" style={{ height:44, paddingLeft:24, paddingRight:24, fontSize:13 }} onClick={handleSubmit} disabled={loading}>
          {loading
            ? <><div className="tpoa-spinner"/>Saving…</>
            : <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                {submitLabel}
              </>
          }
        </button>
      </div>
    </div>
  );
}

/* ══════════════════
   Edit Modal
══════════════════ */
function EditModal({ ann, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const save = async (data) => {
    setLoading(true);
    try { await API.put(`${API}/announcement/${ann._id}`, data, tk()); onSaved(); }
    catch { setLoading(false); }
  };
  return (
    <div className="tpoa-overlay" onClick={onClose}>
      <div className="tpoa-modal" onClick={e => e.stopPropagation()}>
        <div className="tpoa-mh">
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"#0D1C33" }}>Edit Announcement</div>
            <div style={{ fontSize:11.5, color:"#7A8599", marginTop:2 }}>Changes are visible to students immediately.</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#B0BAC8", padding:4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="tpoa-mb">
          <AnnForm
            initial={{ title:ann.title||"", company:ann.company||"", description:ann.description||"", type:ann.type||"general", driveDate:ann.driveDate?ann.driveDate.slice(0,10):"", semesters:ann.semesters||[], departments:ann.departments||[], allStudents:ann.allStudents||false }}
            onSubmit={save} onCancel={onClose} loading={loading} submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════
   Delete Modal
══════════════════ */
function DeleteModal({ ann, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const del = async () => {
    setLoading(true);
    try { await API.delete(`${API}/announcement/${ann._id}`, tk()); onDeleted(); }
    catch { setLoading(false); }
  };
  return (
    <div className="tpoa-overlay" onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:18, padding:32, width:400, boxShadow:"0 24px 64px rgba(0,0,0,0.18)", fontFamily:"'Plus Jakarta Sans',sans-serif", animation:"tpoaPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }} onClick={e => e.stopPropagation()}>
        {/* Trash icon */}
        <div style={{ width:48, height:48, borderRadius:12, background:"#FEF2F2", border:"1px solid #FECACA", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>

        <div style={{ fontSize:17, fontWeight:800, color:"#0D1C33", marginBottom:8 }}>Delete Announcement?</div>

        <div style={{ background:"#F8FAFC", border:"1px solid #E2E4E9", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
          <div style={{ fontSize:13.5, fontWeight:700, color:"#0D1C33" }}>{ann.title}</div>
          {ann.company && (
            <div style={{ fontSize:12, color:"#7A8599", marginTop:3, display:"flex", alignItems:"center", gap:5 }}>
              <IcoBuilding size={12} color="#7A8599" sw={2} />
              {ann.company}
            </div>
          )}
        </div>

        {/* Warning row — SVG triangle replaces ⚠️ */}
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#DC2626", fontWeight:600, marginBottom:24 }}>
          <IcoWarning size={15} />
          This is permanent and cannot be undone.
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button className="tpoa-btn tpoa-btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="tpoa-btn" style={{ background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"#fff", opacity:loading?0.7:1 }} onClick={del} disabled={loading}>
            {loading
              ? <><div className="tpoa-spinner"/>Deleting…</>
              : <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                  Yes, Delete
                </>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════
   Main Page
══════════════════════════ */
export default function TpoAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [postLoading,   setPostLoading]   = useState(false);
  const [showForm,      setShowForm]      = useState(false);
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [toast,         setToast]         = useState({ msg:"", type:"ok" });
  const [filterTab,     setFilterTab]     = useState("all");

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"ok" }), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try { const res = await API.get(`${API}/announcement`, tk()); setAnnouncements(res.data); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async (data) => {
    setPostLoading(true);
    try {
      await API.post(`${API}/announcement/create`, data, tk());
      showToast("Announcement posted successfully!");
      setShowForm(false);
      fetchAll();
    } catch { showToast("Failed to post. Try again.", "err"); }
    finally { setPostLoading(false); }
  };

  const driveCount   = announcements.filter(a => a.type === "drive").length;
  const generalCount = announcements.filter(a => a.type === "general").length;

  const tabFiltered = filterTab === "drive"   ? announcements.filter(a => a.type === "drive")
                    : filterTab === "general" ? announcements.filter(a => a.type === "general")
                    : announcements;

  return (
    <div className="tpoa-root">
      <TpoSidebar />
      <div className="tpoa-main">
        <TpoNavbar />
        <div className="tpoa-body">

          {/* Header */}
          <div className="tpoa-hd">
            <div className="tpoa-ey">TPO Office</div>
            <h1 className="tpoa-title">Announcements</h1>
            <p className="tpoa-sub">Create, edit and delete placement announcements for students.</p>
          </div>

          {/* Stats — all SVG icons */}
          <div className="tpoa-stats">
            {[
              { icon:<IcoMegaphone size={20} color="#3B7DED" sw={1.8}/>, val:announcements.length, lbl:"Total",            bg:"#EBF2FD", bc:"#C2D6FA" },
              { icon:<IcoBuilding  size={20} color="#D97706" sw={1.8}/>, val:driveCount,           lbl:"Placement Drives", bg:"#FEF3C7", bc:"#FDE68A" },
              { icon:<IcoClipboard size={20} color="#059669" sw={1.8}/>, val:generalCount,          lbl:"General Notices",  bg:"#ECFDF5", bc:"#A7F3D0" },
            ].map((st, i) => (
              <div className="tpoa-stat" key={i}>
                <div className="tpoa-stat-ico" style={{ background:st.bg, border:`1px solid ${st.bc}` }}>{st.icon}</div>
                <div>
                  <div className="tpoa-stat-val">{loading ? "—" : st.val}</div>
                  <div className="tpoa-stat-lbl">{st.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Create form card ── */}
          <div className="tpoa-card" style={{ animation:"tpoaUp 0.45s 0.08s ease both" }}>
            <div className="tpoa-ch">
              <div className="tpoa-ct">
                <div className="tpoa-ci" style={{ background:"#EBF2FD", border:"1px solid #C2D6FA" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                New Announcement
              </div>
              <button className={`tpoa-btn ${showForm ? "tpoa-btn-outline" : "tpoa-btn-primary"}`} style={{ height:34, fontSize:12 }} onClick={() => setShowForm(p => !p)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {showForm
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
                </svg>
                {showForm ? "Close" : "Add Announcement"}
              </button>
            </div>
            {showForm && (
              <div className="tpoa-cb">
                <AnnForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={postLoading} submitLabel="Post Announcement" />
              </div>
            )}
          </div>

          {/* ── List card ── */}
          <div className="tpoa-card" style={{ animation:"tpoaUp 0.45s 0.12s ease both" }}>
            <div className="tpoa-ch">
              <div className="tpoa-ct">
                <div className="tpoa-ci" style={{ background:"#FEF3C7", border:"1px solid #FDE68A" }}>
                  <IcoBell size={14} color="#D97706" sw={2.2} />
                </div>
                Posted Announcements
              </div>
              <div className="tpoa-tabs">
                {[
                  { id:"all",     label:`All (${announcements.length})` },
                  { id:"drive",   label:`Drives (${driveCount})` },
                  { id:"general", label:`General (${generalCount})` },
                ].map(t => (
                  <button key={t.id} className={`tpoa-tab${filterTab===t.id?" act":""}`} onClick={() => setFilterTab(t.id)}>{t.label}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
                {[1,2,3].map(i=>(
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div className="tpoa-sk" style={{ width:34, height:34, borderRadius:9, flexShrink:0 }}/>
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                      <div className="tpoa-sk" style={{ height:14, width:"38%" }}/>
                      <div className="tpoa-sk" style={{ height:11, width:"65%" }}/>
                      <div className="tpoa-sk" style={{ height:11, width:"50%" }}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : tabFiltered.length === 0 ? (
              <div className="tpoa-empty">
                <div className="tpoa-empty-ico"><IcoBell size={22} color="#3B7DED" sw={2} /></div>
                <div style={{ fontSize:14, fontWeight:700, color:"#0D1C33", marginBottom:4 }}>No announcements yet</div>
                <div style={{ fontSize:13, color:"#7A8599" }}>Use "Add Announcement" above to post one.</div>
              </div>
            ) : (
              tabFiltered.map((ann, i) => {
                const ts = TYPE_META[ann.type] || TYPE_META.general;
                const TagIcon = ts.Icon;
                return (
                  <div key={ann._id} className="tpoa-item" style={{ animation:`tpoaIn 0.35s ease ${i*40}ms both` }}>
                    <div className="tpoa-item-num">#{tabFiltered.length - i}</div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="tpoa-item-title">{ann.title}</div>
                      {ann.company && (
                        <div className="tpoa-item-co">
                          <IcoBuilding size={11} color="#3B7DED" sw={2} />
                          {ann.company}
                        </div>
                      )}
                      <div className="tpoa-item-desc">{ann.description}</div>
                      <div className="tpoa-item-tags">

                        {/* Type tag */}
                        <span className="tpoa-tag" style={{ background:ts.bg, color:ts.color, border:`1px solid ${ts.border}` }}>
                          <TagIcon size={11} color={ts.color} sw={2.2} />
                          {ts.label}
                        </span>

                        {/* All Students */}
                        {ann.allStudents && (
                          <span className="tpoa-tag" style={{ background:"#F0FDF4", color:"#16A34A", border:"1px solid #BBF7D0" }}>
                            <IcoUsers size={11} color="#16A34A" sw={2.2} />
                            All Students
                          </span>
                        )}

                        {/* Departments */}
                        {!ann.allStudents && ann.departments?.map(d => (
                          <span key={d} className="tpoa-tag" style={{ background:"#F0F2F6", color:"#4A5568", border:"1px solid #E2E4E9" }}>
                            <IcoHome size={10} color="#4A5568" sw={2.2} />
                            {d}
                          </span>
                        ))}

                        {/* Semesters */}
                        {!ann.allStudents && ann.semesters?.length > 0 && (
                          <span className="tpoa-tag" style={{ background:"#F5F3FF", color:"#7C3AED", border:"1px solid #DDD6FE" }}>
                            <IcoBook size={10} color="#7C3AED" sw={2.2} />
                            Sem: {ann.semesters.join(", ")}
                          </span>
                        )}

                        {/* Drive Date */}
                        {ann.driveDate && (
                          <span className="tpoa-tag" style={{ background:"#FEF3C7", color:"#92400E", border:"1px solid #FDE68A" }}>
                            <IcoCalendar size={10} color="#92400E" sw={2.2} />
                            {fmtDate(ann.driveDate)}
                          </span>
                        )}

                        <span style={{ fontSize:11, color:"#C0C8D5", marginLeft:2 }}>Posted {fmtDate(ann.createdAt)}</span>
                      </div>
                    </div>

                    <div className="tpoa-item-btns">
                      <button className="tpoa-btn tpoa-btn-edit tpoa-btn-sm" onClick={() => setEditTarget(ann)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button className="tpoa-btn tpoa-btn-danger tpoa-btn-sm" onClick={() => setDeleteTarget(ann)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {editTarget && (
        <EditModal ann={editTarget} onClose={() => setEditTarget(null)} onSaved={() => { setEditTarget(null); showToast("Announcement updated!"); fetchAll(); }} />
      )}

      {deleteTarget && (
        <DeleteModal ann={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={() => { setDeleteTarget(null); showToast("Announcement deleted."); fetchAll(); }} />
      )}

      {toast.msg && (
        <div className="tpoa-toast" style={{ borderColor: toast.type === "err" ? "#FECACA" : "#E2E4E9" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={toast.type === "err" ? "#DC2626" : "#16A34A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {toast.type === "err"
              ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              : <polyline points="20 6 9 17 4 12"/>}
          </svg>
          {toast.msg}
        </div>
      )}
    </div>
  );
}