import { useState } from "react";
import API from "../api";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";

/* ── inject styles once ── */
if (!document.getElementById("pf-styles")) {
  const s = document.createElement("style");
  s.id = "pf-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap');

    /* ── Keyframes ── */
    @keyframes pf-up {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pf-pop {
      from { opacity:0; transform:scale(0.88) translateY(4px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @keyframes pf-pulse {
      0%,100% { box-shadow:0 0 0 2px rgba(42,157,143,0.2); }
      50%     { box-shadow:0 0 0 5px rgba(42,157,143,0.1); }
    }
    @keyframes pf-toast {
      from { opacity:0; transform:translateX(-50%) translateY(12px); }
      to   { opacity:1; transform:translateX(-50%) translateY(0); }
    }
    @keyframes spin {
      from { transform:rotate(0deg); }
      to   { transform:rotate(360deg); }
    }

    /* ── Shell ── */
    .pf-root { display:flex; min-height:100vh; background:#FAFAF8; font-family:'Bricolage Grotesque',sans-serif; }
    .pf-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
    .pf-body { flex:1; overflow-y:auto; padding:40px 0 80px; background:#FAFAF8; }

    /* ── Centre column ── */
    .pf-center { max-width:680px; margin:0 auto; padding:0 32px; }

    /* ── Eyebrow ── */
    .pf-eyebrow {
      display:flex; align-items:center; gap:10px;
      margin-bottom:28px;
      opacity:0; animation:pf-up 0.5s 0.05s ease forwards;
      flex-wrap:wrap;
    }
    .pf-eyebrow-tag {
      font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
      color:#fff; background:#1D3557; padding:4px 10px; border-radius:4px;
    }
    .pf-eyebrow-slash { font-size:13px; color:#C0BDB7; }
    .pf-eyebrow-page  { font-size:13px; color:#6B6864; font-weight:500; }
    .pf-eyebrow-right { margin-left:auto; display:flex; align-items:center; gap:6px; font-size:12px; color:#9A9590; }
    .pf-pulse { width:7px; height:7px; border-radius:50%; background:#2A9D8F; box-shadow:0 0 0 2px rgba(42,157,143,0.2); animation:pf-pulse 2s ease infinite; flex-shrink:0; }

    /* ── Title ── */
    .pf-title-block {
      margin-bottom:30px;
      opacity:0; animation:pf-up 0.5s 0.1s ease forwards;
    }
    .pf-title { font-family:'Lora',serif; font-size:38px; font-weight:600; color:#1A1714; line-height:1.1; letter-spacing:-0.8px; }
    .pf-title em { font-style:italic; color:#457B9D; }
    .pf-subtitle { font-size:14px; color:#8A8682; margin-top:8px; font-weight:400; line-height:1.5; }

    /* ── Identity panel ── */
    .pf-identity {
      background:#1D3557; border-radius:16px; padding:24px 28px;
      display:flex; align-items:center; gap:20px; margin-bottom:20px;
      position:relative; overflow:hidden;
      opacity:0; animation:pf-up 0.5s 0.15s ease forwards;
    }
    .pf-identity::before {
      content:''; position:absolute; top:-40px; right:-40px;
      width:160px; height:160px; border-radius:50%;
      background:rgba(69,123,157,0.25);
    }
    .pf-identity::after {
      content:''; position:absolute; bottom:-30px; right:80px;
      width:100px; height:100px; border-radius:50%;
      background:rgba(168,218,220,0.1);
    }
    .pf-avatar {
      width:60px; height:60px; border-radius:14px;
      background:linear-gradient(145deg,#457B9D,#A8DADC);
      display:flex; align-items:center; justify-content:center;
      font-family:'Lora',serif; font-size:22px; font-weight:600; color:#fff;
      flex-shrink:0; position:relative; z-index:1; letter-spacing:-1px;
      box-shadow:0 4px 16px rgba(0,0,0,0.2);
    }
    .pf-id-info { flex:1; min-width:0; position:relative; z-index:1; }
    .pf-id-name  { font-size:17px; font-weight:700; color:#fff; margin-bottom:3px; letter-spacing:-0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .pf-id-email { font-size:12px; color:rgba(168,218,220,0.8); margin-bottom:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .pf-id-chips { display:flex; gap:6px; flex-wrap:wrap; }
    .pf-chip {
      font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
      padding:3px 9px; border-radius:4px; border:1px solid;
    }
    .pf-chip-light { color:#A8DADC; border-color:rgba(168,218,220,0.3); background:rgba(168,218,220,0.08); }
    .pf-chip-green { color:#2A9D8F; border-color:rgba(42,157,143,0.4); background:rgba(42,157,143,0.1); }

    /* Completion ring */
    .pf-meter { text-align:center; position:relative; z-index:1; flex-shrink:0; }
    .pf-meter-label { font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:rgba(168,218,220,0.6); margin-bottom:6px; }
    .pf-meter-circle { position:relative; width:56px; height:56px; margin:0 auto; }
    .pf-meter-svg { transform:rotate(-90deg); }
    .pf-meter-num { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#A8DADC; }

    /* ── Form card ── */
    .pf-card {
      background:#fff; border:1px solid #E8E6E1; border-radius:16px; overflow:hidden;
      box-shadow:0 2px 8px rgba(0,0,0,0.04);
      opacity:0; animation:pf-up 0.5s 0.22s ease forwards;
    }
    .pf-section { padding:28px 32px; border-bottom:1px solid #F0EDE8; }
    .pf-section:last-child { border-bottom:none; }

    .pf-sec-head { display:flex; align-items:flex-start; gap:14px; margin-bottom:24px; }
    .pf-sec-num {
      width:28px; height:28px; border-radius:8px; background:#1D3557; color:#fff;
      font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center;
      flex-shrink:0; margin-top:1px;
    }
    .pf-sec-num.teal { background:#457B9D; }
    .pf-sec-title { font-size:14px; font-weight:700; color:#1A1714; margin-bottom:2px; }
    .pf-sec-desc  { font-size:12px; color:#9A9590; font-weight:400; }

    .pf-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .pf-field  { display:flex; flex-direction:column; gap:7px; }
    .pf-label  { font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6B6864; }

    .pf-input-box { position:relative; display:flex; align-items:center; }
    .pf-input {
      width:100%; height:46px; padding:0 40px 0 14px;
      background:#FAFAF8; border:1.5px solid #E0DDD8; border-radius:10px;
      font-family:'Bricolage Grotesque',sans-serif; font-size:14px; font-weight:500; color:#1A1714;
      outline:none; transition:border-color 0.18s, background 0.18s, box-shadow 0.18s;
      -webkit-appearance:none;
      box-sizing:border-box;
    }
    .pf-input::placeholder { color:#B8B4B0; font-weight:400; }
    .pf-input:focus { border-color:#457B9D; background:#fff; box-shadow:0 0 0 3px rgba(69,123,157,0.1); }
    .pf-input-suffix { position:absolute; right:12px; font-size:11px; font-weight:700; color:#B8B4B0; pointer-events:none; letter-spacing:0.5px; }

    /* Skills */
    .pf-skills-box { position:relative; }
    .pf-skills-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#B8B4B0; pointer-events:none; display:flex; }
    .pf-skills-input {
      width:100%; height:46px; padding:0 14px 0 40px;
      background:#FAFAF8; border:1.5px solid #E0DDD8; border-radius:10px;
      font-family:'Bricolage Grotesque',sans-serif; font-size:14px; font-weight:500; color:#1A1714;
      outline:none; transition:border-color 0.18s, background 0.18s, box-shadow 0.18s;
      box-sizing:border-box;
    }
    .pf-skills-input::placeholder { color:#B8B4B0; font-weight:400; }
    .pf-skills-input:focus { border-color:#457B9D; background:#fff; box-shadow:0 0 0 3px rgba(69,123,157,0.1); }
    .pf-hint { font-size:11px; color:#B0ACA8; margin-top:7px; display:flex; align-items:center; gap:5px; }
    .pf-tags { display:flex; flex-wrap:wrap; gap:7px; margin-top:12px; }
    .pf-tag {
      display:inline-flex; align-items:center; gap:5px;
      padding:5px 12px; background:#EEF4F8; border:1px solid #D0E4EE; border-radius:6px;
      font-size:12px; font-weight:600; color:#2B6A8E;
      animation:pf-pop 0.18s ease both; letter-spacing:0.2px; cursor:pointer;
      transition:background 0.15s, border-color 0.15s;
    }
    .pf-tag:hover { background:#DDEEF8; border-color:#A8D4EE; }
    .pf-tag-x { font-size:13px; opacity:0.4; line-height:1; }

    /* Footer */
    .pf-footer {
      background:#F5F3EF; border-top:1px solid #E8E6E1;
      padding:20px 32px; display:flex; align-items:center; justify-content:space-between;
      opacity:0; animation:pf-up 0.5s 0.3s ease forwards;
      gap:12px;
    }
    .pf-footer-note { font-size:12px; color:#A8A4A0; display:flex; align-items:center; gap:6px; flex-shrink:0; }
    .pf-save-btn {
      display:flex; align-items:center; gap:8px;
      height:44px; padding:0 28px;
      background:#1D3557; color:#fff;
      border:none; border-radius:10px;
      font-family:'Bricolage Grotesque',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.2px;
      cursor:pointer; transition:background 0.18s, transform 0.15s, box-shadow 0.18s;
      position:relative; overflow:hidden; flex-shrink:0;
    }
    .pf-save-btn::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(135deg,#457B9D,#A8DADC); opacity:0; transition:opacity 0.25s;
    }
    .pf-save-btn > * { position:relative; z-index:1; }
    .pf-save-btn:hover::after { opacity:1; }
    .pf-save-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(29,53,87,0.3); }
    .pf-save-btn:active { transform:none; }

    /* Toast */
    .pf-toast {
      position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
      background:#1D3557; border-radius:12px; padding:13px 20px;
      display:flex; align-items:center; gap:10px;
      box-shadow:0 8px 32px rgba(0,0,0,0.2); z-index:999; white-space:nowrap;
      animation:pf-toast 0.3s ease both;
    }
    .pf-toast-icon { width:24px; height:24px; border-radius:50%; background:rgba(42,157,143,0.15); border:1px solid rgba(42,157,143,0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .pf-toast-msg { font-size:13px; font-weight:600; color:#fff; }
    .pf-toast-sub { font-size:12px; color:rgba(168,218,220,0.7); margin-left:2px; }

    /* ─────────────────────────────────────────
       MOBILE RESPONSIVE — Android phone sizes
       Covers 360px–430px (standard Android range)
    ───────────────────────────────────────── */

    /* Tablet — hide sidebar, compact padding */
    @media (max-width: 768px) {
      .pf-body { padding:24px 0 100px; }
      .pf-center { padding:0 20px; }

      .pf-title { font-size:30px; }

      .pf-section { padding:22px 20px; }
      .pf-footer  { padding:16px 20px; }
    }

    /* Mobile — ≤480px (all Android phones) */
    @media (max-width: 480px) {
      .pf-body { padding:20px 0 120px; }
      .pf-center { padding:0 16px; }

      /* Eyebrow */
      .pf-eyebrow { margin-bottom:18px; gap:7px; }
      .pf-eyebrow-right { font-size:11px; }

      /* Title */
      .pf-title-block { margin-bottom:20px; }
      .pf-title { font-size:24px; letter-spacing:-0.5px; }
      .pf-subtitle { font-size:13px; }

      /* Identity panel — stack avatar + info, keep ring to the right */
      .pf-identity {
        padding:18px 18px;
        gap:14px;
        flex-wrap:nowrap;
      }
      .pf-avatar {
        width:48px; height:48px; border-radius:12px;
        font-size:17px;
      }
      .pf-id-name  { font-size:15px; }
      .pf-id-email { font-size:11px; margin-bottom:8px; }
      .pf-chip     { font-size:9px; padding:2px 7px; letter-spacing:0.6px; }

      /* Shrink ring on tiny screens */
      .pf-meter-circle { width:48px; height:48px; }
      .pf-meter-svg    { width:48px; height:48px; }
      .pf-meter-num    { font-size:12px; }
      .pf-meter-label  { font-size:9px; }

      /* Card sections */
      .pf-section { padding:18px 16px; }
      .pf-sec-head { gap:10px; margin-bottom:18px; }
      .pf-sec-title { font-size:13px; }
      .pf-sec-desc  { font-size:11px; }
      .pf-sec-num   { width:24px; height:24px; font-size:10px; border-radius:6px; }

      /* 3-col grid → 1-col stacked */
      .pf-grid-3 { grid-template-columns:1fr; gap:14px; }

      /* Inputs */
      .pf-input         { height:44px; font-size:16px; /* prevents iOS/Android zoom */ }
      .pf-skills-input  { height:44px; font-size:16px; }
      .pf-label         { font-size:10px; letter-spacing:1px; }

      /* Footer — stack note + button */
      .pf-footer {
        padding:14px 16px;
        flex-direction:column;
        align-items:stretch;
        gap:10px;
      }
      .pf-footer-note { justify-content:center; font-size:11px; }
      .pf-save-btn {
        width:100%; justify-content:center;
        height:48px; font-size:14px;
      }

      /* Toast */
      .pf-toast {
        bottom:20px;
        width:calc(100% - 32px);
        max-width:360px;
        white-space:normal;
        padding:12px 16px;
      }
    }

    /* Very small phones — 360px and below */
    @media (max-width: 360px) {
      .pf-center { padding:0 12px; }
      .pf-title  { font-size:21px; }
      .pf-identity { padding:14px 14px; gap:10px; }
      .pf-avatar { width:42px; height:42px; font-size:15px; }
      .pf-meter-circle { width:42px; height:42px; }
      .pf-meter-svg    { width:42px; height:42px; }
    }
  `;
  document.head.appendChild(s);
}

/* ── Completion ring ── */
function Ring({ pct }) {
  const r = 22, circ = 2 * Math.PI * r;
  return (
    <div className="pf-meter-circle">
      <svg className="pf-meter-svg" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(168,218,220,0.15)" strokeWidth="4"/>
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke="#A8DADC" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          style={{ transition:"stroke-dasharray 0.7s ease" }}
        />
      </svg>
      <div className="pf-meter-num">{pct}%</div>
    </div>
  );
}

export default function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") ||
    '{"name":"Student","email":"","cgpa":"","year":"","semester":""}'
  );

  const [cgpa,      setCgpa]      = useState(user.cgpa     || "");
  const [year,      setYear]      = useState(user.year     || "");
  const [semester,  setSemester]  = useState(user.semester || "");
  const [skillInput,setSkillInput]= useState("");
  const [skillTags, setSkillTags] = useState(
    Array.isArray(user.skills) ? user.skills : (user.skills ? user.skills.split(",").map(s=>s.trim()).filter(Boolean) : [])
  );
  const [showToast, setShowToast] = useState(false);
  const [saving,    setSaving]    = useState(false);

  const initials = (user.name || "S").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const pct      = Math.round([cgpa, year, semester, skillTags.length > 0].filter(Boolean).length / 4 * 100);

  /* Add skill on Enter or comma */
  const handleSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, "");
      if (val && !skillTags.includes(val)) setSkillTags(prev => [...prev, val]);
      setSkillInput("");
    }
  };
  const removeSkill = (tag) => setSkillTags(prev => prev.filter(s => s !== tag));

  const updateProfile = async () => {
    setSaving(true);
    try {
      await API.put("/user/profile", { cgpa, year, semester, skills: skillTags });
      const updated = { ...user, cgpa, year, semester, skills: skillTags };
      localStorage.setItem("user", JSON.stringify(updated));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      alert("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pf-root">
      <Sidebar />
      <div className="pf-main">
        <Navbar />
        <div className="pf-body">
          <div className="pf-center">

            {/* ── Eyebrow ── */}
            <div className="pf-eyebrow">
              <span className="pf-eyebrow-tag">Student Portal</span>
              <span className="pf-eyebrow-slash">/</span>
              <span className="pf-eyebrow-page">Profile</span>
              <div className="pf-eyebrow-right">
                <span className="pf-pulse"/>
                Session active
              </div>
            </div>

            {/* ── Title ── */}
            <div className="pf-title-block">
              <h1 className="pf-title">Manage your <em>academic profile</em></h1>
              <p className="pf-subtitle">Keep your information current to improve job-match accuracy and recruiter visibility.</p>
            </div>

            {/* ── Identity panel ── */}
            <div className="pf-identity">
              <div className="pf-avatar">{initials}</div>
              <div className="pf-id-info">
                <div className="pf-id-name">{user.name || "Student"}</div>
                <div className="pf-id-email">{user.email || "student@university.edu"}</div>
                <div className="pf-id-chips">
                  <span className="pf-chip pf-chip-light">Undergraduate</span>
                  <span className="pf-chip pf-chip-green">● Active</span>
                </div>
              </div>
              <div className="pf-meter">
                <div className="pf-meter-label">Complete</div>
                <Ring pct={pct} />
              </div>
            </div>

            {/* ── Form card ── */}
            <div className="pf-card">

              {/* Section 1 — Academic */}
              <div className="pf-section">
                <div className="pf-sec-head">
                  <div className="pf-sec-num">01</div>
                  <div>
                    <div className="pf-sec-title">Academic Standing</div>
                    <div className="pf-sec-desc">Your current GPA, year, and semester information</div>
                  </div>
                </div>

                <div className="pf-grid-3">
                  <div className="pf-field">
                    <label className="pf-label">CGPA</label>
                    <div className="pf-input-box">
                      <input
                        className="pf-input"
                        type="number"
                        step="0.01"
                        min="0" max="10"
                        placeholder="0.00"
                        value={cgpa}
                        onChange={e => setCgpa(e.target.value)}
                      />
                      <span className="pf-input-suffix">/ 10</span>
                    </div>
                  </div>

                  <div className="pf-field">
                    <label className="pf-label">Year</label>
                    <div className="pf-input-box">
                      <input
                        className="pf-input"
                        type="number"
                        min="1" max="4"
                        placeholder="e.g. 3"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                      />
                      <span className="pf-input-suffix">yr</span>
                    </div>
                  </div>

                  <div className="pf-field">
                    <label className="pf-label">Semester</label>
                    <div className="pf-input-box">
                      <input
                        className="pf-input"
                        type="number"
                        min="1" max="8"
                        placeholder="e.g. 5"
                        value={semester}
                        onChange={e => setSemester(e.target.value)}
                      />
                      <span className="pf-input-suffix">sem</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 — Skills */}
              <div className="pf-section">
                <div className="pf-sec-head">
                  <div className="pf-sec-num teal">02</div>
                  <div>
                    <div className="pf-sec-title">Skills & Technologies</div>
                    <div className="pf-sec-desc">Add your technical skills to match with relevant openings</div>
                  </div>
                </div>

                <div className="pf-skills-box">
                  <span className="pf-skills-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </span>
                  <input
                    className="pf-skills-input"
                    placeholder="Type a skill and press Enter… React, Node.js, Python"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKey}
                  />
                </div>
                <div className="pf-hint">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Press Enter or comma after each skill to add it as a tag
                </div>

                {skillTags.length > 0 && (
                  <div className="pf-tags">
                    {skillTags.map((tag, i) => (
                      <span key={i} className="pf-tag" onClick={() => removeSkill(tag)}>
                        {tag}
                        <span className="pf-tag-x">×</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pf-footer">
                <div className="pf-footer-note">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Saved securely to your account
                </div>
                <button className="pf-save-btn" onClick={updateProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ animation:"spin 0.8s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {showToast && (
        <div className="pf-toast">
          <div className="pf-toast-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="pf-toast-msg">
            Profile updated
            <span className="pf-toast-sub"> — saved successfully</span>
          </div>
        </div>
      )}
    </div>
  );
}