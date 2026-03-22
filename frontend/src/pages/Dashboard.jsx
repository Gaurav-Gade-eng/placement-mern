import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api";

/* ── inject styles ── */
if (!document.getElementById("dash-v2-styles")) {
  const s = document.createElement("style");
  s.id = "dash-v2-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes dv2-up    { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    @keyframes dv2-in    { from { opacity:0 } to { opacity:1 } }
    @keyframes dv2-shim  { from { background-position:200% 0 } to { background-position:-200% 0 } }
    @keyframes dv2-pulse { 0%,100% { transform:scale(1); opacity:1 } 50% { transform:scale(1.5); opacity:.4 } }
    @keyframes dv2-count { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
    @keyframes dv2-bar   { from { width:0 } to { width:var(--w,0%) } }

    .dv2-root { display:flex; min-height:100vh; background:#F2F4F8; font-family:'DM Sans',system-ui,sans-serif; }
    .dv2-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
    .dv2-body { flex:1; padding:24px 32px 80px; overflow-y:auto; }

    /* ══ HERO BANNER ══ */
    .dv2-banner {
      border-radius:22px; margin-bottom:20px; overflow:hidden;
      position:relative; animation:dv2-up .5s ease both;
      background: #0B1629;
    }
    .dv2-banner-bg {
      position:absolute; inset:0; pointer-events:none;
      background:
        radial-gradient(ellipse 70% 80% at 5% 50%,  rgba(37,99,235,.28)  0%, transparent 55%),
        radial-gradient(ellipse 50% 60% at 95% 20%, rgba(16,185,129,.16) 0%, transparent 50%),
        radial-gradient(ellipse 30% 40% at 60% 90%, rgba(139,92,246,.14) 0%, transparent 45%);
    }
    .dv2-banner-grid {
      position:absolute; inset:0; pointer-events:none;
      background-image:
        linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
      background-size:48px 48px;
    }
    .dv2-banner-inner {
      position:relative; z-index:2; padding:28px 32px;
      display:grid; grid-template-columns:auto 1fr auto auto;
      gap:20px; align-items:center;
    }
    .dv2-av {
      width:66px; height:66px; border-radius:18px; flex-shrink:0;
      background:rgba(255,255,255,.12); border:2px solid rgba(255,255,255,.22);
      display:flex; align-items:center; justify-content:center;
      font-size:22px; font-weight:700; color:#fff;
      font-family:'DM Serif Display', serif;
      box-shadow:0 4px 18px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.18);
    }
    .dv2-bn-greet { font-size:11px; font-weight:600; color:rgba(255,255,255,.45); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:4px; }
    .dv2-bn-name  { font-family:'DM Serif Display',serif; font-size:26px; color:#fff; letter-spacing:-.4px; line-height:1; margin-bottom:10px; }
    .dv2-bn-chips { display:flex; gap:6px; flex-wrap:wrap; }
    .dv2-chip {
      display:inline-flex; align-items:center; gap:5px;
      padding:4px 11px; border-radius:8px; font-size:11px; font-weight:600;
      background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.16);
      color:rgba(255,255,255,.85);
    }
    .dv2-chip-live {
      background:rgba(16,185,129,.18); border-color:rgba(16,185,129,.35); color:#6EE7B7;
    }
    .dv2-bn-stats {
      display:flex; gap:1px; background:rgba(255,255,255,.08);
      border:1px solid rgba(255,255,255,.12); border-radius:16px; overflow:hidden; flex-shrink:0;
    }
    .dv2-bn-st { padding:16px 22px; text-align:center; }
    .dv2-bn-st + .dv2-bn-st { border-left:1px solid rgba(255,255,255,.09); }
    .dv2-bn-sv { font-family:'DM Serif Display',serif; font-size:26px; color:#fff; line-height:1; }
    .dv2-bn-sl { font-size:9.5px; color:rgba(255,255,255,.45); margin-top:3px; font-weight:600; text-transform:uppercase; letter-spacing:.8px; }
    .dv2-ring-wrap { text-align:center; flex-shrink:0; }
    .dv2-ring-lbl  { font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:rgba(255,255,255,.4); margin-bottom:6px; }
    .dv2-ring      { position:relative; width:68px; height:68px; }
    .dv2-ring-svg  { transform:rotate(-90deg); }
    .dv2-ring-val  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; }

    /* ══ QUICK ACTIONS ══ */
    .dv2-actions {
      display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
      margin-bottom:20px; animation:dv2-up .5s .07s ease both;
    }
    .dv2-act {
      background:#fff; border:1px solid #E4EAF2; border-radius:14px;
      padding:20px 16px; display:flex; flex-direction:column;
      align-items:center; gap:10px; cursor:pointer;
      box-shadow:0 1px 3px rgba(0,0,0,.04);
      transition:box-shadow .2s, transform .22s, border-color .15s;
      position:relative; overflow:hidden;
    }
    .dv2-act::after {
      content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
      transform:scaleX(0); transform-origin:left;
      transition:transform .28s cubic-bezier(.22,1,.36,1);
    }
    .dv2-act:hover { box-shadow:0 10px 28px rgba(0,0,0,.09); transform:translateY(-4px); border-color:#C7D9F8; }
    .dv2-act:hover::after { transform:scaleX(1); }
    .dv2-act-ico { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; }
    .dv2-act-lbl { font-size:13px; font-weight:700; color:#0B1629; text-align:center; line-height:1.3; }
    .dv2-act-sub { font-size:11px; color:#9CAAB8; text-align:center; margin-top:-4px; font-weight:400; }

    /* ══ MAIN GRID ══ */
    .dv2-grid {
      display:grid; grid-template-columns:1.25fr .75fr; gap:14px;
      margin-bottom:20px; animation:dv2-up .5s .1s ease both;
    }
    .dv2-rcol { display:flex; flex-direction:column; gap:14px; }

    /* Card shell */
    .dv2-card { background:#fff; border:1px solid #E4EAF2; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.04), 0 4px 14px rgba(0,0,0,.03); }
    .dv2-chd  { padding:14px 20px; border-bottom:1px solid #EEF3FA; display:flex; align-items:center; justify-content:space-between; }
    .dv2-ctitle { font-size:13.5px; font-weight:700; color:#0B1629; display:flex; align-items:center; gap:9px; }
    .dv2-cico   { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
    .dv2-clink  {
      font-size:11.5px; font-weight:700; color:#2563EB; background:none; border:none;
      cursor:pointer; display:flex; align-items:center; gap:4px; padding:0;
      transition:gap .15s; font-family:'DM Sans',sans-serif;
    }
    .dv2-clink:hover { gap:8px; }
    .dv2-cbody  { padding:4px 20px 12px; }

    /* ── Skill tags ── */
    .dv2-skills { display:flex; flex-wrap:wrap; gap:7px; padding:14px 4px 6px; }
    .dv2-skill  { padding:5px 12px; border-radius:8px; font-size:11.5px; font-weight:600; border:1px solid; cursor:default; transition:transform .15s; }
    .dv2-skill:hover { transform:translateY(-1px); }

    /* ── Score ring chart inside card ── */
    .dv2-score-row { display:flex; align-items:center; gap:18px; padding:14px 4px 8px; }
    .dv2-score-ring { position:relative; width:80px; height:80px; flex-shrink:0; }
    .dv2-score-ring svg { transform:rotate(-90deg); }
    .dv2-score-num { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column; }
    .dv2-score-pct { font-family:'DM Serif Display',serif; font-size:20px; color:#0B1629; line-height:1; }
    .dv2-score-cap { font-size:9px; font-weight:700; color:#9CAAB8; text-transform:uppercase; letter-spacing:.8px; }
    .dv2-score-items { flex:1; display:flex; flex-direction:column; gap:9px; }
    .dv2-score-item { display:flex; flex-direction:column; gap:4px; }
    .dv2-score-label { display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:#5A6A7A; }
    .dv2-score-bar-bg { height:5px; background:#EEF3FA; border-radius:3px; overflow:hidden; }
    .dv2-score-bar-fill { height:100%; border-radius:3px; animation:dv2-bar .9s ease both; }

    /* ══ ACTIVITY FEED ══ */
    .dv2-activity { margin-bottom:20px; animation:dv2-up .5s .13s ease both; }
    .dv2-feed { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:16px 20px; }
    .dv2-feed-item { display:flex; align-items:flex-start; gap:10px; }
    .dv2-feed-ico  { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .dv2-feed-ttl  { font-size:12.5px; font-weight:700; color:#0B1629; margin-bottom:2px; line-height:1.3; }
    .dv2-feed-sub  { font-size:11px; color:#9CAAB8; line-height:1.5; }

    /* ══ NUDGE ══ */
    .dv2-nudge {
      background:#fff; border:1px solid #FDE68A; border-radius:14px;
      padding:16px 22px; display:flex; align-items:center; gap:16px;
      box-shadow:0 1px 3px rgba(0,0,0,.04); animation:dv2-up .5s .16s ease both;
      margin-bottom:20px; position:relative; overflow:hidden;
    }
    .dv2-nudge::before {
      content:''; position:absolute; inset:0; pointer-events:none;
      background:linear-gradient(135deg,rgba(254,243,199,.5) 0%,transparent 60%);
    }
    .dv2-nudge-ico { width:44px; height:44px; border-radius:11px; background:#FEF3C7; border:1px solid #FDE68A; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#D97706; position:relative; z-index:1; }
    .dv2-nudge-btn {
      height:38px; padding:0 20px; border-radius:9px; border:none; cursor:pointer;
      background:linear-gradient(135deg,#D97706,#F59E0B); color:#fff;
      font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:700;
      white-space:nowrap; box-shadow:0 3px 10px rgba(217,119,6,.28);
      flex-shrink:0; position:relative; z-index:1;
      transition:transform .15s, box-shadow .15s;
    }
    .dv2-nudge-btn:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(217,119,6,.38); }

    /* ══ SKELETON ══ */
    .dv2-sk { background:linear-gradient(90deg,#ECF0F4 25%,#F4F7F9 50%,#ECF0F4 75%); background-size:200% 100%; animation:dv2-shim 1.4s ease infinite; border-radius:6px; }
    .dv2-empty { padding:28px 16px; text-align:center; color:#9CAAB8; font-size:13px; line-height:1.75; }
  `;
  document.head.appendChild(s);
}

const tk  = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const IC  = ["#2563EB","#0891B2","#059669","#7C3AED","#DB2777","#D97706"];
const ini = n => (n||"S").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();

const isDrive    = a => a.type === "drive";
const isAccepted = a => a.status === "accepted" || a.status === "approved";
const isPlaced   = a => a.status === "placed";
const isPending  = a => a.status === "pending";

/* ── SVG Icons ── */
const Ic = {
  Bell:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  File:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Check:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Bolt:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Dept:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  Cal:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Star:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Arrow:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Target:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  TrendUp: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Building:() => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  User:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  Warn:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

/* ── Profile Ring ── */
function Ring({ pct, size = 68 }) {
  const r = (size / 2) - 6;
  const c = 2 * Math.PI * r;
  const color = pct === 100 ? "#4ADE80" : pct >= 60 ? "#60A5FA" : "#FCD34D";
  return (
    <div className="dv2-ring">
      <svg className="dv2-ring-svg" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="5"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${(pct/100)*c} ${c}`}
          style={{ transition:"stroke-dasharray .9s cubic-bezier(.22,1,.36,1)" }}/>
      </svg>
      <div className="dv2-ring-val" style={{ color }}>{pct}%</div>
    </div>
  );
}

/* ── Score Ring ── */
function ScoreRing({ pct, color, size = 80 }) {
  const r = (size / 2) - 7;
  const c = 2 * Math.PI * r;
  return (
    <div className="dv2-score-ring">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EEF3FA" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(pct/100)*c} ${c}`}
          style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%", transition:"stroke-dasharray .9s ease" }}/>
      </svg>
      <div className="dv2-score-num">
        <span className="dv2-score-pct">{pct}%</span>
        <span className="dv2-score-cap">match</span>
      </div>
    </div>
  );
}

/* ════ Dashboard ════ */
export default function Dashboard() {
  const navigate = useNavigate();

  const [anns,    setAnns]    = useState([]);
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const inits = ini(user.name);
  const hora  = new Date().getHours();
  const greet = hora < 12 ? "Good morning" : hora < 17 ? "Good afternoon" : "Good evening";

  const fields = [user.cgpa, user.year, user.semester, user.department,
                  user.phone, (user.skills||[]).length > 0, !!user.resume];
  const pct    = Math.round(fields.filter(Boolean).length / fields.length * 100);

  const matchPct = Math.min(100, Math.round(pct * 0.6 + (user.cgpa ? Math.min(40, (Number(user.cgpa)/10)*40) : 0)));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    Promise.all([
      API.get(`${API}/announcement`,   tk()),
      API.get(`${API}/application/my`, tk()),
    ])
      .then(([aR, pR]) => {
        setAnns(Array.isArray(aR.data) ? aR.data : aR.data?.announcements || []);
        setApps(Array.isArray(pR.data) ? pR.data : pR.data?.applications  || []);
      })
      .catch(err => {
        const st = err?.response?.status;
        if (st === 401 || st === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        // silently ignore other errors — no error banner shown
      })
      .finally(() => setLoading(false));
  }, []);

  /* Derived data */
  const drives       = anns.filter(isDrive);
  const acceptedApps = apps.filter(a => isAccepted(a) || isPlaced(a));

  const skills = Array.isArray(user.skills) ? user.skills : [];

  /* Activity feed */
  const activityFeed = [
    apps.length > 0       && { ico:"#3B7DED", icoBg:"#EBF2FD", icon:<Ic.File/>,     title:`${apps.length} Application${apps.length>1?"s":""} Sent`,        sub:"Track status in My Applications" },
    acceptedApps.length > 0 && { ico:"#059669", icoBg:"#F0FDF4", icon:<Ic.Check/>,  title:`${acceptedApps.length} Offer${acceptedApps.length>1?"s":""} Accepted`, sub:"Congratulations on your progress!" },
    drives.length > 0     && { ico:"#7C3AED", icoBg:"#F5F3FF", icon:<Ic.Building/>, title:`${drives.length} Active Drive${drives.length>1?"s":""} Running`,   sub:"Check eligibility & apply now" },
    { ico:"#D97706", icoBg:"#FEF3C7", icon:<Ic.Target/>, title:"Profile Match Score", sub:`You match ${matchPct}% of drive criteria` },
    skills.length > 0     && { ico:"#0891B2", icoBg:"#E0F7FA", icon:<Ic.Star/>,     title:`${skills.length} Skill${skills.length>1?"s":""} on Profile`,       sub:"Skills boost your visibility to recruiters" },
    !user.resume          && { ico:"#DC2626", icoBg:"#FEF2F2", icon:<Ic.Warn/>,     title:"Resume Missing",                                                    sub:"Upload your resume to apply to drives" },
  ].filter(Boolean).slice(0, 3);

  /* Placement readiness */
  const scoreItems = [
    { label:"Academic", val: user.cgpa  ? Math.min(100, Math.round(Number(user.cgpa)/10*100)) : 0, color:"#2563EB" },
    { label:"Profile",  val: pct,                                                                    color:"#059669" },
    { label:"Resume",   val: user.resume ? 100 : 0,                                                 color:"#7C3AED" },
    { label:"Skills",   val: Math.min(100, skills.length * 14),                                     color:"#D97706" },
  ];

  return (
    <div className="dv2-root">
      <Sidebar />
      <div className="dv2-main">
        <Navbar />
        <div className="dv2-body">

          {/* ════ BANNER ════ */}
          <div className="dv2-banner">
            <div className="dv2-banner-bg" />
            <div className="dv2-banner-grid" />
            <div className="dv2-banner-inner">
              <div className="dv2-av">{inits}</div>

              <div>
                <div className="dv2-bn-greet">{greet}</div>
                <div className="dv2-bn-name">{user.name || "Student"}</div>
                <div className="dv2-bn-chips">
                  {user.department && <span className="dv2-chip"><Ic.Dept/> {user.department}</span>}
                  {user.semester   && <span className="dv2-chip"><Ic.Cal/> Sem {user.semester}</span>}
                  {user.cgpa       && <span className="dv2-chip"><Ic.Star/> {Number(user.cgpa).toFixed(2)} CGPA</span>}
                  <span className="dv2-chip dv2-chip-live">
                    <span style={{ width:5, height:5, borderRadius:"50%", background:"#10B981", animation:"dv2-pulse 2s ease infinite", display:"inline-block" }}/>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ════ QUICK ACTIONS ════ */}
          <div className="dv2-actions">
            {[
              { icon:<Ic.Bell/>,     color:"#2563EB", bg:"#EBF2FD", bc:"#C2D6FA", bar:"#2563EB", label:"Browse Announcements",  sub:"View open positions",     to:"/announcements" },
              { icon:<Ic.Plus/>,     color:"#7C3AED", bg:"#F5F3FF", bc:"#DDD6FE", bar:"#7C3AED", label:"Job Suggestions", sub:"Matched to your profile", to:"/suggestions"   },
              { icon:<Ic.Building/>, color:"#059669", bg:"#F0FDF4", bc:"#BBF7D0", bar:"#059669", label:"Companies",       sub:"Explore all recruiters",  to:"/companies"     },
              { icon:<Ic.User/>,     color:"#D97706", bg:"#FEF3C7", bc:"#FDE68A", bar:"#D97706", label:"My Profile",      sub:"Boost match score",       to:"/profile"       },
            ].map((a, i) => (
              <div key={i} className="dv2-act" onClick={() => navigate(a.to)}>
                <style>{`.dv2-act:nth-child(${i+1})::after { background:${a.bar}; }`}</style>
                <div className="dv2-act-ico" style={{ background:a.bg, border:`1px solid ${a.bc}`, color:a.color }}>
                  {a.icon}
                </div>
                <div>
                  <div className="dv2-act-lbl">{a.label}</div>
                  <div className="dv2-act-sub">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ════ MAIN GRID — Placement Readiness + Skills ════ */}
          <div className="dv2-grid">

            {/* LEFT: Placement Readiness (full width feel on left) */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div className="dv2-card">
                <div className="dv2-chd">
                  <div className="dv2-ctitle">
                    <div className="dv2-cico" style={{ background:"#F5F3FF" }}>
                      <Ic.Target style={{ color:"#7C3AED" }}/>
                    </div>
                    Placement Readiness
                  </div>
                </div>
                <div className="dv2-cbody">
                  <div className="dv2-score-row">
                    <ScoreRing pct={matchPct} color="#7C3AED" />
                    <div className="dv2-score-items">
                      {scoreItems.map((it, i) => (
                        <div key={i} className="dv2-score-item">
                          <div className="dv2-score-label">
                            <span>{it.label}</span>
                            <span style={{ color:it.color, fontWeight:700 }}>{it.val}%</span>
                          </div>
                          <div className="dv2-score-bar-bg">
                            <div className="dv2-score-bar-fill"
                              style={{ width:`${it.val}%`, background:it.color, "--w":`${it.val}%` }}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="dv2-card">
                  <div className="dv2-chd">
                    <div className="dv2-ctitle">
                      <div className="dv2-cico" style={{ background:"#E0F7FA" }}>
                        <Ic.TrendUp style={{ color:"#0891B2" }}/>
                      </div>
                      Your Skills
                    </div>
                    <button className="dv2-clink" onClick={() => navigate("/profile")}>
                      Edit <Ic.Arrow/>
                    </button>
                  </div>
                  <div className="dv2-cbody">
                    <div className="dv2-skills">
                      {skills.slice(0, 12).map((sk, i) => {
                        const palette = [
                          { bg:"#EBF2FD", c:"#1B3A6B", bc:"#C2D6FA" },
                          { bg:"#F0FDF4", c:"#14532D", bc:"#BBF7D0" },
                          { bg:"#F5F3FF", c:"#4C1D95", bc:"#DDD6FE" },
                          { bg:"#FEF3C7", c:"#92400E", bc:"#FDE68A" },
                          { bg:"#E0F7FA", c:"#0C4A6E", bc:"#BAE6FD" },
                        ];
                        const cl = palette[i % palette.length];
                        return (
                          <span key={i} className="dv2-skill"
                            style={{ background:cl.bg, color:cl.c, borderColor:cl.bc }}>
                            {sk}
                          </span>
                        );
                      })}
                      {skills.length > 12 && (
                        <span className="dv2-skill" style={{ background:"#F2F4F8", color:"#7A8A9A", borderColor:"#E4EAF2" }}>
                          +{skills.length - 12} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Activity summary */}
            <div className="dv2-rcol">
              {!loading && activityFeed.length > 0 && (
                <div className="dv2-card">
                  <div className="dv2-chd">
                    <div className="dv2-ctitle">
                      <div className="dv2-cico" style={{ background:"#EBF2FD" }}>
                        <Ic.TrendUp style={{ color:"#2563EB" }}/>
                      </div>
                      Activity Summary
                    </div>
                  </div>
                  <div style={{ padding:"8px 20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
                    {activityFeed.map((f, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                        <div className="dv2-feed-ico" style={{ background:f.icoBg, color:f.ico }}>
                          {f.icon}
                        </div>
                        <div>
                          <div className="dv2-feed-ttl">{f.title}</div>
                          <div className="dv2-feed-sub">{f.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ════ PROFILE NUDGE ════ */}
          {!loading && pct < 100 && (
            <div className="dv2-nudge">
              <div className="dv2-nudge-ico"><Ic.Bolt/></div>
              <div style={{ flex:1, position:"relative", zIndex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#92400E", marginBottom:4 }}>
                  Your profile is {pct}% complete — boost your placement match score
                </div>
                <div style={{ fontSize:12, color:"#B45309", display:"flex", gap:10, flexWrap:"wrap" }}>
                  {!user.cgpa           && <span>· Add CGPA</span>}
                  {!skills.length       && <span>· Add skills</span>}
                  {!user.resume         && <span>· Upload resume</span>}
                  {!user.department     && <span>· Add department</span>}
                  {!user.phone          && <span>· Add phone number</span>}
                </div>
              </div>
              <button className="dv2-nudge-btn" onClick={() => navigate("/profile")}>
                Complete Profile →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}