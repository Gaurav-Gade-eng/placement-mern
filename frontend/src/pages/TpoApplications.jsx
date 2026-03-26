import { useEffect, useState } from "react";
import TpoNavbar  from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import API from "../api";

if (!document.getElementById("tpo-app-styles")) {
  const s = document.createElement("style");
  s.id = "tpo-app-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes appUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes appIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes appShim  { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes appPop   { from{opacity:0;transform:scale(0.95) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes appFade  { from{opacity:0} to{opacity:1} }
    @keyframes appToast { from{opacity:0;transform:translateY(12px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes appSpin  { to{transform:rotate(360deg)} }

    .app-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .app-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
    .app-body { flex:1; padding:30px 36px 60px; overflow-y:auto; }

    .app-hd    { margin-bottom:22px; animation:appUp 0.45s ease both; }
    .app-ey    { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#3B7DED; margin-bottom:6px; display:flex; align-items:center; gap:7px; }
    .app-ey::before { content:''; width:18px; height:2px; background:#3B7DED; border-radius:2px; }
    .app-title { font-size:26px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; }
    .app-sub   { font-size:13px; color:#7A8599; margin-top:4px; }

    .app-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; animation:appUp 0.45s 0.04s ease both; }
    .app-stat  { background:#fff; border:1px solid #E2E4E9; border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:12px; transition:box-shadow 0.2s,transform 0.2s; }
    .app-stat:hover { box-shadow:0 4px 16px rgba(0,0,0,0.07); transform:translateY(-2px); }
    .app-stat-ico { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .app-stat-val { font-size:22px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; line-height:1; }
    .app-stat-lbl { font-size:11px; color:#7A8599; margin-top:3px; }

    .app-filters { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px; animation:appUp 0.45s 0.08s ease both; }
    .app-filter  {
      height:34px; padding:0 16px; border-radius:8px; border:1px solid #E2E4E9;
      background:#fff; color:#7A8599; cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600;
      display:flex; align-items:center; gap:6px;
      transition:all 0.15s cubic-bezier(0.34,1.56,0.64,1);
    }
    .app-filter:hover  { border-color:#3B7DED; color:#3B7DED; }
    .app-filter.act    { background:#1B3A6B; border-color:#1B3A6B; color:#fff; box-shadow:0 2px 8px rgba(27,58,107,0.22); }
    .app-filter-count  { padding:1px 7px; border-radius:20px; font-size:10.5px; font-weight:700; background:rgba(255,255,255,0.2); }
    .app-filter:not(.act) .app-filter-count { background:#F0F2F6; color:#7A8599; }

    .app-search-wrap { position:relative; margin-bottom:20px; animation:appUp 0.45s 0.1s ease both; }
    .app-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#C0C8D5; pointer-events:none; }
    .app-search-in   {
      width:100%; height:42px; border:1px solid #E2E4E9; border-radius:10px;
      padding:0 14px 0 42px; background:#fff;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#0D1C33; outline:none;
      transition:border-color 0.18s, box-shadow 0.18s;
    }
    .app-search-in:focus { border-color:#3B7DED; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .app-search-in::placeholder { color:#C0C8D5; }

    .app-card { background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden; animation:appUp 0.45s 0.12s ease both; }
    .app-ch   { padding:15px 20px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; justify-content:space-between; }
    .app-ct   { font-size:14px; font-weight:800; color:#0D1C33; display:flex; align-items:center; gap:9px; }
    .app-ci   { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }

    .app-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
    table.app-table { width:100%; border-collapse:collapse; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; }
    .app-table th { padding:11px 16px; background:#F8FAFC; text-align:left; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; border-bottom:1px solid #F0F2F6; white-space:nowrap; }
    .app-table td { padding:14px 16px; border-bottom:1px solid #F5F7FA; vertical-align:middle; }
    .app-table tbody tr:last-child td { border-bottom:none; }
    .app-table tbody tr { transition:background 0.12s; }
    .app-table tbody tr:hover { background:#FAFBFF; }

    .app-av { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,#1B3A6B,#2563EB); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#fff; flex-shrink:0; }

    .app-status { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
    .app-status-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

    .app-action { height:30px; padding:0 12px; border-radius:7px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:11.5px; font-weight:700; display:inline-flex; align-items:center; gap:5px; transition:transform 0.15s, box-shadow 0.15s, opacity 0.15s; white-space:nowrap; }
    .app-action:hover:not(:disabled) { transform:translateY(-1px); }
    .app-action:disabled { opacity:0.5; cursor:not-allowed; }
    .app-action-accept { background:linear-gradient(135deg,#059669,#10B981); color:#fff; box-shadow:0 2px 6px rgba(5,150,105,0.2); }
    .app-action-accept:hover:not(:disabled) { box-shadow:0 4px 12px rgba(5,150,105,0.3); }
    .app-action-reject { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; }
    .app-action-reject:hover:not(:disabled) { background:#FEE2E2; }
    .app-spinner { width:12px; height:12px; border-radius:50%; border:2px solid rgba(255,255,255,0.35); border-top-color:#fff; animation:appSpin 0.65s linear infinite; }

    .app-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.45); backdrop-filter:blur(2px); display:flex; align-items:center; justify-content:center; animation:appFade 0.2s ease both; padding:16px; }
    .app-modal   { background:#fff; border-radius:18px; padding:28px; width:420px; max-width:100%; box-shadow:0 24px 64px rgba(0,0,0,0.18); font-family:'Plus Jakarta Sans',sans-serif; animation:appPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }

    .app-reason-ta {
      width:100%; border:1px solid #E2E4E9; border-radius:10px;
      padding:12px 14px; background:#F9FAFB;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#0D1C33;
      outline:none; resize:none; min-height:100px; line-height:1.6;
      transition:border-color 0.18s, box-shadow 0.18s, background 0.18s;
    }
    .app-reason-ta:focus { border-color:#DC2626; background:#fff; box-shadow:0 0 0 3px rgba(220,38,38,0.08); }
    .app-reason-ta::placeholder { color:#C0C8D5; }

    .app-toast { position:fixed; bottom:28px; right:28px; z-index:999; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #E2E4E9; border-radius:12px; padding:12px 16px; box-shadow:0 8px 28px rgba(0,0,0,0.1); animation:appToast 0.3s cubic-bezier(0.34,1.56,0.64,1) both; font-size:13px; font-weight:600; color:#0D1C33; max-width:320px; }

    .app-sk { background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%); background-size:200% 100%; animation:appShim 1.5s ease infinite; border-radius:4px; }

    .app-empty { display:flex; flex-direction:column; align-items:center; padding:64px 24px; text-align:center; }
    .app-empty-ico { width:52px; height:52px; border-radius:13px; background:#EBF2FD; border:1px solid #C2D6FA; display:flex; align-items:center; justify-content:center; margin-bottom:14px; color:#3B7DED; }


    /* ══════════════════════════════════════════
       MOBILE RESPONSIVE
       ══════════════════════════════════════════ */

    /* ── Tablet: ≤ 1024px ── */
    @media (max-width: 1024px) {
      .app-body { padding:22px 24px 60px; }
      .app-stats { grid-template-columns:repeat(2,1fr); }
    }

    /* ── Mobile landscape / small tablet: ≤ 768px ── */
    @media (max-width: 768px) {
      .app-body { padding:16px 16px 72px; }

      .app-title { font-size:22px; }

      /* Stats: 2×2 */
      .app-stats { grid-template-columns:repeat(2,1fr); gap:10px; }
      .app-stat  { padding:13px 14px; gap:10px; }
      .app-stat-ico { width:34px; height:34px; border-radius:9px; }
      .app-stat-val { font-size:18px; }

      /* Filter pills wrap and compact */
      .app-filters { gap:5px; }
      .app-filter  { height:30px; padding:0 12px; font-size:11.5px; }

      /* Table: hide # and Applied On columns */
      .app-table th:nth-child(1),
      .app-table td:nth-child(1),
      .app-table th:nth-child(4),
      .app-table td:nth-child(4) { display:none; }

      /* Action buttons: stack */
      .app-table td:last-child > div { flex-direction:column; gap:5px; }

      /* Card header */
      .app-ch { padding:12px 16px; }

      /* Toast */
      .app-toast { left:16px; right:16px; bottom:16px; max-width:none; }

      /* Modal */
      .app-modal { padding:22px; }
    }

    /* ── Mobile portrait: ≤ 480px ── */
    @media (max-width: 480px) {
      .app-body { padding:12px 12px 80px; }

      .app-title { font-size:20px; }
      .app-sub   { font-size:12px; }

      /* Stats: 2-col compact */
      .app-stats { gap:8px; }
      .app-stat  { padding:12px 12px; }
      .app-stat-val { font-size:17px; }
      .app-stat-lbl { font-size:10.5px; }

      /* Filters: smaller */
      .app-filter { height:28px; padding:0 10px; font-size:11px; }
      .app-filter-count { padding:1px 5px; font-size:9.5px; }

      /* Search */
      .app-search-in { height:38px; font-size:12.5px; }

      /* Table: also hide Drive/Company column label, keep short */
      .app-table th { padding:9px 10px; font-size:9px; }
      .app-table td { padding:11px 10px; }

      /* Avatar smaller */
      .app-av { width:30px; height:30px; font-size:10px; border-radius:8px; }

      /* Action buttons smaller */
      .app-action { height:26px; padding:0 9px; font-size:11px; }

      /* Modal */
      .app-modal { padding:18px; border-radius:14px; }
    }
  `;
  document.head.appendChild(s);
}

const tk  = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const STATUS_STYLE = {
  pending:  { bg:"#FEF3C7", color:"#92400E", dot:"#D97706", label:"Pending"  },
  accepted: { bg:"#F0FDF4", color:"#16A34A", dot:"#16A34A", label:"Accepted" },
  rejected: { bg:"#FEF2F2", color:"#DC2626", dot:"#DC2626", label:"Rejected" },
  approved: { bg:"#F0FDF4", color:"#16A34A", dot:"#16A34A", label:"Approved" },
};

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";

const IcoClipboard = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

const IcoClock = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IcoCheckCircle = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IcoXCircle = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

export default function TpoApplications() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [acting,  setActing]  = useState(false);
  const [toast,   setToast]   = useState({ msg:"", type:"ok" });

  const [acceptModal, setAcceptModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [reason,      setReason]      = useState("");

  useEffect(() => { fetchApps(); }, []);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"ok" }), 3000);
  };

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/application`, tk());
      setApps(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAccept = async () => {
    if (!acceptModal) return;
    setActing(true);
    try {
      await API.put(`/application/${acceptModal._id}`, { status:"accepted" }, tk());
      setAcceptModal(null);
      showToast("Application accepted.");
      fetchApps();
    } catch { showToast("Failed to update.", "err"); }
    finally { setActing(false); }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActing(true);
    try {
      await API.put(`/application/${rejectModal._id}`, { status:"rejected", reason }, tk());
      setRejectModal(null);
      setReason("");
      showToast("Application rejected.");
      fetchApps();
    } catch { showToast("Failed to update.", "err"); }
    finally { setActing(false); }
  };

  const pending  = apps.filter(a => a.status === "pending");
  const accepted = apps.filter(a => a.status === "accepted" || a.status === "approved");
  const rejected = apps.filter(a => a.status === "rejected");

  const tabFiltered = filter === "pending"  ? pending
                    : filter === "accepted" ? accepted
                    : filter === "rejected" ? rejected
                    : apps;

  const displayed = tabFiltered.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.student?.name?.toLowerCase().includes(q) ||
      a.student?.email?.toLowerCase().includes(q) ||
      a.announcement?.title?.toLowerCase().includes(q) ||
      a.announcement?.company?.toLowerCase().includes(q)
    );
  });

  const statCards = [
    { icon:<IcoClipboard   size={20} color="#3B7DED" sw={1.8}/>, val:apps.length,     lbl:"Total",    bg:"#EBF2FD", bc:"#C2D6FA" },
    { icon:<IcoClock       size={20} color="#D97706" sw={1.8}/>, val:pending.length,  lbl:"Pending",  bg:"#FEF3C7", bc:"#FDE68A" },
    { icon:<IcoCheckCircle size={20} color="#16A34A" sw={1.8}/>, val:accepted.length, lbl:"Accepted", bg:"#F0FDF4", bc:"#BBF7D0" },
    { icon:<IcoXCircle     size={20} color="#DC2626" sw={1.8}/>, val:rejected.length, lbl:"Rejected", bg:"#FEF2F2", bc:"#FECACA" },
  ];

  return (
    <>
    <div className="app-root">
      <TpoSidebar />
      <div className="app-main">
        <TpoNavbar />
        <div className="app-body">

          <div className="app-hd">
            <div className="app-ey">TPO Office</div>
            <h1 className="app-title">Drive Applications</h1>
            <p className="app-sub">Review and manage student applications for placement drives.</p>
          </div>

          <div className="app-stats">
            {statCards.map((st, i) => (
              <div className="app-stat" key={i}>
                <div className="app-stat-ico" style={{ background:st.bg, border:`1px solid ${st.bc}` }}>
                  {st.icon}
                </div>
                <div>
                  <div className="app-stat-val">{loading ? "—" : st.val}</div>
                  <div className="app-stat-lbl">{st.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="app-filters">
            {[
              { id:"all",      label:"All",      count:apps.length     },
              { id:"pending",  label:"Pending",  count:pending.length  },
              { id:"accepted", label:"Accepted", count:accepted.length },
              { id:"rejected", label:"Rejected", count:rejected.length },
            ].map(f => (
              <button key={f.id} className={`app-filter${filter===f.id?" act":""}`} onClick={() => setFilter(f.id)}>
                {f.label}
                <span className="app-filter-count">{f.count}</span>
              </button>
            ))}
          </div>

          <div className="app-search-wrap">
            <svg className="app-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="app-search-in"
              placeholder="Search by student name, email, company or drive…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="app-card">
            <div className="app-ch">
              <div className="app-ct">
                <div className="app-ci" style={{ background:"#EBF2FD", border:"1px solid #C2D6FA" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                Applications
              </div>
              <span style={{ fontSize:11.5, color:"#B0BAC8", fontWeight:600 }}>
                {displayed.length} result{displayed.length !== 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div style={{ padding:20, display:"flex", flexDirection:"column", gap:12 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"center" }}>
                    <div className="app-sk" style={{ width:34, height:34, borderRadius:9, flexShrink:0 }}/>
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                      <div className="app-sk" style={{ height:13, width:"30%" }}/>
                      <div className="app-sk" style={{ height:11, width:"50%" }}/>
                    </div>
                    <div className="app-sk" style={{ height:28, width:90, borderRadius:7 }}/>
                    <div className="app-sk" style={{ height:28, width:90, borderRadius:7 }}/>
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="app-empty">
                <div className="app-empty-ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:"#0D1C33", marginBottom:4 }}>
                  {search ? "No results found" : "No applications yet"}
                </div>
                <div style={{ fontSize:13, color:"#7A8599" }}>
                  {search ? "Try a different search term." : "Applications will appear here when students apply."}
                </div>
              </div>
            ) : (
              <div className="app-table-wrap">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Drive / Company</th>
                      <th>Applied On</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((app, i) => {
                      const st = STATUS_STYLE[app.status] || STATUS_STYLE.pending;
                      return (
                        <tr key={app._id} style={{ animation:`appIn 0.35s ease ${i * 35}ms both` }}>
                          <td style={{ color:"#B0BAC8", fontWeight:600, fontSize:12 }}>{i + 1}</td>

                          <td>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div className="app-av">{initials(app.student?.name)}</div>
                              <div>
                                <div style={{ fontWeight:700, color:"#0D1C33", fontSize:13 }}>{app.student?.name || "—"}</div>
                                <div style={{ fontSize:11.5, color:"#7A8599", marginTop:1 }}>{app.student?.email || "—"}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight:700, color:"#0D1C33", fontSize:13 }}>{app.announcement?.title || "—"}</div>
                            {app.announcement?.company && (
                              <div style={{ fontSize:11.5, color:"#3B7DED", fontWeight:600, marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                                {app.announcement.company}
                              </div>
                            )}
                          </td>

                          <td style={{ color:"#7A8599", fontSize:12.5 }}>{fmtDate(app.createdAt)}</td>

                          <td>
                            <span className="app-status" style={{ background:st.bg, color:st.color }}>
                              <span className="app-status-dot" style={{ background:st.dot }}/>
                              {st.label}
                            </span>
                          </td>

                          <td>
                            {app.status === "pending" ? (
                              <div style={{ display:"flex", gap:7 }}>
                                <button className="app-action app-action-accept" onClick={() => setAcceptModal(app)}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                  Accept
                                </button>
                                <button className="app-action app-action-reject" onClick={() => { setReason(""); setRejectModal(app); }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize:11.5, color:"#B0BAC8", fontStyle:"italic" }}>Reviewed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>

    {acceptModal && (
      <div className="app-overlay" onClick={() => !acting && setAcceptModal(null)}>
        <div className="app-modal" onClick={e => e.stopPropagation()}>
          <div style={{ width:48, height:48, borderRadius:12, marginBottom:18, background:"#F0FDF4", border:"1px solid #BBF7D0", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <div style={{ fontSize:17, fontWeight:800, color:"#0D1C33", marginBottom:8 }}>Accept Application?</div>

          <div style={{ background:"#F8FAFC", border:"1px solid #E2E4E9", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#0D1C33" }}>{acceptModal.student?.name}</div>
            <div style={{ fontSize:12, color:"#7A8599", marginTop:3, display:"flex", alignItems:"center", gap:5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7A8599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              {acceptModal.announcement?.title}{acceptModal.announcement?.company && ` — ${acceptModal.announcement.company}`}
            </div>
          </div>

          <div style={{ fontSize:13, color:"#7A8599", lineHeight:1.65, marginBottom:24 }}>
            This will mark the application as <strong style={{ color:"#16A34A" }}>Accepted</strong>. The student will be notified.
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", flexWrap:"wrap" }}>
            <button onClick={() => setAcceptModal(null)} disabled={acting} style={{ height:38, padding:"0 16px", borderRadius:8, border:"1px solid #E2E4E9", background:"#F0F2F6", color:"#4A5568", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12.5, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={handleAccept} disabled={acting} style={{ height:38, padding:"0 20px", borderRadius:8, border:"none", cursor:acting?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12.5, background:"linear-gradient(135deg,#059669,#10B981)", color:"#fff", display:"flex", alignItems:"center", gap:7, boxShadow:"0 3px 10px rgba(5,150,105,0.25)", opacity:acting?0.7:1 }}>
              {acting
                ? <><div className="app-spinner"/>Processing…</>
                : <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Yes, Accept
                  </>
              }
            </button>
          </div>
        </div>
      </div>
    )}

    {rejectModal && (
      <div className="app-overlay" onClick={() => !acting && setRejectModal(null)}>
        <div className="app-modal" onClick={e => e.stopPropagation()}>
          <div style={{ width:48, height:48, borderRadius:12, marginBottom:18, background:"#FEF2F2", border:"1px solid #FECACA", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>

          <div style={{ fontSize:17, fontWeight:800, color:"#0D1C33", marginBottom:8 }}>Reject Application?</div>

          <div style={{ background:"#F8FAFC", border:"1px solid #E2E4E9", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#0D1C33" }}>{rejectModal.student?.name}</div>
            <div style={{ fontSize:12, color:"#7A8599", marginTop:3, display:"flex", alignItems:"center", gap:5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7A8599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              {rejectModal.announcement?.title}{rejectModal.announcement?.company && ` — ${rejectModal.announcement.company}`}
            </div>
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#7A8599", display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7A8599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Reason for Rejection
              <span style={{ color:"#B0BAC8", fontWeight:500, textTransform:"none", letterSpacing:0 }}>(optional)</span>
            </label>
            <textarea
              className="app-reason-ta"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. CGPA below required threshold, department mismatch…"
              rows={4}
              autoFocus
            />
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", flexWrap:"wrap" }}>
            <button onClick={() => { setRejectModal(null); setReason(""); }} disabled={acting} style={{ height:38, padding:"0 16px", borderRadius:8, border:"1px solid #E2E4E9", background:"#F0F2F6", color:"#4A5568", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12.5, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={handleReject} disabled={acting} style={{ height:38, padding:"0 20px", borderRadius:8, border:"none", cursor:acting?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:12.5, background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"#fff", display:"flex", alignItems:"center", gap:7, boxShadow:"0 3px 10px rgba(220,38,38,0.22)", opacity:acting?0.7:1 }}>
              {acting
                ? <><div className="app-spinner"/>Processing…</>
                : <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Yes, Reject
                  </>
              }
            </button>
          </div>
        </div>
      </div>
    )}

    {toast.msg && (
      <div className="app-toast" style={{ borderColor: toast.type === "err" ? "#FECACA" : "#E2E4E9" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={toast.type === "err" ? "#DC2626" : "#16A34A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {toast.type === "err"
            ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
            : <polyline points="20 6 9 17 4 12"/>}
        </svg>
        {toast.msg}
      </div>
    )}
    </>
  );
}