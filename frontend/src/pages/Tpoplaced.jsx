import { useEffect, useState } from "react";
import axios from "axios";
import TpoNavbar  from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";

if (!document.getElementById("tpop-styles")) {
  const s = document.createElement("style");
  s.id = "tpop-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes pUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pShim { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes pPop  { from{opacity:0;transform:scale(0.95) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes pFade { from{opacity:0} to{opacity:1} }
    @keyframes pSpin { to{transform:rotate(360deg)} }
    @keyframes pToast{ from{opacity:0;transform:translateY(12px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes pBadge{ from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }

    .p-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .p-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .p-body { flex:1; padding:30px 36px 60px; overflow-y:auto; }

    /* header */
    .p-hd    { margin-bottom:22px; animation:pUp 0.45s ease both; }
    .p-ey    { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#059669; margin-bottom:6px; display:flex; align-items:center; gap:7px; }
    .p-ey::before { content:''; width:18px; height:2px; background:#059669; border-radius:2px; }
    .p-title { font-size:26px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; }
    .p-sub   { font-size:13px; color:#7A8599; margin-top:4px; }

    /* stats */
    .p-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; animation:pUp 0.45s 0.04s ease both; }
    .p-stat  { background:#fff; border:1px solid #E2E4E9; border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:12px; transition:box-shadow 0.2s,transform 0.2s; }
    .p-stat:hover { box-shadow:0 4px 16px rgba(0,0,0,0.07); transform:translateY(-2px); }
    .p-stat-ico { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .p-stat-val { font-size:22px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; line-height:1; }
    .p-stat-lbl { font-size:11px; color:#7A8599; margin-top:3px; }

    /* filter bar */
    .p-filter-bar { display:grid; grid-template-columns:1fr auto auto auto auto; gap:10px; align-items:end; margin-bottom:20px; animation:pUp 0.45s 0.07s ease both; }
    .p-field { display:flex; flex-direction:column; gap:5px; }
    .p-lbl   { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; }
    .p-sel, .p-in {
      height:40px; border:1px solid #E2E4E9; border-radius:9px; padding:0 12px;
      background:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#0D1C33; outline:none;
      appearance:none; transition:border-color 0.18s, box-shadow 0.18s;
    }
    .p-sel:focus, .p-in:focus { border-color:#059669; box-shadow:0 0 0 3px rgba(5,150,105,0.1); }
    .p-in::placeholder { color:#C0C8D5; }

    /* buttons */
    .p-btn { height:40px; border:none; border-radius:9px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:6px; padding:0 16px; transition:transform 0.15s, box-shadow 0.15s, opacity 0.15s; white-space:nowrap; }
    .p-btn:hover:not(:disabled) { transform:translateY(-1px); }
    .p-btn:disabled { opacity:0.5; cursor:not-allowed; }
    .p-btn-green  { background:linear-gradient(135deg,#059669,#10B981); color:#fff; box-shadow:0 3px 10px rgba(5,150,105,0.22); }
    .p-btn-green:hover:not(:disabled) { box-shadow:0 6px 16px rgba(5,150,105,0.3); }
    .p-btn-red    { background:linear-gradient(135deg,#DC2626,#EF4444); color:#fff; box-shadow:0 3px 10px rgba(220,38,38,0.2); }
    .p-btn-red:hover:not(:disabled) { box-shadow:0 6px 16px rgba(220,38,38,0.28); }
    .p-btn-outline{ background:#fff; color:#7A8599; border:1px solid #E2E4E9; }
    .p-btn-outline:hover:not(:disabled) { color:#0D1C33; border-color:#C7D9F5; }
    .p-spinner { width:13px; height:13px; border-radius:50%; border:2px solid rgba(255,255,255,0.35); border-top-color:#fff; animation:pSpin 0.65s linear infinite; }

    /* table card */
    .p-card { background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden; animation:pUp 0.45s 0.1s ease both; }
    .p-ch   { padding:15px 20px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; justify-content:space-between; }
    .p-ct   { font-size:14px; font-weight:800; color:#0D1C33; display:flex; align-items:center; gap:9px; }
    .p-ci   { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }

    /* table */
    .p-table-wrap { overflow-x:auto; }
    table.p-table { width:100%; border-collapse:collapse; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; }
    .p-table th { padding:11px 16px; background:#F8FAFC; text-align:left; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; border-bottom:1px solid #F0F2F6; white-space:nowrap; }
    .p-table td { padding:13px 16px; border-bottom:1px solid #F5F7FA; vertical-align:middle; }
    .p-table tbody tr:last-child td { border-bottom:none; }
    .p-table tbody tr { transition:background 0.12s; }
    .p-table tbody tr:hover { background:#FAFBFF; }

    /* avatar */
    .p-av { width:36px; height:36px; border-radius:9px; background:linear-gradient(135deg,#1B3A6B,#2563EB); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:#fff; flex-shrink:0; }

    /* status badges */
    .p-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
    .p-badge-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

    /* action buttons inline */
    .p-act { height:32px; padding:0 14px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:11.5px; font-weight:700; display:inline-flex; align-items:center; gap:5px; transition:transform 0.15s, box-shadow 0.15s, opacity 0.15s; white-space:nowrap; }
    .p-act:hover:not(:disabled) { transform:translateY(-1px); }
    .p-act:disabled { opacity:0.5; cursor:not-allowed; }
    .p-act-place  { background:linear-gradient(135deg,#059669,#10B981); color:#fff; box-shadow:0 2px 6px rgba(5,150,105,0.22); }
    .p-act-place:hover:not(:disabled) { box-shadow:0 4px 12px rgba(5,150,105,0.32); }
    .p-act-unplace{ background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; }
    .p-act-unplace:hover:not(:disabled) { background:#FEE2E2; }

    /* confirm modal */
    .p-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.45); backdrop-filter:blur(2px); display:flex; align-items:center; justify-content:center; animation:pFade 0.2s ease both; }
    .p-modal   { background:#fff; border-radius:18px; padding:28px; width:400px; box-shadow:0 24px 64px rgba(0,0,0,0.18); font-family:'Plus Jakarta Sans',sans-serif; animation:pPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }

    /* skeleton */
    .p-sk { background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%); background-size:200% 100%; animation:pShim 1.5s ease infinite; border-radius:4px; }

    /* empty */
    .p-empty { display:flex; flex-direction:column; align-items:center; padding:64px 24px; text-align:center; }
    .p-empty-ico { width:52px; height:52px; border-radius:13px; background:#F0FDF4; border:1px solid #BBF7D0; display:flex; align-items:center; justify-content:center; margin-bottom:14px; color:#16A34A; }

    /* toast */
    .p-toast { position:fixed; bottom:28px; right:28px; z-index:999; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #E2E4E9; border-radius:12px; padding:12px 16px; box-shadow:0 8px 28px rgba(0,0,0,0.1); animation:pToast 0.3s cubic-bezier(0.34,1.56,0.64,1) both; font-size:13px; font-weight:600; color:#0D1C33; max-width:300px; }
  `;
  document.head.appendChild(s);
}

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL + "/api"
    : "http://localhost:5000/api",
});
const tk  = () => ({ headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } });

const initials = (name="") => name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();

const deptColor = (d) => {
  const map = {
    IT:{bg:"#EBF2FD",color:"#1B3A6B"}, CS:{bg:"#F5F3FF",color:"#7C3AED"},
    MECH:{bg:"#FEF3C7",color:"#92400E"}, CIVIL:{bg:"#ECFDF5",color:"#065F46"},
    ENTC:{bg:"#F0F9FF",color:"#0369A1"}, EE:{bg:"#FEF2F2",color:"#DC2626"},
    ELECTRICAL:{bg:"#FEF2F2",color:"#DC2626"},
  };
  return map[d] || { bg:"#F0F2F6", color:"#4A5568" };
};

/* ─────────────────────────────
   Professional SVG Icon Library
───────────────────────────── */

// Users group — Total Students
const IcoUsers = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// Briefcase — Placed (job/employment)
const IcoBriefcase = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

// User Search / Unplaced — person with magnifier
const IcoUserSearch = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="8" r="4"/>
    <path d="M2 20c0-4 3.6-7 8-7"/>
    <circle cx="18" cy="17" r="3"/>
    <line x1="20.5" y1="19.5" x2="22" y2="21"/>
  </svg>
);

// Trend / Percent — Placement Rate
const IcoTrendUp = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

export default function TpoPlaced() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [toast,    setToast]    = useState({ msg:"", type:"ok" });

  const [search,  setSearch]  = useState("");
  const [fBranch, setFBranch] = useState("");
  const [fStatus, setFStatus] = useState("");

  useEffect(() => {
    axios.get(`${API}/user/students`, tk())
      .then(res => { setStudents(res.data); setFiltered(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"ok" }), 3000);
  };

  const applyFilters = (studs = students, q = search, br = fBranch, st = fStatus) => {
    let data = [...studs];
    if (q)  data = data.filter(s =>
      s.name?.toLowerCase().includes(q.toLowerCase()) ||
      s.email?.toLowerCase().includes(q.toLowerCase()) ||
      s.adm_no?.toLowerCase().includes(q.toLowerCase())
    );
    if (br) data = data.filter(s => s.department === br || s.branch === br);
    if (st === "placed")   data = data.filter(s => s.status==="placed" || s.isPlaced);
    if (st === "unplaced") data = data.filter(s => s.status!=="placed" && !s.isPlaced);
    setFiltered(data);
  };

  const handleSearch = (v)  => { setSearch(v);  applyFilters(students, v, fBranch, fStatus); };
  const handleBranch = (v)  => { setFBranch(v); applyFilters(students, search, v, fStatus); };
  const handleStatus = (v)  => { setFStatus(v); applyFilters(students, search, fBranch, v); };
  const resetFilters = ()   => { setSearch(""); setFBranch(""); setFStatus(""); setFiltered(students); };

  const updatePlacement = async (student, action) => {
    setActing(student._id);
    const isPlacing = action === "place";
    try {
      if (isPlacing) {
        await axios.put(`${API}/user/mark-placed/${student._id}`, {}, tk());
      } else {
        await axios.put(`${API}/user/mark-unplaced/${student._id}`, {}, tk());
      }
      const updated = students.map(s =>
        s._id === student._id
          ? { ...s, status: isPlacing ? "placed" : "open", isPlaced: isPlacing }
          : s
      );
      setStudents(updated);
      applyFilters(updated, search, fBranch, fStatus);
      showToast(
        isPlacing
          ? `${student.name} marked as Placed!`
          : `${student.name} marked as Unplaced.`
      );
      setConfirm(null);
    } catch(e) {
      showToast("Failed to update. Please try again.", "err");
    } finally {
      setActing(null);
    }
  };

  const placed   = students.filter(s => s.status==="placed" || s.isPlaced).length;
  const unplaced = students.length - placed;
  const rate     = students.length ? Math.round((placed/students.length)*100) : 0;

  /* stat card definitions — SVG icons replacing emojis */
  const statCards = [
    { icon:<IcoUsers      size={20} color="#3B7DED" sw={1.8}/>, val:students.length, lbl:"Total Students", bg:"#EBF2FD", bc:"#C2D6FA" },
    { icon:<IcoBriefcase  size={20} color="#16A34A" sw={1.8}/>, val:placed,          lbl:"Placed",         bg:"#F0FDF4", bc:"#BBF7D0" },
    { icon:<IcoUserSearch size={20} color="#D97706" sw={1.8}/>, val:unplaced,        lbl:"Unplaced",       bg:"#FEF3C7", bc:"#FDE68A" },
    { icon:<IcoTrendUp    size={20} color="#7C3AED" sw={1.8}/>, val:`${rate}%`,      lbl:"Placement Rate", bg:"#F5F3FF", bc:"#DDD6FE" },
  ];

  return (
    <>
    <div className="p-root">
      <TpoSidebar />
      <div className="p-main">
        <TpoNavbar />
        <div className="p-body">

          {/* Header */}
          <div className="p-hd">
            <div className="p-ey">Placement Management</div>
            <h1 className="p-title">Mark Placed / Unplaced</h1>
            <p className="p-sub">Update student placement status. Changes reflect immediately across the portal.</p>
          </div>

          {/* Stats — professional SVG icons */}
          <div className="p-stats">
            {statCards.map((st, i) => (
              <div className="p-stat" key={i}>
                <div className="p-stat-ico" style={{ background:st.bg, border:`1px solid ${st.bc}` }}>
                  {st.icon}
                </div>
                <div>
                  <div className="p-stat-val">{loading ? "—" : st.val}</div>
                  <div className="p-stat-lbl">{st.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="p-filter-bar">
            <div className="p-field">
              <label className="p-lbl">Search</label>
              <div style={{ position:"relative" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0C8D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="p-in"
                  style={{ paddingLeft:38, width:"100%" }}
                  placeholder="Name, email, roll number…"
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="p-field">
              <label className="p-lbl">Branch</label>
              <select className="p-sel" value={fBranch} onChange={e => handleBranch(e.target.value)}>
                <option value="">All Branches</option>
                {["IT","MECH","CIVIL","ENTC","ELECTRICAL"].map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="p-field">
              <label className="p-lbl">Status</label>
              <select className="p-sel" value={fStatus} onChange={e => handleStatus(e.target.value)}>
                <option value="">All Students</option>
                <option value="placed">Placed Only</option>
                <option value="unplaced">Unplaced Only</option>
              </select>
            </div>
            <button className="p-btn p-btn-outline" onClick={resetFilters} style={{ alignSelf:"flex-end" }}>
              {/* Refresh/reset icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
              Reset
            </button>
          </div>

          {/* Table card */}
          <div className="p-card">
            <div className="p-ch">
              <div className="p-ct">
                <div className="p-ci" style={{ background:"#F0FDF4", border:"1px solid #BBF7D0" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                Student Placement Status
              </div>
              <span style={{ fontSize:11.5, color:"#B0BAC8", fontWeight:600 }}>
                {filtered.length} student{filtered.length!==1?"s":""}
              </span>
            </div>

            {loading ? (
              <div style={{ padding:20, display:"flex", flexDirection:"column", gap:12 }}>
                {[1,2,3,4,5].map(i=>(
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"center" }}>
                    <div className="p-sk" style={{ width:36, height:36, borderRadius:9, flexShrink:0 }}/>
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                      <div className="p-sk" style={{ height:13, width:"35%" }}/>
                      <div className="p-sk" style={{ height:11, width:"50%" }}/>
                    </div>
                    <div className="p-sk" style={{ height:28, width:80, borderRadius:7 }}/>
                    <div className="p-sk" style={{ height:28, width:110, borderRadius:7 }}/>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-empty">
                <div className="p-empty-ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:"#0D1C33", marginBottom:4 }}>No students found</div>
                <div style={{ fontSize:13, color:"#7A8599" }}>Try adjusting your filters.</div>
              </div>
            ) : (
              <div className="p-table-wrap">
                <table className="p-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Adm No</th>
                      <th>Branch</th>
                      <th>CGPA</th>
                      <th>Current Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => {
                      const isPlaced = s.status === "placed" || s.isPlaced;
                      const dp = deptColor(s.department || s.branch);
                      const isActing = acting === s._id;
                      return (
                        <tr key={s._id} style={{ animation:`pIn 0.3s ease ${i*30}ms both` }}>

                          <td style={{ color:"#B0BAC8", fontWeight:600, fontSize:12 }}>{i+1}</td>

                          <td>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div className="p-av">{initials(s.name)}</div>
                              <div>
                                <div style={{ fontWeight:700, color:"#0D1C33", fontSize:13 }}>{s.name}</div>
                                <div style={{ fontSize:11.5, color:"#7A8599", marginTop:1 }}>{s.email}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ fontSize:12, color:"#7A8599", fontWeight:600 }}>{s.adm_no||"—"}</td>

                          <td>
                            <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:5, fontSize:11, fontWeight:700, background:dp.bg, color:dp.color }}>
                              {s.department||s.branch||"—"}
                            </span>
                          </td>

                          <td style={{ fontWeight:700, color:"#0D1C33", fontSize:13 }}>
                            {Number(s.cgpa||0).toFixed(2)}
                          </td>

                          <td>
                            <span className="p-badge" style={{
                              background: isPlaced ? "#F0FDF4" : "#FEF3C7",
                              color:      isPlaced ? "#16A34A" : "#92400E",
                            }}>
                              <span className="p-badge-dot" style={{ background: isPlaced ? "#16A34A" : "#D97706" }}/>
                              {isPlaced ? "Placed" : "Unplaced"}
                            </span>
                          </td>

                          <td>
                            {isPlaced ? (
                              <button
                                className="p-act p-act-unplace"
                                disabled={isActing}
                                onClick={() => setConfirm({ student:s, action:"unplace" })}
                              >
                                {isActing
                                  ? <div className="p-spinner" style={{ borderTopColor:"#DC2626", borderColor:"#FECACA" }}/>
                                  : (
                                    /* Undo / rotate-back icon */
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="1 4 1 10 7 10"/>
                                      <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                                    </svg>
                                  )
                                }
                                Mark Unplaced
                              </button>
                            ) : (
                              <button
                                className="p-act p-act-place"
                                disabled={isActing}
                                onClick={() => setConfirm({ student:s, action:"place" })}
                              >
                                {isActing
                                  ? <div className="p-spinner"/>
                                  : (
                                    /* Checkmark icon */
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                  )
                                }
                                Mark Placed
                              </button>
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

    {/* ── Confirm Modal ── */}
    {confirm && (
      <div className="p-overlay" onClick={() => !acting && setConfirm(null)}>
        <div className="p-modal" onClick={e => e.stopPropagation()}>

          {/* Icon */}
          <div style={{
            width:52, height:52, borderRadius:13, marginBottom:18,
            background: confirm.action==="place" ? "#F0FDF4" : "#FEF2F2",
            border:`1px solid ${confirm.action==="place" ? "#BBF7D0" : "#FECACA"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {confirm.action === "place"
              ? (
                /* Briefcase icon — marking as employed/placed */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              ) : (
                /* Undo arrow — reverting placement */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                </svg>
              )
            }
          </div>

          <div style={{ fontSize:17, fontWeight:800, color:"#0D1C33", marginBottom:8 }}>
            {confirm.action==="place" ? "Mark as Placed?" : "Mark as Unplaced?"}
          </div>

          {/* Student preview */}
          <div style={{ background:"#F8FAFC", border:"1px solid #E2E4E9", borderRadius:10, padding:"13px 16px", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div className="p-av" style={{ width:34, height:34, fontSize:11 }}>{initials(confirm.student.name)}</div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#0D1C33" }}>{confirm.student.name}</div>
                <div style={{ fontSize:11.5, color:"#7A8599", marginTop:2 }}>
                  {confirm.student.adm_no && `${confirm.student.adm_no} · `}
                  {confirm.student.department||confirm.student.branch} · CGPA {Number(confirm.student.cgpa||0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize:13, color:"#7A8599", lineHeight:1.65, marginBottom:24 }}>
            {confirm.action === "place"
              ? "This will update the student's status to Placed. They will no longer appear as available for drives."
              : "This will revert the student's status to Unplaced. They will again be eligible for placement drives."}
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button
              className="p-btn p-btn-outline"
              onClick={() => setConfirm(null)}
              disabled={!!acting}
            >
              Cancel
            </button>
            <button
              className={`p-btn ${confirm.action==="place" ? "p-btn-green" : "p-btn-red"}`}
              onClick={() => updatePlacement(confirm.student, confirm.action)}
              disabled={!!acting}
            >
              {acting
                ? <><div className="p-spinner"/>Processing…</>
                : <>
                    {confirm.action === "place"
                      ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 1 10 7 10"/>
                          <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                        </svg>
                      )
                    }
                    {confirm.action === "place" ? "Yes, Mark Placed" : "Yes, Mark Unplaced"}
                  </>
              }
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Toast */}
    {toast.msg && (
      <div className="p-toast" style={{ borderColor: toast.type==="err" ? "#FECACA" : "#E2E4E9" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={toast.type==="err" ? "#DC2626" : "#16A34A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {toast.type==="err"
            ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
            : <polyline points="20 6 9 17 4 12"/>}
        </svg>
        {toast.msg}
      </div>
    )}
    </>
  );
}