import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TpoNavbar  from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import API from "../api";

if (!document.getElementById("tpod-pro-styles")) {
  const s = document.createElement("style");
  s.id = "tpod-pro-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    /* ── Keyframes ── */
    @keyframes tdSlideUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tdFadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes tdCountUp  { from{opacity:0;transform:translateY(8px) scale(0.9)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes tdBarFill  { from{width:0;opacity:0} to{opacity:1} }
    @keyframes tdShimmer  { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes tdSpin     { to{transform:rotate(360deg)} }
    @keyframes tdToastIn  { from{opacity:0;transform:translateY(14px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes tdPulse    { 0%,100%{opacity:1} 50%{opacity:0.6} }
    @keyframes tdCardIn   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

    /* ── Layout ── */
    .d-root { display:flex; min-height:100vh; background:#F0F2F7; font-family:'Plus Jakarta Sans',sans-serif; }
    .d-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
    .d-body { flex:1; padding:28px 40px 72px; overflow-y:auto; }

    /* ── Welcome banner ── */
    .d-banner {
      background:linear-gradient(135deg,#0D1F4E 0%,#1B3A6B 45%,#2563EB 100%);
      border-radius:18px; padding:28px 36px;
      display:flex; align-items:center; justify-content:space-between;
      margin-bottom:24px; position:relative; overflow:hidden;
      animation:tdSlideUp 0.5s ease both;
      box-shadow:0 8px 32px rgba(27,58,107,0.28);
    }
    .d-banner::before {
      content:''; position:absolute; right:-60px; top:-60px;
      width:260px; height:260px; border-radius:50%;
      background:rgba(255,255,255,0.04); pointer-events:none;
    }
    .d-banner::after {
      content:''; position:absolute; right:80px; bottom:-80px;
      width:180px; height:180px; border-radius:50%;
      background:rgba(255,255,255,0.03); pointer-events:none;
    }
    .d-banner-left { position:relative; z-index:1; }
    .d-banner-tag  { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); border-radius:20px; padding:4px 12px; font-size:10.5px; font-weight:700; color:rgba(255,255,255,0.85); letter-spacing:0.5px; text-transform:uppercase; margin-bottom:10px; }
    .d-banner-dot  { width:6px; height:6px; border-radius:50%; background:#34D399; animation:tdPulse 2s ease infinite; }
    .d-banner-title{ font-size:24px; font-weight:800; color:#fff; letter-spacing:-0.5px; line-height:1.2; margin-bottom:6px; }
    .d-banner-sub  { font-size:13px; color:rgba(255,255,255,0.65); font-weight:400; }
    .d-banner-right { display:flex; gap:10px; position:relative; z-index:1; }
    .d-banner-btn  {
      height:38px; padding:0 18px; border-radius:10px; cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700;
      display:inline-flex; align-items:center; gap:7px;
      transition:transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s;
      border:none; white-space:nowrap;
    }
    .d-banner-btn:hover { transform:translateY(-2px); }
    .d-banner-btn-primary { background:#fff; color:#1B3A6B; box-shadow:0 4px 14px rgba(0,0,0,0.15); }
    .d-banner-btn-outline { background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.22); }
    .d-banner-btn-outline:hover { background:rgba(255,255,255,0.18); }

    /* ── Stat cards ── */
    .d-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; animation:tdSlideUp 0.5s 0.06s ease both; }
    .d-stat  {
      background:#fff; border-radius:16px; padding:20px 22px;
      border:1px solid #E8EDF3;
      box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
      transition:box-shadow 0.22s, transform 0.22s;
      position:relative; overflow:hidden;
    }
    .d-stat:hover { box-shadow:0 8px 28px rgba(0,0,0,0.1); transform:translateY(-3px); }
    .d-stat-accent { position:absolute; top:0; left:0; right:0; height:3px; border-radius:16px 16px 0 0; }
    .d-stat-top    { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .d-stat-ico    { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
    .d-stat-trend  { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; font-size:10.5px; font-weight:700; }
    .d-stat-val    { font-size:28px; font-weight:800; color:#0D1C33; letter-spacing:-1px; line-height:1; margin-bottom:4px; animation:tdCountUp 0.6s ease both; }
    .d-stat-lbl    { font-size:12px; color:#8A94A6; font-weight:500; }

    /* ── Section label ── */
    .d-section { font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#8A94A6; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
    .d-section::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#E8EDF3,transparent); }

    /* ── Quick nav cards ── */
    .d-nav-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:28px; animation:tdSlideUp 0.5s 0.1s ease both; }
    .d-nav-card {
      background:#fff; border-radius:14px; padding:20px 22px;
      border:1px solid #E8EDF3; cursor:pointer;
      display:flex; align-items:center; gap:16px;
      box-shadow:0 1px 3px rgba(0,0,0,0.04);
      transition:box-shadow 0.22s, transform 0.22s, border-color 0.15s;
    }
    .d-nav-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.09); transform:translateY(-2px); border-color:#C7D9F5; }
    .d-nav-ico  { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .d-nav-text { flex:1; min-width:0; }
    .d-nav-title{ font-size:14px; font-weight:800; color:#0D1C33; margin-bottom:3px; }
    .d-nav-sub  { font-size:11.5px; color:#8A94A6; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .d-nav-arrow{ color:#C8D0DC; transition:transform 0.18s, color 0.15s; flex-shrink:0; }
    .d-nav-card:hover .d-nav-arrow { transform:translateX(4px); color:#3B7DED; }

    /* ── Analytics 2-col ── */
    .d-analytics { display:grid; grid-template-columns:1.1fr 0.9fr; gap:16px; margin-bottom:24px; animation:tdSlideUp 0.5s 0.14s ease both; }

    /* ── Card shell ── */
    .d-card {
      background:#fff; border-radius:16px; overflow:hidden;
      border:1px solid #E8EDF3;
      box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    }
    .d-card-head { padding:16px 22px; border-bottom:1px solid #F0F3F8; display:flex; align-items:center; justify-content:space-between; }
    .d-card-title{ font-size:14px; font-weight:800; color:#0D1C33; display:flex; align-items:center; gap:9px; }
    .d-card-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .d-card-body { padding:20px 22px; }

    /* ── Dept bars ── */
    .d-dept-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #F5F7FB; }
    .d-dept-row:last-child { border-bottom:none; }
    .d-dept-name { font-size:12px; font-weight:700; color:#0D1C33; width:68px; flex-shrink:0; }
    .d-dept-track{ flex:1; height:9px; background:#F0F3F8; border-radius:5px; overflow:hidden; position:relative; }
    .d-dept-fill { height:100%; border-radius:5px; animation:tdBarFill 0.9s cubic-bezier(0.22,1,0.36,1) both; }
    .d-dept-val  { font-size:12.5px; font-weight:800; color:#0D1C33; min-width:28px; text-align:right; flex-shrink:0; }
    .d-dept-badge{ font-size:10px; font-weight:700; padding:2px 7px; border-radius:4px; flex-shrink:0; }

    /* ── Mini summary chips ── */
    .d-chips { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:18px; }
    .d-chip  { background:#F8FAFB; border:1px solid #EEF1F6; border-radius:10px; padding:11px 14px; }
    .d-chip-val { font-size:17px; font-weight:800; color:#0D1C33; letter-spacing:-0.4px; line-height:1; }
    .d-chip-lbl { font-size:10px; color:#8A94A6; margin-top:3px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px; }

    /* ── Company table ── */
    .d-co-grid { display:grid; margin-bottom:24px; animation:tdSlideUp 0.5s 0.18s ease both; }
    .d-co-head { display:grid; grid-template-columns:28px 1fr 110px 90px 90px; gap:14px; align-items:center; padding:8px 22px 12px; border-bottom:1px solid #F0F3F8; margin:0 0 2px; }
    .d-co-th   { font-size:9.5px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#B0BAC8; }
    .d-co-row  { display:grid; grid-template-columns:28px 1fr 110px 90px 90px; gap:14px; align-items:center; padding:13px 22px; border-bottom:1px solid #F5F7FB; cursor:pointer; transition:background 0.12s; }
    .d-co-row:last-child { border-bottom:none; }
    .d-co-row:hover { background:#F8FAFB; }
    .d-co-rank { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#fff; flex-shrink:0; }
    .d-co-name { font-size:13px; font-weight:700; color:#0D1C33; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .d-co-bar-wrap { height:5px; background:#F0F3F8; border-radius:3px; overflow:hidden; margin-top:5px; }
    .d-co-bar-fill { height:100%; border-radius:3px; animation:tdBarFill 1s cubic-bezier(0.22,1,0.36,1) both; }
    .d-co-pkg  { font-size:13px; font-weight:800; color:#16A34A; display:flex; align-items:center; gap:4px; }
    .d-co-cgpa { font-size:12px; color:#7A8599; font-weight:600; }
    .d-co-tag  { font-size:10px; font-weight:700; background:#EBF2FD; color:#1B3A6B; border-radius:4px; padding:2px 7px; display:inline-block; }

    /* ── Skeleton ── */
    .d-sk { background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%); background-size:200% 100%; animation:tdShimmer 1.5s ease infinite; border-radius:6px; }

    /* ── Toast ── */
    .d-toast { position:fixed; bottom:28px; right:28px; z-index:999; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #E8EDF3; border-radius:12px; padding:12px 16px; box-shadow:0 8px 28px rgba(0,0,0,0.1); animation:tdToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; font-size:13px; font-weight:600; color:#0D1C33; font-family:'Plus Jakarta Sans',sans-serif; }

    /* ── Empty ── */
    .d-empty { padding:40px 20px; text-align:center; color:#B0BAC8; font-size:13px; }


    /* ══════════════════════════════════════════
       MOBILE RESPONSIVE — breakpoints
       ══════════════════════════════════════════ */

    /* ── Tablet: ≤ 1024px ── */
    @media (max-width: 1024px) {
      .d-body { padding:20px 24px 60px; }
      .d-stats { grid-template-columns:repeat(2,1fr); }
      .d-analytics { grid-template-columns:1fr; }
      .d-co-head,
      .d-co-row { grid-template-columns:28px 1fr 100px 80px; }
      .d-co-head > .d-co-th:last-child,
      .d-co-row  > div:last-child { display:none; }
    }

    /* ── Mobile landscape / small tablet: ≤ 768px ── */
    @media (max-width: 768px) {
      .d-body { padding:16px 16px 72px; }

      /* Banner stacks vertically */
      .d-banner { flex-direction:column; align-items:flex-start; gap:18px; padding:22px 20px; border-radius:14px; }
      .d-banner-title { font-size:20px; }
      .d-banner-right { width:100%; flex-wrap:wrap; }
      .d-banner-btn { flex:1; justify-content:center; min-width:120px; height:40px; font-size:12px; }

      /* 2-col stat cards */
      .d-stats { grid-template-columns:repeat(2,1fr); gap:10px; }
      .d-stat { padding:16px 16px; }
      .d-stat-val { font-size:24px; }

      /* Nav grid 1-col */
      .d-nav-grid { grid-template-columns:1fr; gap:10px; }
      .d-nav-card { padding:16px 18px; }

      /* Chips 2-col */
      .d-chips { grid-template-columns:repeat(2,1fr); }

      /* Analytics always single col */
      .d-analytics { grid-template-columns:1fr; }

      /* Company table: hide Min CGPA col too */
      .d-co-head,
      .d-co-row { grid-template-columns:28px 1fr 90px; gap:10px; padding:11px 16px; }
      .d-co-head > .d-co-th:nth-child(4),
      .d-co-head > .d-co-th:nth-child(5),
      .d-co-row  > div:nth-child(4),
      .d-co-row  > div:nth-child(5) { display:none; }

      .d-card-head { padding:14px 16px; flex-wrap:wrap; gap:8px; }
      .d-card-body { padding:16px; }

      /* Top companies header badges wrap */
      .d-card-head > div:last-child { flex-wrap:wrap; gap:6px; }

      /* Toast full width on mobile */
      .d-toast { left:16px; right:16px; bottom:16px; }

      .d-dept-name { width:52px; font-size:11px; }
    }

    /* ── Mobile portrait: ≤ 480px ── */
    @media (max-width: 480px) {
      .d-body { padding:12px 12px 80px; }

      .d-banner { padding:18px 16px; border-radius:12px; }
      .d-banner-title { font-size:18px; }
      .d-banner-sub { font-size:12px; }
      .d-banner-btn { font-size:11.5px; height:36px; padding:0 12px; }

      /* Stat cards still 2-col but compact */
      .d-stats { grid-template-columns:repeat(2,1fr); gap:8px; }
      .d-stat { padding:14px 12px; border-radius:12px; }
      .d-stat-val { font-size:22px; }
      .d-stat-lbl { font-size:11px; }
      .d-stat-ico { width:34px; height:34px; }
      .d-stat-trend { font-size:9.5px; padding:2px 6px; }

      /* Section label */
      .d-section { font-size:10px; letter-spacing:2px; }

      /* Nav cards compact */
      .d-nav-card { padding:14px 14px; gap:12px; border-radius:12px; }
      .d-nav-ico { width:40px; height:40px; border-radius:10px; }
      .d-nav-title { font-size:13px; }
      .d-nav-sub { font-size:11px; }

      /* Chips 3-col still but tiny */
      .d-chips { grid-template-columns:repeat(3,1fr); gap:6px; }
      .d-chip { padding:9px 10px; border-radius:8px; }
      .d-chip-val { font-size:15px; }
      .d-chip-lbl { font-size:9px; }

      /* Company table: only rank + company + package */
      .d-co-head,
      .d-co-row { grid-template-columns:26px 1fr 80px; gap:8px; padding:10px 12px; }
      .d-co-name { font-size:12px; }
      .d-co-pkg { font-size:12px; }
      .d-co-rank { width:24px; height:24px; font-size:10px; border-radius:6px; }

      .d-card-head { padding:12px 14px; }
      .d-card-title { font-size:13px; }
      .d-card-body { padding:12px 14px; }

      .d-dept-row { gap:8px; padding:8px 0; }
      .d-dept-name { width:46px; font-size:10.5px; }
      .d-dept-val { font-size:11.5px; }
      .d-dept-badge { font-size:9px; padding:2px 5px; }

      .d-toast { font-size:12px; padding:10px 14px; }
    }
  `;
  document.head.appendChild(s);
}

/* ── Constants ── */
const tk  = () => ({ headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } });

const DEPT_COLORS = {
  IT:"#3B7DED", CS:"#7C3AED", MECH:"#D97706",
  CIVIL:"#059669", ENTC:"#0891B2", ELECTRICAL:"#DC2626", EE:"#DC2626",
};
const RANK_GRAD = [
  "linear-gradient(135deg,#F59E0B,#FBBF24)",
  "linear-gradient(135deg,#94A3B8,#CBD5E1)",
  "linear-gradient(135deg,#B45309,#D97706)",
  "linear-gradient(135deg,#3B7DED,#60A5FA)",
  "linear-gradient(135deg,#7C3AED,#A78BFA)",
  "linear-gradient(135deg,#059669,#34D399)",
];

function SkStat() {
  return (
    <div className="d-stat">
      <div className="d-sk" style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"16px 16px 0 0"}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <div className="d-sk" style={{width:40,height:40,borderRadius:10}}/>
        <div className="d-sk" style={{width:52,height:22,borderRadius:6}}/>
      </div>
      <div className="d-sk" style={{width:"55%",height:28,marginBottom:6}}/>
      <div className="d-sk" style={{width:"40%",height:12}}/>
    </div>
  );
}

function SkBars() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      {[75,55,90,40,65].map((w,i) => (
        <div key={i} className="d-dept-row">
          <div className="d-sk" style={{width:60,height:12,borderRadius:4}}/>
          <div className="d-dept-track"><div className="d-sk" style={{width:`${w}%`,height:"100%",borderRadius:5}}/></div>
          <div className="d-sk" style={{width:24,height:12,borderRadius:4}}/>
          <div className="d-sk" style={{width:32,height:18,borderRadius:4}}/>
        </div>
      ))}
    </div>
  );
}

export default function TpoDashboard() {
  const navigate = useNavigate();

  const [students,      setStudents]      = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [companies,     setCompanies]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [toast,         setToast]         = useState("");

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"TPO Admin"}');

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [stuRes, annRes, coRes] = await Promise.all([
        API.get(`/user/students`, tk()),
        API.get(`/announcement`,  tk()),
        API.get(`/company`,       tk()),
      ]);
      setStudents(stuRes.data);
      setAnnouncements(annRes.data);
      setCompanies(coRes.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* ── Derived analytics ── */
  const deptMap = {};
  students.forEach(s => {
    const d = s.department || s.branch || "Other";
    deptMap[d] = (deptMap[d] || 0) + 1;
  });
  const deptData = Object.entries(deptMap)
    .sort((a,b)=>b[1]-a[1])
    .map(([name,count]) => ({ name, count, pct: students.length ? Math.round((count/students.length)*100) : 0 }));
  const maxDeptCount = deptData[0]?.count || 1;

  const deptCgpaMap = {};
  students.forEach(s => {
    const d = s.department || s.branch || "Other";
    if (!deptCgpaMap[d]) deptCgpaMap[d] = { sum:0, n:0 };
    deptCgpaMap[d].sum += Number(s.cgpa) || 0;
    deptCgpaMap[d].n   += 1;
  });
  const deptCgpaData = Object.entries(deptCgpaMap)
    .map(([name,v]) => ({ name, avg: v.n ? +(v.sum/v.n).toFixed(2) : 0 }))
    .sort((a,b)=>b.avg-a.avg);

  const avgCGPA    = students.length ? (students.reduce((a,s)=>a+(Number(s.cgpa)||0),0)/students.length).toFixed(2) : "0.00";
  const cgpa8plus  = students.filter(s=>Number(s.cgpa)>=8).length;
  const driveCount = announcements.filter(a=>a.type==="drive").length;
  const companyData= [...companies].filter(c=>Number(c.salary)>0).sort((a,b)=>Number(b.salary)-Number(a.salary)).slice(0,6);
  const maxPkg     = companyData[0] ? Number(companyData[0].salary) : 0;
  const avgPkg     = companyData.length ? (companyData.reduce((a,c)=>a+Number(c.salary),0)/companyData.length).toFixed(1) : "0";

  const hora = new Date().getHours();
  const greeting = hora < 12 ? "Good morning" : hora < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="d-root">
      <TpoSidebar />
      <div className="d-main">
        <TpoNavbar />
        <div className="d-body">

          {/* ── Welcome Banner ── */}
          <div className="d-banner">
            <div className="d-banner-left">
              <div className="d-banner-tag">
                <span className="d-banner-dot"/>
                TPO Office ·
              </div>
              <h1 className="d-banner-title">{greeting}, {user.name?.split(" ")[0] || "Admin"}</h1>
              <p className="d-banner-sub">
                {loading ? "Loading dashboard data…" : `${students.length} students · ${companies.length} companies · ${driveCount} active drives`}
              </p>
            </div>
            <div className="d-banner-right">
              <button className="d-banner-btn d-banner-btn-outline" onClick={() => navigate("/admin/announcements")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Announcement
              </button>
              <button className="d-banner-btn d-banner-btn-primary" onClick={() => navigate("/admin/students")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                View Students
              </button>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="d-stats">
            {loading ? (
              [1,2,3,4].map(i => <SkStat key={i}/>)
            ) : [
              {
                accent:"linear-gradient(90deg,#3B7DED,#60A5FA)", ico:"#EBF2FD", icoB:"#C2D6FA", icoColor:"#3B7DED",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                val:students.length, lbl:"Total Students", trend:"+12%", tBg:"#EBF2FD", tColor:"#1B3A6B"
              },
              {
                accent:"linear-gradient(90deg,#D97706,#FBBF24)", ico:"#FEF3C7", icoB:"#FDE68A", icoColor:"#D97706",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                val:companies.length, lbl:"Companies", trend:"Active", tBg:"#FEF3C7", tColor:"#92400E"
              },
              {
                accent:"linear-gradient(90deg,#7C3AED,#A78BFA)", ico:"#F5F3FF", icoB:"#DDD6FE", icoColor:"#7C3AED",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
                val:announcements.length, lbl:"Announcements", trend:`${driveCount} drives`, tBg:"#F5F3FF", tColor:"#6D28D9"
              },
              {
                accent:"linear-gradient(90deg,#059669,#34D399)", ico:"#F0FDF4", icoB:"#BBF7D0", icoColor:"#059669",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                val:cgpa8plus, lbl:"CGPA ≥ 8.0", trend:`${avgCGPA} avg`, tBg:"#F0FDF4", tColor:"#16A34A"
              },
            ].map((st,i) => (
              <div className="d-stat" key={i} style={{animationDelay:`${i*60}ms`}}>
                <div className="d-stat-accent" style={{background:st.accent}}/>
                <div className="d-stat-top">
                  <div className="d-stat-ico" style={{background:st.ico,border:`1px solid ${st.icoB}`,color:st.icoColor}}>{st.icon}</div>
                  <div className="d-stat-trend" style={{background:st.tBg,color:st.tColor}}>{st.trend}</div>
                </div>
                <div className="d-stat-val" style={{animationDelay:`${i*60+200}ms`}}>{st.val}</div>
                <div className="d-stat-lbl">{st.lbl}</div>
              </div>
            ))}
          </div>

          {/* ── Quick Navigation ── */}
          <div className="d-section">Quick Access</div>
          <div className="d-nav-grid">
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                icoColor:"#3B7DED", title:"Students",
                sub:`${students.length} enrolled · filter, search & download`,
                path:"/admin/students", bg:"linear-gradient(135deg,#EBF2FD,#D6E8FC)", bc:"#C2D6FA"
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                icoColor:"#D97706", title:"Companies",
                sub:`${companies.length} companies · manage listings & packages`,
                path:"/admin/companies", bg:"linear-gradient(135deg,#FEF3C7,#FDE68A55)", bc:"#FDE68A"
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
                icoColor:"#7C3AED", title:"Announcements",
                sub:`${announcements.length} posted · ${driveCount} placement drives`,
                path:"/admin/announcements", bg:"linear-gradient(135deg,#F5F3FF,#EDE9FE88)", bc:"#DDD6FE"
              },
            ].map((ql,i) => (
              <div key={i} className="d-nav-card" onClick={() => navigate(ql.path)} style={{animationDelay:`${i*60}ms`}}>
                <div className="d-nav-ico" style={{background:ql.bg,border:`1px solid ${ql.bc}`,color:ql.icoColor}}>{ql.icon}</div>
                <div className="d-nav-text">
                  <div className="d-nav-title">{ql.title}</div>
                  <div className="d-nav-sub">{ql.sub}</div>
                </div>
                <svg className="d-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            ))}
          </div>

          {/* ── Analytics ── */}
          <div className="d-section">Department Analytics</div>
          <div className="d-analytics">

            {/* Students by dept */}
            <div className="d-card">
              <div className="d-card-head">
                <div className="d-card-title">
                  <div className="d-card-icon" style={{background:"#EBF2FD",border:"1px solid #C2D6FA"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  Students by Department
                </div>
                <span style={{fontSize:11.5,color:"#B0BAC8",fontWeight:600}}>{students.length} total</span>
              </div>
              <div className="d-card-body">
                <div className="d-chips">
                  {[
                    { val:deptData.length,  lbl:"Departments", color:"#3B7DED" },
                    { val:avgCGPA,          lbl:"Avg CGPA",    color:"#059669" },
                    { val:cgpa8plus,        lbl:"CGPA ≥ 8",    color:"#7C3AED" },
                  ].map((c,i) => (
                    <div className="d-chip" key={i}>
                      <div className="d-chip-val" style={{color:c.color}}>{loading?"—":c.val}</div>
                      <div className="d-chip-lbl">{c.lbl}</div>
                    </div>
                  ))}
                </div>
                {loading ? <SkBars/> : deptData.length === 0 ? (
                  <div className="d-empty">No student data yet.</div>
                ) : deptData.map((d, idx) => (
                  <div className="d-dept-row" key={d.name}>
                    <div className="d-dept-name">{d.name}</div>
                    <div className="d-dept-track">
                      <div className="d-dept-fill" style={{
                        width:`${(d.count/maxDeptCount)*100}%`,
                        background: DEPT_COLORS[d.name] || "#9CA3AF",
                        animationDelay:`${idx*70}ms`,
                      }}/>
                    </div>
                    <div className="d-dept-val">{d.count}</div>
                    <div className="d-dept-badge" style={{
                      background: (DEPT_COLORS[d.name]||"#9CA3AF")+"18",
                      color: DEPT_COLORS[d.name]||"#9CA3AF",
                    }}>{d.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avg CGPA by dept */}
            <div className="d-card">
              <div className="d-card-head">
                <div className="d-card-title">
                  <div className="d-card-icon" style={{background:"#F0FDF4",border:"1px solid #BBF7D0"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  Avg CGPA by Dept
                </div>
                <span style={{fontSize:11.5,color:"#B0BAC8",fontWeight:600}}>Academic</span>
              </div>
              <div className="d-card-body">
                <div className="d-chips">
                  {[
                    { val:avgCGPA,         lbl:"Overall Avg",  color:"#16A34A" },
                    { val:driveCount,      lbl:"Active Drives", color:"#3B7DED" },
                    { val:companies.length,lbl:"Companies",    color:"#D97706" },
                  ].map((c,i) => (
                    <div className="d-chip" key={i}>
                      <div className="d-chip-val" style={{color:c.color}}>{loading?"—":c.val}</div>
                      <div className="d-chip-lbl">{c.lbl}</div>
                    </div>
                  ))}
                </div>
                {loading ? <SkBars/> : deptCgpaData.length === 0 ? (
                  <div className="d-empty">No data yet.</div>
                ) : deptCgpaData.map((d, idx) => {
                  const grade = d.avg >= 8 ? { bg:"#F0FDF4", color:"#16A34A", label:"A" }
                               : d.avg >= 7 ? { bg:"#FEF3C7", color:"#92400E", label:"B" }
                               :              { bg:"#FEF2F2", color:"#DC2626", label:"C" };
                  return (
                    <div className="d-dept-row" key={d.name}>
                      <div className="d-dept-name">{d.name}</div>
                      <div className="d-dept-track">
                        <div className="d-dept-fill" style={{
                          width:`${(d.avg/10)*100}%`,
                          background:`linear-gradient(90deg,${DEPT_COLORS[d.name]||"#3B7DED"}88,${DEPT_COLORS[d.name]||"#3B7DED"})`,
                          animationDelay:`${idx*70}ms`,
                        }}/>
                      </div>
                      <div className="d-dept-val" style={{color:grade.color}}>{d.avg}</div>
                      <div className="d-dept-badge" style={{background:grade.bg,color:grade.color}}>{grade.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Company Rankings ── */}
          <div className="d-section">Company Package Rankings</div>
          <div className="d-card d-co-grid" style={{animation:"tdSlideUp 0.5s 0.22s ease both"}}>
            <div className="d-card-head">
              <div className="d-card-title">
                <div className="d-card-icon" style={{background:"#FEF3C7",border:"1px solid #FDE68A"}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" >
                    <path d="M6 3h12M6 8h12M6 21l8-13M6 8a5 5 0 0 0 5 5h1"/>
                  </svg>
                </div>
                Top Paying Companies
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:700,color:"#16A34A"}}>
                   Max {maxPkg} LPA
                </span>
                <span style={{background:"#EBF2FD",border:"1px solid #C2D6FA",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:700,color:"#1B3A6B"}}>
                  Avg {avgPkg} LPA
                </span>
                <button
                  onClick={() => navigate("/admin/companies")}
                  style={{height:34,padding:"0 14px",borderRadius:9,border:"1px solid #E8EDF3",background:"#fff",color:"#7A8599",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5,transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#EBF2FD";e.currentTarget.style.color="#1B3A6B";e.currentTarget.style.borderColor="#C7D9F5";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#7A8599";e.currentTarget.style.borderColor="#E8EDF3";}}
                >
                  View All <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            {/* Table header */}
            <div className="d-co-head">
              {["#","Company","Package","Min CGPA","Dept"].map((h,i) => (
                <div key={i} className="d-co-th">{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:10}}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{display:"grid",gridTemplateColumns:"28px 1fr 110px 90px 90px",gap:14,alignItems:"center"}}>
                    <div className="d-sk" style={{width:28,height:28,borderRadius:8}}/>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      <div className="d-sk" style={{height:13,width:"60%"}}/>
                      <div className="d-sk" style={{height:5,width:"80%",borderRadius:3}}/>
                    </div>
                    <div className="d-sk" style={{height:22,borderRadius:7}}/>
                    <div className="d-sk" style={{height:13,width:"60%"}}/>
                    <div className="d-sk" style={{height:18,width:40,borderRadius:4}}/>
                  </div>
                ))}
              </div>
            ) : companyData.length === 0 ? (
              <div className="d-empty">No companies with package data yet.</div>
            ) : companyData.map((co, idx) => {
              const barW = maxPkg ? Math.round((Number(co.salary)/maxPkg)*100) : 0;
              return (
                <div key={co._id} className="d-co-row" onClick={() => navigate(`/admin/companies/${co._id}`)}>
                  <div className="d-co-rank" style={{background:RANK_GRAD[idx%RANK_GRAD.length]}}>{idx+1}</div>
                  <div style={{minWidth:0}}>
                    <div className="d-co-name">{co.companyName}</div>
                    <div className="d-co-bar-wrap">
                      <div className="d-co-bar-fill" style={{
                        width:`${barW}%`,
                        background: idx===0 ? "linear-gradient(90deg,#F59E0B,#FBBF24)"
                                 : idx===1 ? "linear-gradient(90deg,#94A3B8,#CBD5E1)"
                                 : "linear-gradient(90deg,#3B7DED88,#3B7DED)",
                        animationDelay:`${idx*80}ms`,
                      }}/>
                    </div>
                  </div>
                  <div className="d-co-pkg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" >
                      <path d="M6 3h12M6 8h12M6 21l8-13M6 8a5 5 0 0 0 5 5h1"/>
                    </svg>
                    {co.salary} LPA
                  </div>
                  <div className="d-co-cgpa">{co.minimumCGPA ? `≥ ${co.minimumCGPA}` : "—"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                    {(co.departments||co.eligibleDepts||[]).slice(0,2).map((d,j) => (
                      <span key={j} className="d-co-tag">{d}</span>
                    ))}
                    {!(co.departments||co.eligibleDepts||[]).length && (
                      <span style={{fontSize:11,color:"#C0C8D5",fontStyle:"italic"}}>All depts</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {toast && (
        <div className="d-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}
    </div>
  );
}