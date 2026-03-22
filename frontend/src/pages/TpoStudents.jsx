import { useEffect, useState } from "react";
import TpoNavbar  from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import API from "../api";

if (!document.getElementById("tpostu-styles")) {
  const s = document.createElement("style");
  s.id = "tpostu-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes stuUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes stuShim { from{background-position:200% 0} to{background-position:-200% 0} }

    .stu-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .stu-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .stu-body { flex:1; padding:30px 36px; overflow-y:auto; }

    /* header */
    .stu-hd    { margin-bottom:22px; animation:stuUp 0.45s ease both; }
    .stu-ey    { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#3B7DED; margin-bottom:6px; display:flex; align-items:center; gap:7px; }
    .stu-ey::before { content:''; width:18px; height:2px; background:#3B7DED; border-radius:2px; }
    .stu-title { font-size:26px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; }
    .stu-sub   { font-size:13px; color:#7A8599; margin-top:4px; }

    /* stats */
    .stu-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; animation:stuUp 0.45s 0.04s ease both; }
    .stu-stat  { background:#fff; border:1px solid #E2E4E9; border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:12px; }
    .stu-stat-ico { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .stu-stat-val { font-size:22px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; line-height:1; }
    .stu-stat-lbl { font-size:11px; color:#7A8599; margin-top:3px; }

    /* card */
    .stu-card { background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden; margin-bottom:20px; animation:stuUp 0.45s 0.08s ease both; }
    .stu-ch   { padding:15px 20px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; justify-content:space-between; }
    .stu-ct   { font-size:14px; font-weight:800; color:#0D1C33; display:flex; align-items:center; gap:9px; }
    .stu-ci   { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
    .stu-cb   { padding:20px; }

    /* filters */
    .stu-fg  { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:10px; }
    .stu-fg2 { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; margin-bottom:14px; }
    .stu-field { display:flex; flex-direction:column; gap:5px; }
    .stu-lbl   { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; }
    .stu-sel, .stu-in {
      height:38px; border:1px solid #E2E4E9; border-radius:8px; padding:0 12px;
      background:#F9FAFB; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#0D1C33; outline:none;
      appearance:none; transition:border-color 0.18s, box-shadow 0.18s;
    }
    .stu-sel:focus, .stu-in:focus { border-color:#3B7DED; box-shadow:0 0 0 3px rgba(59,125,237,0.1); background:#fff; }
    .stu-in::placeholder { color:#C0C8D5; }

    /* buttons */
    .stu-btn { height:38px; border:none; border-radius:8px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:6px; padding:0 16px; transition:transform 0.15s, box-shadow 0.15s; }
    .stu-btn:hover:not(:disabled) { transform:translateY(-1px); }
    .stu-btn-primary { background:linear-gradient(135deg,#1B3A6B,#2563EB); color:#fff; box-shadow:0 3px 10px rgba(27,58,107,0.2); }
    .stu-btn-primary:hover { box-shadow:0 6px 16px rgba(27,58,107,0.28); }
    .stu-btn-outline { background:#fff; color:#7A8599; border:1px solid #E2E4E9; }
    .stu-btn-outline:hover { color:#0D1C33; border-color:#C7D9F5; }
    .stu-btn-green   { background:linear-gradient(135deg,#059669,#10B981); color:#fff; box-shadow:0 3px 10px rgba(5,150,105,0.18); }
    .stu-btn-green:hover { box-shadow:0 6px 16px rgba(5,150,105,0.28); }

    /* table */
    .stu-table-wrap { overflow-x:auto; }
    table.stu-table { width:100%; border-collapse:collapse; font-size:12.5px; font-family:'Plus Jakarta Sans',sans-serif; }
    .stu-table th { padding:10px 14px; background:#F8FAFC; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; border-bottom:1px solid #F0F2F6; white-space:nowrap; text-align:left; }
    .stu-table td { padding:12px 14px; border-bottom:1px solid #F5F7FA; color:#2D3748; vertical-align:middle; }
    .stu-table tbody tr:last-child td { border-bottom:none; }
    .stu-table tbody tr { transition:background 0.12s; }
    .stu-table tbody tr:hover { background:#FAFBFF; }

    .stu-pill  { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:700; }
    .stu-tag   { display:inline-flex; align-items:center; padding:2px 8px; border-radius:5px; font-size:11px; font-weight:700; }
    .stu-skill { display:inline-block; background:#EBF2FD; color:#1B3A6B; border:1px solid #C2D6FA; border-radius:4px; padding:2px 7px; font-size:10.5px; font-weight:700; margin:2px; }

    /* skeleton */
    .stu-sk { background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%); background-size:200% 100%; animation:stuShim 1.5s ease infinite; border-radius:4px; }

    /* empty */
    .stu-empty { padding:48px 24px; text-align:center; color:#B0BAC8; font-size:13px; }

    /* resume modal */
    @keyframes stuFade { from{opacity:0} to{opacity:1} }
    @keyframes stuPop  { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
    .stu-overlay { position:fixed; inset:0; z-index:400; background:rgba(0,0,0,0.6); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; animation:stuFade 0.2s ease both; padding:20px; }
    .stu-resume-modal { background:#1A1F2E; border-radius:16px; width:min(860px,100%); height:90vh; display:flex; flex-direction:column; box-shadow:0 32px 80px rgba(0,0,0,0.5); animation:stuPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; overflow:hidden; }
    .stu-resume-header { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; background:#12172A; border-bottom:1px solid rgba(255,255,255,0.08); flex-shrink:0; }
    .stu-resume-title  { font-size:13.5px; font-weight:700; color:#F0F4FA; display:flex; align-items:center; gap:9px; }
    .stu-resume-badge  { background:rgba(59,125,237,0.2); border:1px solid rgba(59,125,237,0.3); color:#60A5FA; padding:3px 10px; border-radius:5px; font-size:10.5px; font-weight:700; }
    .stu-resume-actions { display:flex; align-items:center; gap:8px; }
    .stu-resume-btn { height:32px; padding:0 14px; border-radius:7px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:6px; transition:transform 0.15s, opacity 0.15s; }
    .stu-resume-btn:hover { transform:translateY(-1px); opacity:0.9; }
    .stu-resume-btn-open  { background:linear-gradient(135deg,#1B3A6B,#2563EB); color:#fff; }
    .stu-resume-btn-close { background:rgba(255,255,255,0.08); color:#94A3B8; border:1px solid rgba(255,255,255,0.1); }
    .stu-resume-btn-close:hover { background:rgba(255,255,255,0.14); color:#F0F4FA; }
    .stu-resume-body { flex:1; overflow:hidden; position:relative; }
    .stu-resume-iframe { width:100%; height:100%; border:none; display:block; }
    .stu-resume-loading { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:#94A3B8; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; }
    .stu-resume-spinner { width:32px; height:32px; border-radius:50%; border:3px solid rgba(59,125,237,0.2); border-top-color:#3B7DED; animation:stuShim 0.8s linear infinite; }
    @keyframes stuSpin { to{transform:rotate(360deg)} }
    .stu-resume-spinner { animation:stuSpin 0.8s linear infinite; }
  `;
  document.head.appendChild(s);
}

const tk  = () => ({ headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } });

const cgpaColor = (c) => {
  if (c >= 8.5) return { bg:"#F0FDF4", color:"#16A34A" };
  if (c >= 7)   return { bg:"#FEF3C7", color:"#92400E" };
  return { bg:"#FEF2F2", color:"#DC2626" };
};
const deptColor = (d) => {
  const map = { IT:{bg:"#EBF2FD",color:"#1B3A6B"}, CS:{bg:"#F5F3FF",color:"#7C3AED"}, MECH:{bg:"#FEF3C7",color:"#92400E"}, CIVIL:{bg:"#ECFDF5",color:"#065F46"}, ENTC:{bg:"#F0F9FF",color:"#0369A1"}, EE:{bg:"#FEF2F2",color:"#DC2626"}, ELECTRICAL:{bg:"#FEF2F2",color:"#DC2626"} };
  return map[d] || { bg:"#F0F2F6", color:"#4A5568" };
};

/* ── Professional SVG Icon Components ── */

// Total Students icon — group of people
const IconUsers = ({ color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// Filtered Results icon — funnel/filter
const IconFilter = ({ color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

// Placed icon — briefcase
const IconBriefcase = ({ color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

// CGPA / Academic icon — graduation cap
const IconAcademic = ({ color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
  </svg>
);

// Indian Rupee icon — ₹
const IconRupee = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12"/>
    <path d="M6 8h12"/>
    <path d="M6 13l8.5 8"/>
    <path d="M6 13h3a4 4 0 0 0 0-8"/>
  </svg>
);

export default function TpoStudents() {
  const [students,  setStudents]  = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showSkills,  setShowSkills]  = useState(true);
  const [resumeModal, setResumeModal] = useState(null);
  const [page,      setPage]      = useState(1);
  const PAGE_SIZE = 50;

  /* filters */
  const [fSem,    setFSem]    = useState("");
  const [fBranch, setFBranch] = useState("");
  const [fSkill,  setFSkill]  = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fMin,    setFMin]    = useState("");
  const [fMax,    setFMax]    = useState("");
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    API.get(`/user/students`, tk())
      .then(res => { setStudents(res.data); setFiltered(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = () => {
    let data = [...students];
    if (search)   data = data.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.adm_no?.toLowerCase().includes(search.toLowerCase()));
    if (fSem)     data = data.filter(s => String(s.semester) === fSem);
    if (fBranch)  data = data.filter(s => s.department === fBranch || s.branch === fBranch);
    if (fSkill)   data = data.filter(s => s.skills?.some(sk => sk.toLowerCase().includes(fSkill.toLowerCase())));
    if (fStatus)  data = data.filter(s => (s.status||"open") === fStatus);
    if (fMin)     data = data.filter(s => Number(s.cgpa) >= Number(fMin));
    if (fMax)     data = data.filter(s => Number(s.cgpa) <= Number(fMax));
    setFiltered(data);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch(""); setFSem(""); setFBranch(""); setFSkill(""); setFStatus(""); setFMin(""); setFMax("");
    setFiltered(students);
    setPage(1);
  };

  const downloadCSV = () => {
    const header = "Name,Roll Number,Email,Semester,Branch,CGPA,Skills,Status";
    const rows   = filtered.map(s =>
      `${s.name},${s.adm_no||""},${s.email||""},${s.semester||""},${s.department||s.branch||""},${s.cgpa||""},${(s.skills||[]).join("|")},${s.status||"open"}`
    );
    const blob = new Blob([[header,...rows].join("\n")],{type:"text/csv"});
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"students.csv"}).click();
  };

  const placed  = students.filter(s=>s.status==="placed"||s.isPlaced).length;
  const highCGPA= students.filter(s=>Number(s.cgpa)>=8).length;

  const viewResume = (student) => {
  if (!student.resume) {
    alert("No resume uploaded");
    return;
  }

  const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${base}${student.resume}`;

  setResumeModal({ name: student.name, url });
};

  /* stat card definitions — SVG icons replacing emojis */
  const statCards = [
    {
      icon: <IconUsers color="#3B7DED" size={20} />,
      val: students.length,
      lbl: "Total Students",
      bg: "#EBF2FD",
      bc: "#C2D6FA",
    },
    {
      icon: <IconFilter color="#7C3AED" size={20} />,
      val: filtered.length,
      lbl: "Filtered Results",
      bg: "#F5F3FF",
      bc: "#DDD6FE",
    },
    {
      icon: <IconBriefcase color="#059669" size={20} />,
      val: placed,
      lbl: "Placed",
      bg: "#F0FDF4",
      bc: "#BBF7D0",
    },
    {
      icon: <IconAcademic color="#92400E" size={20} />,
      val: highCGPA,
      lbl: "CGPA ≥ 8.0",
      bg: "#FEF3C7",
      bc: "#FDE68A",
    },
  ];

  return (
    <>
    <div className="stu-root">
      <TpoSidebar />
      <div className="stu-main">
        <TpoNavbar />
        <div className="stu-body">

          {/* Header */}
          <div className="stu-hd">
            <div className="stu-ey">TPO Office</div>
            <h1 className="stu-title">Students</h1>
            <p className="stu-sub">Filter, search and download student records.</p>
          </div>

          {/* Stats — professional SVG icons */}
          <div className="stu-stats">
            {statCards.map((st, i) => (
              <div className="stu-stat" key={i}>
                <div
                  className="stu-stat-ico"
                  style={{ background: st.bg, border: `1px solid ${st.bc}` }}
                >
                  {st.icon}
                </div>
                <div>
                  <div className="stu-stat-val">{loading ? "—" : st.val}</div>
                  <div className="stu-stat-lbl">{st.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter card */}
          <div className="stu-card">
            <div className="stu-ch">
              <div className="stu-ct">
                <div className="stu-ci" style={{background:"#EBF2FD",border:"1px solid #C2D6FA"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                </div>
                Filter Students
              </div>
              <button className="stu-btn stu-btn-outline" style={{height:34,fontSize:12}} onClick={()=>setShowSkills(p=>!p)}>
                {/* Eye icon for Show/Hide Skills */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {showSkills ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
                {showSkills ? "Hide" : "Show"} Skills
              </button>
            </div>
            <div className="stu-cb">

              {/* Row 1 — Semester, Branch, Skills, Status + Buttons */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr) auto auto auto",gap:10,alignItems:"end",marginBottom:12}}>
                <div className="stu-field">
                  <label className="stu-lbl">Semester</label>
                  <select className="stu-sel" value={fSem} onChange={e=>setFSem(e.target.value)}>
                    <option value="">Any Semester</option>
                    {[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="stu-field">
                  <label className="stu-lbl">Branch</label>
                  <select className="stu-sel" value={fBranch} onChange={e=>setFBranch(e.target.value)}>
                    <option value="">Any Branch</option>
                    {["IT","MECH","CIVIL","ENTC","ELECTRICAL"].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="stu-field">
                  <label className="stu-lbl">Skills</label>
                  <input className="stu-in" placeholder="e.g. React" value={fSkill} onChange={e=>setFSkill(e.target.value)} />
                </div>
                <div className="stu-field">
                  <label className="stu-lbl">Status</label>
                  <select className="stu-sel" value={fStatus} onChange={e=>setFStatus(e.target.value)}>
                    <option value="">Any Status</option>
                    <option value="open">Open to Work</option>
                    <option value="placed">Placed</option>
                  </select>
                </div>
                {/* Apply Filters */}
                <button className="stu-btn stu-btn-primary" onClick={applyFilters}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  Apply Filters
                </button>
                {/* Reset */}
                <button className="stu-btn stu-btn-outline" onClick={resetFilters}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                  </svg>
                  Reset
                </button>
                {/* Download — replaced dollar icon with Indian Rupee SVG */}
                <button className="stu-btn stu-btn-green" onClick={downloadCSV}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Excel
                </button>
              </div>

              {/* Row 2 — Min/Max CGPA with Rupee icon hint */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                <div className="stu-field">
                  <label className="stu-lbl" style={{display:"flex",alignItems:"center",gap:5}}>
                    
                    Min CGPA
                  </label>
                  <input className="stu-in" type="number" step="0.1" placeholder="e.g. 6.0" value={fMin} onChange={e=>setFMin(e.target.value)} />
                </div>
                <div className="stu-field">
                  <label className="stu-lbl" style={{display:"flex",alignItems:"center",gap:5}}>
                    
                    Max CGPA
                  </label>
                  <input className="stu-in" type="number" step="0.1" placeholder="e.g. 10.0" value={fMax} onChange={e=>setFMax(e.target.value)} />
                </div>
              </div>

              {/* results label + page info */}
              {(() => {
                const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
                const safePage   = Math.min(page, totalPages || 1);
                const startIdx   = (safePage - 1) * PAGE_SIZE;
                const endIdx     = Math.min(startIdx + PAGE_SIZE, filtered.length);
                const pageRows   = filtered.slice(startIdx, endIdx);

                return (
                  <>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,fontSize:13,fontWeight:700,color:"#0D1C33"}}>
                      <span>
                        Student List
                        {filtered.length > 0 && (
                          <span style={{fontSize:11.5,color:"#7A8599",fontWeight:500,marginLeft:8}}>
                            showing {startIdx+1}–{endIdx} of {filtered.length}
                          </span>
                        )}
                      </span>
                      <span style={{fontSize:11.5,color:"#B0BAC8",fontWeight:600}}>{filtered.length} result{filtered.length!==1?"s":""}</span>
                    </div>

                    {/* table */}
                    {loading ? (
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {[1,2,3,4].map(i=><div key={i} className="stu-sk" style={{height:42}}/>)}
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="stu-empty">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:8}}>
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <div>No students match the current filters.</div>
                      </div>
                    ) : (
                      <div className="stu-table-wrap">
                        <table className="stu-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Roll Number</th>
                              <th>Semester</th>
                              <th>Branch</th>
                              <th>CGPA</th>
                              {showSkills && <th>Skills</th>}
                              <th>Resume</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pageRows.map((s, i) => {
                              const cp = cgpaColor(Number(s.cgpa));
                              const dp = deptColor(s.department||s.branch);
                              return (
                                <tr key={s._id||i}>
                                  <td style={{color:"#B0BAC8",fontWeight:600,fontSize:12}}>{startIdx+i+1}</td>
                                  <td>
                                    <div style={{fontWeight:700,color:"#0D1C33"}}>{s.name}</div>
                                    <div style={{fontSize:11.5,color:"#7A8599",marginTop:1}}>{s.email}</div>
                                  </td>
                                  <td style={{color:"#7A8599",fontSize:12}}>{s.adm_no||"—"}</td>
                                  <td style={{color:"#4A5568",fontWeight:600}}>Sem {s.semester||"—"}</td>
                                  <td><span className="stu-tag" style={{background:dp.bg,color:dp.color}}>{s.department||s.branch||"—"}</span></td>
                                  <td><span className="stu-pill" style={{background:cp.bg,color:cp.color}}>{Number(s.cgpa||0).toFixed(2)}</span></td>
                                  {showSkills && (
                                    <td>
                                      <div style={{display:"flex",flexWrap:"wrap",gap:2,maxWidth:200}}>
                                        {(s.skills||[]).slice(0,3).map((sk,j)=><span key={j} className="stu-skill">{sk}</span>)}
                                        {(s.skills||[]).length>3 && <span className="stu-skill" style={{background:"#F0F2F6",color:"#9CA3AF"}}>+{(s.skills||[]).length-3}</span>}
                                      </div>
                                    </td>
                                  )}
                                  <td>
                                    <button
                                      onClick={() => viewResume(s)}
                                      title={s.resume ? "View Resume" : "No resume uploaded"}
                                      style={{
                                        height:30, padding:"0 12px", borderRadius:7, border:"none", cursor:"pointer",
                                        fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11.5, fontWeight:700,
                                        display:"inline-flex", alignItems:"center", gap:5,
                                        background: s.resume
                                          ? "linear-gradient(135deg,#1B3A6B,#2563EB)"
                                          : "#F0F2F6",
                                        color: s.resume ? "#fff" : "#B0BAC8",
                                        boxShadow: s.resume ? "0 2px 6px rgba(27,58,107,0.2)" : "none",
                                        transition:"transform 0.15s, box-shadow 0.15s",
                                      }}
                                      onMouseEnter={e => { if(s.resume) { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(27,58,107,0.3)"; }}}
                                      onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=s.resume?"0 2px 6px rgba(27,58,107,0.2)":"none"; }}
                                    >
                                      {s.resume ? (
                                        <>
                                          {/* Eye icon — View */}
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                          </svg>
                                          View
                                        </>
                                      ) : (
                                        <>
                                          {/* X icon — None */}
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                          </svg>
                                          None
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ── Pagination bar ── */}
                    {totalPages > 1 && (
                      <div style={{
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        marginTop:16, paddingTop:14, borderTop:"1px solid #F0F2F6",
                        fontFamily:"'Plus Jakarta Sans',sans-serif",
                      }}>
                        <div style={{fontSize:12.5, color:"#7A8599", fontWeight:500}}>
                          Page <strong style={{color:"#0D1C33"}}>{safePage}</strong> of <strong style={{color:"#0D1C33"}}>{totalPages}</strong>
                          <span style={{marginLeft:10, color:"#B0BAC8"}}>·</span>
                          <span style={{marginLeft:10}}>Rows {startIdx+1}–{endIdx}</span>
                        </div>

                        <div style={{display:"flex", alignItems:"center", gap:4}}>
                          {/* Prev */}
                          <button
                            onClick={() => { setPage(p => Math.max(1, p-1)); window.scrollTo({top:0,behavior:'smooth'}); }}
                            disabled={safePage === 1}
                            style={{
                              height:32, width:32, borderRadius:7, border:"1px solid #E2E4E9",
                              background: safePage===1 ? "#F9FAFB" : "#fff",
                              color: safePage===1 ? "#D1D5DB" : "#4A5568",
                              cursor: safePage===1 ? "not-allowed" : "pointer",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              transition:"border-color 0.15s, background 0.15s",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <polyline points="15 18 9 12 15 6"/>
                            </svg>
                          </button>

                          {/* Page number buttons */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => {
                            const isActive = pg === safePage;
                            const show = pg === 1 || pg === totalPages || Math.abs(pg - safePage) <= 1;
                            const showDot = !show && ((pg === 2 && safePage > 3) || (pg === totalPages - 1 && safePage < totalPages - 2));
                            if (!show && !showDot) return null;
                            if (showDot) return (
                              <span key={pg} style={{width:28, textAlign:"center", color:"#B0BAC8", fontSize:13, fontWeight:600}}>…</span>
                            );
                            return (
                              <button
                                key={pg}
                                onClick={() => { setPage(pg); window.scrollTo({top:0,behavior:'smooth'}); }}
                                style={{
                                  height:32, minWidth:32, padding:"0 8px", borderRadius:7,
                                  border: isActive ? "none" : "1px solid #E2E4E9",
                                  background: isActive ? "linear-gradient(135deg,#1B3A6B,#2563EB)" : "#fff",
                                  color: isActive ? "#fff" : "#4A5568",
                                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                                  fontSize:12.5, fontWeight:700, cursor:"pointer",
                                  boxShadow: isActive ? "0 3px 10px rgba(27,58,107,0.22)" : "none",
                                  transition:"all 0.15s",
                                }}
                              >
                                {pg}
                              </button>
                            );
                          })}

                          {/* Next */}
                          <button
                            onClick={() => { setPage(p => Math.min(totalPages, p+1)); window.scrollTo({top:0,behavior:'smooth'}); }}
                            disabled={safePage === totalPages}
                            style={{
                              height:32, width:32, borderRadius:7, border:"1px solid #E2E4E9",
                              background: safePage===totalPages ? "#F9FAFB" : "#fff",
                              color: safePage===totalPages ? "#D1D5DB" : "#4A5568",
                              cursor: safePage===totalPages ? "not-allowed" : "pointer",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              transition:"border-color 0.15s, background 0.15s",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <polyline points="9 18 15 12 9 6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

        </div>
      </div>
    </div>

      {/* ── Resume PDF Modal ── */}
      {resumeModal && (
        <div className="stu-overlay" onClick={() => setResumeModal(null)}>
          <div className="stu-resume-modal" onClick={e => e.stopPropagation()}>

            {/* header */}
            <div className="stu-resume-header">
              <div className="stu-resume-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                {resumeModal.name}'s Resume
                <span className="stu-resume-badge">PDF</span>
              </div>
              <div className="stu-resume-actions">
                <button
                  className="stu-resume-btn stu-resume-btn-open"
                  onClick={() => window.open(resumeModal.url, "_blank")}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Open in New Tab
                </button>
                <button
                  className="stu-resume-btn stu-resume-btn-close"
                  onClick={() => setResumeModal(null)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Close
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="stu-resume-body">
              <div className="stu-resume-loading">
                <div className="stu-resume-spinner"/>
                <span>Loading PDF…</span>
              </div>
              <iframe
                src={resumeModal.url}
                width="100%"
                height="100%"
                title="Student Resume"
              />
            </div>
          </div>
        </div>
      )}
    
    </>
  );
}