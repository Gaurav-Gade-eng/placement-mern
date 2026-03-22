import { useState, useEffect } from "react";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api";

if (!document.getElementById("ann-student-styles")) {
  const s = document.createElement("style");
  s.id = "ann-student-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes annUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes annIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes annShim  { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes annPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
    @keyframes annSpin  { to{transform:rotate(360deg)} }

    .ann-root { display:flex; min-height:100vh; background:#f8fafc; font-family:'Sora',sans-serif; }
    .ann-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .ann-body { flex:1; padding:28px 32px 60px; overflow-y:auto; }

    /* page header */
    .ann-hd     { margin-bottom:24px; animation:annUp 0.4s ease both; }
    .ann-hd-row { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
    .ann-ey     { font-size:10px; font-weight:600; letter-spacing:2.5px; text-transform:uppercase; color:#6366f1; margin-bottom:5px; }
    .ann-title  { font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.4px; }
    .ann-sub    { font-size:13px; color:#94a3b8; margin-top:4px; }

    /* filter tabs */
    .ann-tabs { display:flex; gap:6px; flex-wrap:wrap; animation:annUp 0.4s 0.04s ease both; margin-bottom:22px; }
    .ann-tab  {
      height:34px; padding:0 16px; border-radius:9px; border:1px solid #e8ecf4;
      background:#fff; color:#64748b; cursor:pointer;
      font-family:'Sora',sans-serif; font-size:12px; font-weight:600;
      transition:all 0.15s; display:flex; align-items:center; gap:6px;
    }
    .ann-tab:hover  { border-color:#6366f1; color:#6366f1; }
    .ann-tab.active { background:#6366f1; border-color:#6366f1; color:#fff; box-shadow:0 2px 8px rgba(99,102,241,0.25); }
    .ann-tab-dot { width:6px; height:6px; border-radius:50%; background:currentColor; opacity:0.7; }

    /* card */
    .ann-card {
      background:#fff; border:1px solid #e8ecf4; border-radius:14px;
      overflow:hidden; margin-bottom:12px;
      transition:box-shadow 0.2s, transform 0.2s, border-color 0.15s;
    }
    .ann-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.07); transform:translateY(-2px); border-color:#c7d2fe; }
    .ann-card-accent { height:3px; }
    .ann-card-body   { padding:18px 20px; }
    .ann-card-top    { display:flex; align-items:flex-start; gap:14px; }
    .ann-card-icon   { width:42px; height:42px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ann-card-info   { flex:1; min-width:0; }
    .ann-card-title  { font-size:14.5px; font-weight:700; color:#0f172a; margin-bottom:3px; letter-spacing:-0.2px; }
    .ann-card-co     { font-size:12.5px; color:#6366f1; font-weight:600; margin-bottom:6px; display:flex; align-items:center; gap:4px; }
    .ann-card-desc   { font-size:13px; color:#64748b; line-height:1.7; }
    .ann-card-right  { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }

    /* tags */
    .ann-tags { display:flex; gap:6px; flex-wrap:wrap; margin-top:14px; padding-top:14px; border-top:1px solid #f1f5f9; }
    .ann-tag  { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600; }

    /* type badge */
    .ann-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }

    /* new badge */
    .ann-new { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; background:#fef3c7; color:#92400e; border:1px solid #fde68a; }
    .ann-new-dot { width:5px; height:5px; border-radius:50%; background:#f59e0b; animation:annPulse 1.5s ease infinite; }

    /* apply button */
    @keyframes annAppliedIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
    @keyframes annRipple    { from{transform:scale(0);opacity:0.4} to{transform:scale(2.5);opacity:0} }

    .ann-apply-btn {
      position:relative; overflow:hidden;
      height:38px; padding:0 20px; border:none; border-radius:10px; cursor:pointer;
      font-family:'Sora',sans-serif; font-size:12.5px; font-weight:700; letter-spacing:0.2px;
      display:inline-flex; align-items:center; gap:7px;
      background:linear-gradient(135deg,#6366f1 0%,#818cf8 100%); color:#fff;
      box-shadow:0 4px 14px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
      transition:transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s, opacity 0.15s;
      white-space:nowrap;
    }
    .ann-apply-btn::before {
      content:''; position:absolute; inset:0;
      background:linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 100%);
      border-radius:inherit; pointer-events:none;
    }
    .ann-apply-btn:hover:not(:disabled) {
      transform:translateY(-2px) scale(1.02);
      box-shadow:0 8px 22px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
    }
    .ann-apply-btn:active:not(:disabled) {
      transform:translateY(0) scale(0.98);
      box-shadow:0 2px 8px rgba(99,102,241,0.25);
    }
    .ann-apply-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

    /* ripple */
    .ann-apply-btn .ripple {
      position:absolute; border-radius:50%;
      width:80px; height:80px; margin-top:-40px; margin-left:-40px;
      background:rgba(255,255,255,0.35);
      animation:annRipple 0.55s ease-out forwards;
      pointer-events:none;
    }

    /* applied state */
    .ann-applied-badge {
      display:inline-flex; align-items:center; gap:7px;
      height:38px; padding:0 16px; border-radius:10px;
      background:linear-gradient(135deg,#f0fdf4,#dcfce7);
      border:1px solid #86efac;
      font-family:'Sora',sans-serif; font-size:12.5px; font-weight:700; color:#15803d;
      box-shadow:0 2px 8px rgba(22,163,74,0.12);
      animation:annAppliedIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
      white-space:nowrap;
    }
    .ann-applied-check {
      width:20px; height:20px; border-radius:50%;
      background:linear-gradient(135deg,#16a34a,#22c55e);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 2px 6px rgba(22,163,74,0.3); flex-shrink:0;
    }

    .ann-spin { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; animation:annSpin 0.65s linear infinite; flex-shrink:0; }

    /* skeleton */
    .ann-sk { background:linear-gradient(90deg,#f1f5f9 25%,#f8fafc 50%,#f1f5f9 75%); background-size:200% 100%; animation:annShim 1.5s ease infinite; border-radius:6px; }

    /* empty */
    .ann-empty { display:flex; flex-direction:column; align-items:center; padding:72px 24px; text-align:center; }
    .ann-empty-ico { width:56px; height:56px; border-radius:14px; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.18); display:flex; align-items:center; justify-content:center; margin-bottom:16px; color:#6366f1; }
  `;
  document.head.appendChild(s);
}

const tk  = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const TYPE = {
  drive:   { accent:"linear-gradient(90deg,#6366f1,#818cf8)", iconBg:"rgba(99,102,241,0.1)", iconColor:"#6366f1", badgeBg:"rgba(99,102,241,0.08)", badgeColor:"#6366f1", badgeBorder:"rgba(99,102,241,0.2)", label:"🏢 Placement Drive" },
  general: { accent:"linear-gradient(90deg,#10b981,#34d399)",  iconBg:"rgba(16,185,129,0.1)", iconColor:"#10b981", badgeBg:"#ecfdf5", badgeColor:"#065f46", badgeBorder:"#a7f3d0", label:"📢 General Notice"  },
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : null;
const isNew   = (d) => d && (Date.now() - new Date(d).getTime()) < 3 * 24 * 60 * 60 * 1000; // within 3 days

function SkeletonCard() {
  return (
    <div className="ann-card" style={{ marginBottom:12 }}>
      <div className="ann-sk" style={{ height:3 }} />
      <div className="ann-card-body">
        <div style={{ display:"flex", gap:14 }}>
          <div className="ann-sk" style={{ width:42, height:42, borderRadius:11, flexShrink:0 }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
            <div className="ann-sk" style={{ height:14, width:"45%" }} />
            <div className="ann-sk" style={{ height:12, width:"30%" }} />
            <div className="ann-sk" style={{ height:12, width:"75%" }} />
            <div className="ann-sk" style={{ height:12, width:"60%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [tab,           setTab]           = useState("all");
  const [applying,      setApplying]      = useState(null);   // id being applied
  const [applied,       setApplied]       = useState(new Set()); // set of applied ann ids

  useEffect(() => {
    API.get(`/announcement`, tk())
      .then(res => setAnnouncements(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyDrive = async (id) => {
    setApplying(id);
    try {
      await API.post(
        `/application/apply`,
        { announcementId: id },
        tk()
      );
      setApplied(prev => new Set([...prev, id]));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply. Please try again.");
    } finally {
      setApplying(null);
    }
  };

  const drives   = announcements.filter(a => a.type === "drive");
  const generals = announcements.filter(a => a.type === "general");
  const newCount = announcements.filter(a => isNew(a.createdAt)).length;

  const filtered = tab === "drive"   ? drives
                 : tab === "general" ? generals
                 : announcements;

  return (
    <div className="ann-root">
      <Sidebar />
      <div className="ann-main">
        <Navbar />
        <div className="ann-body">

          {/* ── Header ── */}
          <div className="ann-hd">
            <div className="ann-hd-row">
              <div>
                <div className="ann-ey">Placement Cell</div>
                <h1 className="ann-title">Announcements</h1>
                <p className="ann-sub">
                  {loading ? "Loading…" : `${announcements.length} announcement${announcements.length !== 1 ? "s" : ""} · ${drives.length} placement drive${drives.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              {newCount > 0 && !loading && (
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fefce8", border:"1px solid #fde68a", borderRadius:10, padding:"10px 16px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span style={{ fontSize:12.5, fontWeight:700, color:"#92400e" }}>
                    {newCount} new in the last 3 days
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="ann-tabs">
            {[
              { id:"all",     label:`All`,           count:announcements.length },
              { id:"drive",   label:`Placement Drives`, count:drives.length   },
              { id:"general", label:`General`,        count:generals.length  },
            ].map(t => (
              <button key={t.id} className={`ann-tab${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
                <div className="ann-tab-dot"/>
                {t.label}
                <span style={{
                  background: tab===t.id ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                  color:      tab===t.id ? "#fff" : "#64748b",
                  borderRadius:20, padding:"1px 7px", fontSize:10.5, fontWeight:700,
                }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── Cards ── */}
          {loading ? (
            <>{[1,2,3].map(i => <SkeletonCard key={i}/>)}</>
          ) : filtered.length === 0 ? (
            <div className="ann-empty">
              <div className="ann-empty-ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:5 }}>No announcements</div>
              <div style={{ fontSize:13, color:"#94a3b8" }}>Check back later for new updates from the TPO.</div>
            </div>
          ) : (
            filtered.map((ann, i) => {
              const ts  = TYPE[ann.type] || TYPE.general;
              const fresh = isNew(ann.createdAt);
              return (
                <div
                  key={ann._id}
                  className="ann-card"
                  style={{ animation:`annIn 0.35s ease ${i * 45}ms both` }}
                >
                  <div className="ann-card-accent" style={{ background: ts.accent }} />
                  <div className="ann-card-body">
                    <div className="ann-card-top">

                      {/* icon */}
                      <div className="ann-card-icon" style={{ background: ts.iconBg }}>
                        {ann.type === "drive" ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ts.iconColor} strokeWidth="1.9">
                            <rect x="2" y="7" width="20" height="14" rx="2"/>
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                            <line x1="12" y1="12" x2="12" y2="16"/>
                            <line x1="10" y1="14" x2="14" y2="14"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ts.iconColor} strokeWidth="1.9">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                          </svg>
                        )}
                      </div>

                      {/* content */}
                      <div className="ann-card-info">
                        <div className="ann-card-title">{ann.title}</div>
                        {ann.company && (
                          <div className="ann-card-co">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            </svg>
                            {ann.company}
                          </div>
                        )}
                        <div className="ann-card-desc">{ann.description}</div>
                      </div>

                      {/* right side */}
                      <div className="ann-card-right">
                        <span className="ann-badge" style={{ background:ts.badgeBg, color:ts.badgeColor, border:`1px solid ${ts.badgeBorder}` }}>
                          {ts.label}
                        </span>
                        {fresh && (
                          <span className="ann-new">
                            <span className="ann-new-dot"/>
                            New
                          </span>
                        )}
                        <span style={{ fontSize:11, color:"#cbd5e1", fontWeight:500 }}>
                          {fmtDate(ann.createdAt)}
                        </span>

                      </div>
                    </div>

                    {/* bottom tags */}
                    <div className="ann-tags">
                      {/* all students */}
                      {ann.allStudents && (
                        <span className="ann-tag" style={{ background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" }}>👥 All Students</span>
                      )}
                      {/* departments */}
                      {!ann.allStudents && ann.departments?.map(d => (
                        <span key={d} className="ann-tag" style={{ background:"#f1f5f9", color:"#475569", border:"1px solid #e2e8f0" }}>{d}</span>
                      ))}
                      {/* semesters */}
                      {!ann.allStudents && ann.semesters?.length > 0 && (
                        <span className="ann-tag" style={{ background:"#f5f3ff", color:"#7c3aed", border:"1px solid #ddd6fe" }}>
                          Sem {ann.semesters.join(", ")}
                        </span>
                      )}
                      {/* drive date */}
                      {ann.driveDate && (
                        <span className="ann-tag" style={{ background:"#fefce8", color:"#92400e", border:"1px solid #fde68a" }}>
                          📅 Drive: {fmtDate(ann.driveDate)}
                        </span>
                      )}
                    </div>

                    {/* Apply button — bottom left, drives only */}
                    {ann.type === "drive" && (
                      <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:11.5, color:"#94a3b8", fontWeight:500 }}>
                          {applied.has(ann._id) ? "You have applied for this drive." : "Interested? Submit your application below."}
                        </span>
                        {applied.has(ann._id) ? (
                          <span className="ann-applied-badge">
                            <span className="ann-applied-check">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            Applied!
                          </span>
                        ) : (
                          <button
                            className="ann-apply-btn"
                            disabled={applying === ann._id}
                            onClick={(e) => {
                              const btn  = e.currentTarget;
                              const rect = btn.getBoundingClientRect();
                              const rip  = document.createElement("span");
                              rip.className = "ripple";
                              rip.style.top  = (e.clientY - rect.top)  + "px";
                              rip.style.left = (e.clientX - rect.left) + "px";
                              btn.appendChild(rip);
                              setTimeout(() => rip.remove(), 600);
                              applyDrive(ann._id);
                            }}
                          >
                            {applying === ann._id ? (
                              <><div className="ann-spin"/><span>Applying…</span></>
                            ) : (
                              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>Apply Now</>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
}