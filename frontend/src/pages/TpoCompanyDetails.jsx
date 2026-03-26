import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TpoNavbar  from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import API from "../api";

/* ── inject styles once ── */
if (!document.getElementById("tcd-styles")) {
  const s = document.createElement("style");
  s.id = "tcd-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes tcdFadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tcdFadeUp   { from{opacity:0;transform:translateY(18px)}  to{opacity:1;transform:translateY(0)} }
    @keyframes tcdFadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes tcdLogoIn   { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
    @keyframes tcdShimmer  { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes tcdSkillIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
    @keyframes tcdPopIn    { from{opacity:0;transform:scale(0.95) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes tcdToastIn  { from{opacity:0;transform:translateY(12px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes tcdSpin     { to{transform:rotate(360deg)} }

    .tcd-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .tcd-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .tcd-body { flex:1; padding:32px 48px 64px; overflow-y:auto; }

    /* skeleton shimmer */
    .tcd-sk { background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%); background-size:200% 100%; animation:tcdShimmer 1.5s ease infinite; border-radius:6px; }

    /* back button */
    .tcd-back {
      display:inline-flex; align-items:center; gap:6px;
      background:none; border:none; cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600;
      color:#7A8599; padding:0; margin-bottom:24px;
      transition:color 0.18s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
      animation:tcdFadeIn 0.3s ease both;
    }
    .tcd-back:hover { color:#1B3A6B; transform:translateX(-3px); }

    /* hero card */
    .tcd-hero {
      background:#fff; border:1px solid #E2E4E9; border-radius:16px;
      overflow:hidden; margin-bottom:20px;
      box-shadow:0 2px 12px rgba(0,0,0,0.06);
      animation:tcdFadeDown 0.45s ease both;
    }
    .tcd-hero-bar { height:4px; background:linear-gradient(90deg,#1B3A6B,#3B7DED,#60A5FA); }
    .tcd-hero-body { padding:32px 40px; display:flex; align-items:center; gap:32px; }

    .tcd-logo-wrap {
      width:100px; height:100px; border-radius:16px; flex-shrink:0;
      background:#F9FAFB; border:1px solid #E2E4E9;
      display:flex; align-items:center; justify-content:center;
      overflow:hidden; position:relative;
      box-shadow:0 2px 10px rgba(0,0,0,0.07);
    }
    .tcd-logo-img {
      width:100%; height:100%; object-fit:contain; padding:12px;
      opacity:0; transform:scale(0.85);
      transition:opacity 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .tcd-logo-img.loaded { opacity:1; transform:scale(1); }

    .tcd-company-name {
      font-size:30px; font-weight:800; color:#0D1C33;
      letter-spacing:-0.8px; line-height:1.15; margin-bottom:10px;
      animation:tcdFadeDown 0.45s 0.15s ease both;
    }
    .tcd-eyebrow {
      font-size:10px; font-weight:700; letter-spacing:2.5px;
      text-transform:uppercase; color:#7A8599; margin-bottom:8px;
      animation:tcdFadeDown 0.4s 0.1s ease both;
    }
    .tcd-badges { display:flex; gap:8px; flex-wrap:wrap; animation:tcdFadeUp 0.4s 0.2s ease both; }
    .tcd-badge  { display:inline-flex; align-items:center; gap:5px; padding:4px 12px 4px 8px; border-radius:20px; font-size:10.5px; font-weight:700; }

    /* stat cards */
    .tcd-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
    .tcd-stat  {
      background:#fff; border:1px solid #E2E4E9; border-radius:12px;
      padding:20px 22px; display:flex; align-items:center; gap:16px;
      box-shadow:0 1px 3px rgba(0,0,0,0.05);
      transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);
      cursor:default;
    }
    .tcd-stat:hover { box-shadow:0 6px 20px rgba(0,0,0,0.09); transform:translateY(-2px); }
    .tcd-stat-ico {
      width:42px; height:42px; border-radius:10px;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
      transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
    }
    .tcd-stat:hover .tcd-stat-ico { transform:scale(1.1) rotate(-5deg); }
    .tcd-stat-lbl { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#B0BAC8; margin-bottom:4px; font-family:'Plus Jakarta Sans',sans-serif; }
    .tcd-stat-val { font-size:18px; font-weight:700; color:#0D1C33; font-family:'Plus Jakarta Sans',sans-serif; letter-spacing:-0.3px; }

    /* bottom row */
    .tcd-bottom { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .tcd-panel  {
      background:#fff; border:1px solid #E2E4E9; border-radius:12px;
      padding:24px 26px; box-shadow:0 1px 4px rgba(0,0,0,0.04);
    }
    .tcd-panel-head { display:flex; align-items:center; gap:8px; margin-bottom:16px; justify-content:space-between; }
    .tcd-panel-label { display:flex; align-items:center; gap:8px; }
    .tcd-panel-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
    .tcd-panel-title { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#7A8599; font-family:'Plus Jakarta Sans',sans-serif; }

    /* skill tags */
    .tcd-skill-tag {
      display:inline-flex; align-items:center; gap:5px;
      padding:5px 12px; border-radius:6px;
      font-size:12px; font-weight:600; cursor:default;
      transition:all 0.18s cubic-bezier(0.34,1.56,0.64,1);
    }
    .tcd-skill-tag:hover { transform:translateY(-1px); }

    /* edit/delete buttons */
    .tcd-action-btn {
      display:inline-flex; align-items:center; gap:6px;
      height:36px; padding:0 16px; border-radius:8px; cursor:pointer; border:none;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700;
      transition:transform 0.15s, box-shadow 0.15s, background 0.15s;
    }
    .tcd-action-btn:hover { transform:translateY(-1px); }
    .tcd-btn-edit   { background:#EBF2FD; color:#1B3A6B; border:1px solid #C2D6FA; }
    .tcd-btn-edit:hover { background:#D6E8FC; }
    .tcd-btn-delete { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; }
    .tcd-btn-delete:hover { background:#FEE2E2; }

    /* modal */
    .tcd-overlay { position:fixed; inset:0; z-index:400; background:rgba(0,0,0,0.4); backdrop-filter:blur(2px); display:flex; align-items:center; justify-content:center; animation:tcdFadeIn 0.2s ease both; }
    .tcd-modal   { background:#fff; border-radius:18px; padding:28px; width:500px; box-shadow:0 24px 64px rgba(0,0,0,0.18); font-family:'Plus Jakarta Sans',sans-serif; animation:tcdPopIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
    .tcd-modal-title { font-size:15px; font-weight:800; color:#0D1C33; margin-bottom:18px; display:flex; align-items:center; gap:10px; }
    .tcd-modal-icon  { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; }

    /* form fields */
    .tcd-fg  { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
    .tcd-fw  { grid-column:1/-1; }
    .tcd-field { display:flex; flex-direction:column; gap:5px; }
    .tcd-lbl   { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; }
    .tcd-iw    { height:40px; border:1px solid #E2E4E9; border-radius:8px; background:#F9FAFB; padding:0 12px; display:flex; align-items:center; gap:8px; transition:border-color 0.18s, box-shadow 0.18s, background 0.18s; }
    .tcd-iw:focus-within { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .tcd-in  { flex:1; border:none; background:transparent; outline:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; }
    .tcd-in::placeholder { color:#C0C8D5; }
    .tcd-ta  { width:100%; border:1px solid #E2E4E9; border-radius:8px; padding:10px 12px; background:#F9FAFB; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; outline:none; resize:vertical; min-height:80px; transition:border-color 0.18s, box-shadow 0.18s, background 0.18s; }
    .tcd-ta:focus { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .tcd-ta::placeholder { color:#C0C8D5; }

    /* skill chip input */
    .tcd-sk-wrap { min-height:40px; border:1px solid #E2E4E9; border-radius:8px; background:#F9FAFB; padding:4px 10px; display:flex; align-items:center; flex-wrap:wrap; gap:5px; transition:border-color 0.18s, box-shadow 0.18s, background 0.18s; cursor:text; }
    .tcd-sk-wrap:focus-within { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .tcd-sk-chip { display:inline-flex; align-items:center; gap:5px; background:#EBF2FD; border:1px solid #C2D6FA; border-radius:5px; padding:2px 8px; font-size:11px; font-weight:700; color:#1B3A6B; }
    .tcd-sk-x    { background:none; border:none; cursor:pointer; color:#7A8599; padding:0; line-height:1; display:flex; align-items:center; transition:color 0.12s; }
    .tcd-sk-x:hover { color:#DC2626; }
    .tcd-sk-in   { flex:1; min-width:80px; border:none; background:transparent; outline:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; }
    .tcd-sk-in::placeholder { color:#C0C8D5; }

    /* modal buttons */
    .tcd-mb-row { display:flex; gap:10px; justify-content:flex-end; margin-top:16px; }
    .tcd-mb-btn { height:40px; padding:0 18px; border-radius:8px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:7px; border:none; transition:transform 0.15s, box-shadow 0.15s; }
    .tcd-mb-btn:hover { transform:translateY(-1px); }
    .tcd-mb-cancel { background:#F0F2F6; color:#4A5568; border:1px solid #E2E4E9; }
    .tcd-mb-save   { background:linear-gradient(135deg,#1B3A6B,#2563EB); color:#fff; box-shadow:0 3px 10px rgba(27,58,107,0.2); }
    .tcd-mb-del    { background:linear-gradient(135deg,#DC2626,#EF4444); color:#fff; box-shadow:0 3px 10px rgba(220,38,38,0.2); }
    .tcd-spinner   { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.4); border-top-color:#fff; animation:tcdSpin 0.7s linear infinite; }

    /* inline skill add row */
    .tcd-add-skill-row { display:flex; gap:8px; align-items:center; border-top:1px solid #F0F2F6; padding-top:12px; margin-top:4px; }
    .tcd-add-skill-iw  { flex:1; height:36px; display:flex; align-items:center; border:1px solid #E2E4E9; border-radius:7px; background:#F9FAFB; padding:0 10px; gap:6px; transition:border-color 0.18s; }
    .tcd-add-skill-iw:focus-within { border-color:#3B7DED; }
    .tcd-add-skill-in  { flex:1; border:none; background:transparent; outline:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; }
    .tcd-add-skill-in::placeholder { color:#C0C8D5; }
    .tcd-add-skill-btn { height:36px; padding:0 14px; border:none; border-radius:7px; background:linear-gradient(135deg,#1B3A6B,#2563EB); color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:5px; }

    /* toast */
    .tcd-toast { position:fixed; bottom:28px; right:28px; z-index:999; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #E2E4E9; border-radius:12px; padding:12px 16px; box-shadow:0 8px 28px rgba(0,0,0,0.1); animation:tcdToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; font-size:13px; font-weight:600; color:#0D1C33; font-family:'Plus Jakarta Sans',sans-serif; }

    /* ── Mobile Responsive ── */
    @media (max-width: 768px) {
      .tcd-body { padding: 16px 16px 48px; }

      /* top action bar */
      .tcd-body > div:first-child {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 10px;
        margin-bottom: 16px !important;
      }
      .tcd-body > div:first-child > div {
        width: 100%;
        justify-content: flex-start;
      }

      /* hero */
      .tcd-hero-body {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 20px 18px;
      }
      .tcd-logo-wrap { width: 72px; height: 72px; border-radius: 12px; }
      .tcd-company-name { font-size: 22px; }
      .tcd-eyebrow { font-size: 9px; }
      .tcd-badge { font-size: 10px; }

      /* stats */
      .tcd-stats { grid-template-columns: 1fr; gap: 10px; margin-bottom: 12px; }
      .tcd-stat  { padding: 14px 16px; }
      .tcd-stat-val { font-size: 16px; }

      /* bottom panels */
      .tcd-bottom { grid-template-columns: 1fr; gap: 10px; }
      .tcd-panel  { padding: 18px 16px; }

      /* edit modal */
      .tcd-modal {
        width: calc(100vw - 24px);
        padding: 20px 16px;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 14px;
      }
      .tcd-fg { grid-template-columns: 1fr; }
      .tcd-mb-row { flex-direction: column-reverse; }
      .tcd-mb-btn { width: 100%; justify-content: center; }

      /* action buttons row */
      .tcd-btn-edit, .tcd-btn-delete { height: 32px; font-size: 12px; padding: 0 12px; }

      /* toast */
      .tcd-toast { right: 12px; bottom: 12px; left: 12px; }

      /* add skill row */
      .tcd-add-skill-row { flex-wrap: wrap; }
      .tcd-add-skill-btn { width: 100%; justify-content: center; }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .tcd-body   { padding: 20px 24px 48px; }
      .tcd-stats  { grid-template-columns: repeat(2, 1fr); }
      .tcd-bottom { grid-template-columns: 1fr; }
      .tcd-hero-body { padding: 24px; gap: 20px; }
      .tcd-modal  { width: calc(100vw - 48px); max-width: 500px; }
    }
  `;
  document.head.appendChild(s);
}

/* ── helpers ── */
const LOGO_MAP = {
  google:"google.com", microsoft:"microsoft.com", amazon:"amazon.com",
  apple:"apple.com", meta:"meta.com", infosys:"infosys.com", wipro:"wipro.com",
  tcs:"tcs.com", accenture:"accenture.com", ibm:"ibm.com", oracle:"oracle.com",
  salesforce:"salesforce.com", nvidia:"nvidia.com", siemens:"siemens.com",
  "morgan stanley":"morganstanley.com", servicenow:"servicenow.com",
  snowflake:"snowflake.com", deutsche:"db.com", cadence:"cadence.com",
  "applied materials":"appliedmaterials.com", druva:"druva.com",
  persistent:"persistent.com", hsbc:"hsbc.com", whirlpool:"whirlpool.com",
};
const INIT_COLORS = ["#2563EB","#0891B2","#059669","#7C3AED","#DB2777","#D97706"];
function getLogoUrl(name="") {
  const n = name.toLowerCase();
  for (const [k,d] of Object.entries(LOGO_MAP)) if (n.includes(k)) return `https://logo.clearbit.com/${d}`;
  return `https://logo.clearbit.com/${n.replace(/\s+/g,"").replace(/[^a-z0-9]/g,"")}.com`;
}
function getInitColor(name="") { return INIT_COLORS[name.charCodeAt(0) % INIT_COLORS.length]; }
function getInitials(name="") { return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

const SKILL_COLORS = [
  {bg:"#EBF2FD",color:"#1B3A6B",border:"#C7D9F5"},
  {bg:"#E6F7F5",color:"#0D6B5E",border:"#AADDD9"},
  {bg:"#FEF3C7",color:"#92400E",border:"#FDE68A"},
  {bg:"#F3E8FF",color:"#6D28D9",border:"#DDD6FE"},
  {bg:"#FFE4E6",color:"#9F1239",border:"#FECDD3"},
  {bg:"#ECFDF5",color:"#065F46",border:"#A7F3D0"},
];

const tk = () => ({ headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } });

/* ── Skeleton ── */
function Skeleton() {
  const sh = { background:"linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%)", backgroundSize:"200% 100%", animation:"tcdShimmer 1.5s ease infinite", borderRadius:6 };
  return (
    <div style={{ padding:"32px 48px", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:14, padding:"36px 40px", marginBottom:20, border:"1px solid #E2E4E9", display:"flex", gap:32, alignItems:"center" }}>
        <div style={{ width:96, height:96, borderRadius:16, ...sh, flexShrink:0 }} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ height:14, width:"20%", ...sh }} />
          <div style={{ height:28, width:"40%", ...sh }} />
          <div style={{ height:26, width:"30%", ...sh }} />
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[1,2,3].map(i => <div key={i} style={{ background:"#fff", borderRadius:12, padding:22, border:"1px solid #E2E4E9", ...sh, height:80 }} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[1,2].map(i => <div key={i} style={{ background:"#fff", borderRadius:12, padding:24, border:"1px solid #E2E4E9", height:160, ...sh }} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════
   Main Page
═══════════════════════════ */
export default function TpoCompanyDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [company,      setCompany]      = useState(null);
  const [imgErr,       setImgErr]       = useState(false);
  const [imgLoaded,    setImgLoaded]    = useState(false);
  const [btnHover,     setBtnHover]     = useState(false);
  const [skills,       setSkills]       = useState([]);
  const [newSkill,     setNewSkill]     = useState("");
  const [showEdit,     setShowEdit]     = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState("");

  /* edit form */
  const [form, setForm] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [editSkills, setEditSkills] = useState([]);

  useEffect(() => {
    API.get(`/company/${id}`, tk())
      .then(res => {
        setCompany(res.data);
        setSkills(res.data.requiredSkills || []);
        setForm({
          companyName:  res.data.companyName  || "",
          salary:       res.data.salary       || "",
          offers:       res.data.offers       || "",
          minimumCGPA:  res.data.minimumCGPA  || "",
          description:  res.data.description  || "",
        });
        setEditSkills(res.data.requiredSkills || []);
      })
      .catch(err => console.error(err));
  }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  /* save edits */
  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await API.put(`/company/${id}`,
        { ...form, requiredSkills: editSkills }, tk());
      setCompany(res.data);
      setSkills(res.data.requiredSkills || editSkills);
      setShowEdit(false);
      showToast("Company updated successfully!");
    } catch { showToast("Failed to save."); }
    finally { setSaving(false); }
  };

  /* inline add skill */
  const addSkill = async () => {
    const val = newSkill.trim();
    if (!val || skills.includes(val)) return;
    const updated = [...skills, val];
    setSkills(updated);
    setNewSkill("");
    try {
      await API.put(`/company/${id}`, { requiredSkills: updated }, tk());
      showToast(`Added "${val}"`);
    } catch { setSkills(skills); }
  };

  const removeSkill = async (skill) => {
    const updated = skills.filter(s => s !== skill);
    setSkills(updated);
    try {
      await API.put(`/company/${id}`, { requiredSkills: updated }, tk());
      showToast(`Removed "${skill}"`);
    } catch { setSkills(skills); }
  };

  /* delete company */
  const deleteCompany = async () => {
    setDeleting(true);
    try {
      await API.delete(`/company/${id}`, tk());
      navigate("/admin/companies");
    } catch { setDeleting(false); }
  };

  /* edit modal skill chip input */
  const handleEditSkillKey = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, "");
      if (val && !editSkills.includes(val)) setEditSkills(p => [...p, val]);
      setSkillInput("");
    }
    if (e.key === "Backspace" && !skillInput && editSkills.length)
      setEditSkills(p => p.slice(0,-1));
  };

  if (!company) {
    return (
      <div className="tcd-root">
        <TpoSidebar />
        <div className="tcd-main"><TpoNavbar /><Skeleton /></div>
      </div>
    );
  }

  const logoUrl  = company.logo || getLogoUrl(company.companyName);
  const color    = getInitColor(company.companyName);
  const initials = getInitials(company.companyName);

  return (
    <div className="tcd-root">
      <TpoSidebar />
      <div className="tcd-main">
        <TpoNavbar />
        <div className="tcd-body">

          {/* ── Top action bar ── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, animation:"tcdFadeIn 0.3s ease both" }}>
            {/* back */}
            <button
              className="tcd-back"
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              onClick={() => navigate("/admin/companies")}
              style={{ color: btnHover ? "#1B3A6B" : "#7A8599", transform: btnHover ? "translateX(-3px)" : "translateX(0)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                style={{ transition:"transform 0.2s", transform: btnHover ? "translateX(-2px)" : "translateX(0)" }}>
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Companies
            </button>

            {/* admin actions */}
            <div style={{ display:"flex", gap:9 }}>
              <button className="tcd-action-btn tcd-btn-edit" onClick={() => setShowEdit(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button className="tcd-action-btn tcd-btn-delete" onClick={() => setShowDelModal(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* ── Hero card ── */}
          <div className="tcd-hero">
            <div className="tcd-hero-bar" />
            <div className="tcd-hero-body">
              {/* logo */}
              <div className="tcd-logo-wrap">
                {!imgErr ? (
                  <img src={logoUrl} alt={company.companyName}
                    className={`tcd-logo-img${imgLoaded?" loaded":""}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgErr(true)}
                  />
                ) : (
                  <span style={{ fontSize:28, fontWeight:800, color, fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:-1 }}>
                    {initials}
                  </span>
                )}
              </div>

              {/* info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div className="tcd-eyebrow">Campus Recruitment · 2025 — Admin View</div>
                <h1 className="tcd-company-name">{company.companyName}</h1>
                <div className="tcd-badges">
                  <span className="tcd-badge" style={{ background:"#ECFDF5", color:"#16A34A", border:"1px solid #BBF7D0" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#16A34A" }} />
                    Actively Recruiting
                  </span>
                  {company.offers > 0 && (
                    <span className="tcd-badge" style={{ background:"#EBF2FD", color:"#1B3A6B", border:"1px solid #C2D6FA" }}>
                      👥 {company.offers} Offers Last Year
                    </span>
                  )}
                  <span className="tcd-badge" style={{ background:"#FEF3C7", color:"#92400E", border:"1px solid #FDE68A" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#D97706" }} />
                    TPO Admin Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="tcd-stats">
            {[
              { label:"Package",            value:`${company.salary} LPA`,       color:"#1B3A6B", bg:"#EBF2FD", bc:"#C2D6FA",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
              { label:"Minimum CGPA",       value:company.minimumCGPA || "N/A",  color:"#0D9A8A", bg:"#E6F7F5", bc:"#AADDD9",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
              { label:"Total Offers [Last Year]", value:company.offers || "—",  color:"#7C3AED", bg:"#F3E8FF", bc:"#DDD6FE",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
            ].map((st, i) => (
              <div className="tcd-stat" key={i} style={{ animation:`tcdFadeUp 0.45s ease ${0.1+i*0.06}s both` }}>
                <div className="tcd-stat-ico" style={{ background:st.bg, color:st.color, border:`1px solid ${st.bc}` }}>
                  {st.icon}
                </div>
                <div>
                  <div className="tcd-stat-lbl">{st.label}</div>
                  <div className="tcd-stat-val">{st.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom row: description + skills ── */}
          <div className="tcd-bottom">
            {/* Description */}
            <div className="tcd-panel" style={{ animation:"tcdFadeUp 0.45s 0.28s ease both" }}>
              <div className="tcd-panel-head">
                <div className="tcd-panel-label">
                  <div className="tcd-panel-icon" style={{ background:"#EBF2FD", color:"#3B7DED" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <span className="tcd-panel-title">About the Role</span>
                </div>
                <button className="tcd-action-btn tcd-btn-edit" style={{ height:30, fontSize:11, padding:"0 10px" }} onClick={() => setShowEdit(true)}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
              </div>
              <p style={{ fontSize:13.5, lineHeight:1.75, color:"#4A5568", margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                {company.description || "No description provided. Click Edit to add one."}
              </p>
            </div>

            {/* Skills */}
            <div className="tcd-panel" style={{ animation:"tcdFadeUp 0.45s 0.34s ease both" }}>
              <div className="tcd-panel-head">
                <div className="tcd-panel-label">
                  <div className="tcd-panel-icon" style={{ background:"#F3E8FF", color:"#7C3AED" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <span className="tcd-panel-title">Required Skills</span>
                </div>
              </div>

              {/* skill tags */}
              {skills.length > 0 ? (
                <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:14 }}>
                  {skills.map((skill, i) => {
                    const c = SKILL_COLORS[i % SKILL_COLORS.length];
                    return (
                      <span
                        key={i}
                        className="tcd-skill-tag"
                        style={{
                          background: c.bg,
                          color: c.color,
                          border: `1px solid ${c.border}`,
                          animation: `tcdSkillIn 0.35s ease ${0.05 * i}s both`,
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                          <circle cx="4" cy="4" r="3"/>
                        </svg>
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "currentColor",
                            padding: "0 0 0 3px",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            opacity: 0.7
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize:13.5, color:"#7A8599", marginBottom:14, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  No skills listed.
                </p>
              )}

              {/* add skill inline */}
              <div className="tcd-add-skill-row">
                <div className="tcd-add-skill-iw">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C0C8D5" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <input
                    className="tcd-add-skill-in"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addSkill()}
                    placeholder="Add skill…"
                    onFocus={e => e.target.parentNode.style.borderColor="#3B7DED"}
                    onBlur={e => e.target.parentNode.style.borderColor="#E2E4E9"}
                  />
                </div>
                <button className="tcd-add-skill-btn" onClick={addSkill}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Edit Modal ── */}
      {showEdit && (
        <div className="tcd-overlay" onClick={() => setShowEdit(false)}>
          <div className="tcd-modal" onClick={e => e.stopPropagation()}>
            <div className="tcd-modal-title">
              <div className="tcd-modal-icon" style={{ background:"#EBF2FD", border:"1px solid #C2D6FA" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              Edit Company
              <button onClick={() => setShowEdit(false)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#B0BAC8" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ fontSize:11.5, color:"#7A8599", marginBottom:18 }}>Changes are reflected for all students immediately.</div>

            <div className="tcd-fg">
              {[["Company Name","companyName","text","e.g. Infosys"],["Salary (LPA)","salary","number","e.g. 12"],["No. of Offers","offers","number","e.g. 5"],["Minimum CGPA","minimumCGPA","number","e.g. 7.5"]].map(([lbl,key,type,ph]) => (
                <div className="tcd-field" key={key}>
                  <label className="tcd-lbl">{lbl}</label>
                  <div className="tcd-iw"><input className="tcd-in" type={type} placeholder={ph} value={form[key]||""} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} /></div>
                </div>
              ))}
              <div className="tcd-field tcd-fw">
                <label className="tcd-lbl">Description</label>
                <textarea className="tcd-ta" placeholder="About the role…" value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))} />
              </div>
              <div className="tcd-field tcd-fw">
                <label className="tcd-lbl">Required Skills — Enter or comma to add</label>
                <div className="tcd-sk-wrap" onClick={e=>e.currentTarget.querySelector("input").focus()}>
                  {editSkills.map(sk => (
                    <span key={sk} className="tcd-sk-chip">
                      {sk}
                      <button className="tcd-sk-x" onClick={()=>setEditSkills(p=>p.filter(x=>x!==sk))}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </span>
                  ))}
                  <input
                    className="tcd-sk-in"
                    placeholder={editSkills.length===0?"e.g. React, Node.js…":""}
                    value={skillInput}
                    onChange={e=>setSkillInput(e.target.value)}
                    onKeyDown={handleEditSkillKey}
                    onBlur={()=>{ if(skillInput.trim()){ setEditSkills(p=>[...new Set([...p,skillInput.trim()])]); setSkillInput(""); }}}
                  />
                </div>
              </div>
            </div>

            <div className="tcd-mb-row">
              <button className="tcd-mb-btn tcd-mb-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
              <button className="tcd-mb-btn tcd-mb-save" onClick={saveEdit} disabled={saving}>
                {saving ? <><div className="tcd-spinner"/>Saving…</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><polyline points="20 6 9 17 4 12"/></svg>Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {showDelModal && (
        <div className="tcd-overlay" onClick={() => setShowDelModal(false)}>
          <div className="tcd-modal" onClick={e => e.stopPropagation()}>
            <div style={{ width:44, height:44, borderRadius:11, background:"#FEF2F2", border:"1px solid #FECACA", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:"#0D1C33", marginBottom:8 }}>Delete {company.companyName}?</div>
            <div style={{ fontSize:13, color:"#7A8599", lineHeight:1.6, marginBottom:24 }}>
              This will permanently remove <strong>{company.companyName}</strong> and all associated data. Students will no longer see this company.
            </div>
            <div className="tcd-mb-row">
              <button className="tcd-mb-btn tcd-mb-cancel" onClick={() => setShowDelModal(false)}>Cancel</button>
              <button className="tcd-mb-btn tcd-mb-del" onClick={deleteCompany} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="tcd-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}