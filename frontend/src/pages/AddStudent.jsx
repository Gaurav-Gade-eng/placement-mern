import { useState } from "react";
import axios from "axios";
import TpoNavbar from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import API from "../api";

/* ── Inject styles once ── */
if (!document.getElementById("add-student-styles")) {
  const s = document.createElement("style");
  s.id = "add-student-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes asUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
    @keyframes asSpin { to { transform:rotate(360deg) } }
    @keyframes asToast{ from { opacity:0; transform:translateY(12px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }

    /* ── Root layout ── */
    .as-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .as-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
    .as-body { flex:1; padding:30px 36px 60px; overflow-y:auto; }

    /* ── Page header ── */
    .as-hd    { margin-bottom:24px; animation:asUp 0.45s ease both; }
    .as-ey    { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#3B7DED; margin-bottom:6px; display:flex; align-items:center; gap:7px; }
    .as-ey::before { content:''; width:18px; height:2px; background:#3B7DED; border-radius:2px; }
    .as-title { font-size:26px; font-weight:800; color:#0D1C33; letter-spacing:-0.5px; }
    .as-sub   { font-size:13px; color:#7A8599; margin-top:4px; }

    /* ── Two-col layout ── */
    .as-layout {
      display:grid; grid-template-columns:1fr 380px; gap:20px; align-items:start;
      animation:asUp 0.45s 0.06s ease both;
    }

    /* ── Card ── */
    .as-card { background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden; }
    .as-card-head { padding:16px 22px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; gap:10px; }
    .as-card-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .as-card-title { font-size:14px; font-weight:800; color:#0D1C33; }
    .as-card-body { padding:22px 24px; }

    /* ── Form grid ── */
    .as-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .as-full  { grid-column:1/-1; }
    .as-field { display:flex; flex-direction:column; gap:6px; }
    .as-lbl   { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#7A8599; display:flex; align-items:center; gap:5px; }
    .as-req   { color:#EF4444; font-size:12px; line-height:1; }

    /* ── Input wrapper ── */
    .as-iw {
      height:42px; border:1.5px solid #E2E4E9; border-radius:9px;
      background:#F9FAFB; display:flex; align-items:center; gap:9px;
      padding:0 13px; transition:border-color 0.18s, box-shadow 0.18s, background 0.18s;
    }
    .as-iw:focus-within { border-color:#3B7DED; background:#fff; box-shadow:0 0 0 3px rgba(59,125,237,0.1); }
    .as-iw.error        { border-color:#EF4444; background:#fff; box-shadow:0 0 0 3px rgba(239,68,68,0.08); }
    .as-iw-ico { color:#C0C8D5; flex-shrink:0; display:flex; align-items:center; }
    .as-in {
      flex:1; border:none; background:transparent; outline:none;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#0D1C33;
    }
    .as-in::placeholder { color:#C0C8D5; }

    /* ── Select ── */
    .as-sel {
      flex:1; border:none; background:transparent; outline:none;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#0D1C33;
      appearance:none; cursor:pointer;
    }
    .as-sel option { background:#fff; }

    /* ── Password toggle ── */
    .as-eye { background:none; border:none; cursor:pointer; color:#C0C8D5; padding:0; display:flex; align-items:center; transition:color 0.15s; }
    .as-eye:hover { color:#7A8599; }

    /* ── Error hint ── */
    .as-hint { font-size:11px; color:#EF4444; font-weight:500; margin-top:1px; display:flex; align-items:center; gap:4px; }

    /* ── Divider ── */
    .as-divider { height:1px; background:#F0F2F6; margin:20px 0; }

    /* ── Submit button ── */
    .as-submit {
      width:100%; height:46px; border:none; border-radius:10px; cursor:pointer;
      background:linear-gradient(135deg,#1B3A6B,#2563EB); color:#fff;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:13.5px; font-weight:700;
      display:flex; align-items:center; justify-content:center; gap:8px;
      box-shadow:0 4px 14px rgba(27,58,107,0.25);
      transition:transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    }
    .as-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 7px 20px rgba(27,58,107,0.32); }
    .as-submit:disabled { opacity:0.6; cursor:not-allowed; }
    .as-spinner { width:16px; height:16px; border-radius:50%; border:2.5px solid rgba(255,255,255,0.35); border-top-color:#fff; animation:asSpin 0.7s linear infinite; }

    /* ── Reset button ── */
    .as-reset {
      width:100%; height:40px; border:1.5px solid #E2E4E9; border-radius:9px; cursor:pointer;
      background:#fff; color:#7A8599;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700;
      display:flex; align-items:center; justify-content:center; gap:7px;
      transition:border-color 0.15s, color 0.15s;
      margin-top:10px;
    }
    .as-reset:hover { border-color:#C7D9F5; color:#0D1C33; }

    /* ── Right panel ── */
    .as-panel { display:flex; flex-direction:column; gap:16px; }

    /* ── Info card ── */
    .as-info-card { background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden; }
    .as-info-head { padding:14px 18px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; gap:9px; }
    .as-info-title { font-size:13px; font-weight:800; color:#0D1C33; }
    .as-info-body  { padding:16px 18px; display:flex; flex-direction:column; gap:10px; }
    .as-info-row   { display:flex; align-items:flex-start; gap:10px; }
    .as-info-dot   { width:6px; height:6px; border-radius:50%; background:#3B7DED; flex-shrink:0; margin-top:5px; }
    .as-info-text  { font-size:12px; color:#7A8599; line-height:1.6; }
    .as-info-text strong { color:#0D1C33; font-weight:700; }

    /* ── Required fields legend ── */
    .as-legend { background:#EBF2FD; border:1px solid #C2D6FA; border-radius:10px; padding:12px 14px; display:flex; align-items:flex-start; gap:9px; }
    .as-legend-txt { font-size:12px; color:#1B3A6B; line-height:1.65; font-weight:500; }

    /* ── Live preview card ── */
    .as-preview { background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden; }
    .as-prev-head  { padding:14px 18px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; gap:9px; }
    .as-prev-title { font-size:13px; font-weight:800; color:#0D1C33; }
    .as-prev-body  { padding:16px 18px; }
    .as-prev-av    {
      width:48px; height:48px; border-radius:12px;
      background:linear-gradient(135deg,#1B3A6B,#2563EB);
      display:flex; align-items:center; justify-content:center;
      font-size:16px; font-weight:800; color:#fff; margin-bottom:12px;
    }
    .as-prev-name  { font-size:15px; font-weight:800; color:#0D1C33; margin-bottom:2px; }
    .as-prev-email { font-size:12px; color:#7A8599; margin-bottom:12px; }
    .as-prev-tags  { display:flex; gap:6px; flex-wrap:wrap; }
    .as-prev-tag   { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:5px; font-size:11px; font-weight:700; }
    .as-prev-empty { font-size:12px; color:#C0C8D5; font-style:italic; text-align:center; padding:12px 0; }

    /* ── Toast ── */
    .as-toast {
      position:fixed; bottom:28px; right:28px; z-index:999;
      display:flex; align-items:center; gap:10px; background:#fff;
      border:1px solid #E2E4E9; border-radius:12px; padding:12px 16px;
      box-shadow:0 8px 28px rgba(0,0,0,0.1);
      animation:asToast 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
      font-size:13px; font-weight:600; color:#0D1C33; max-width:340px;
    }
  `;
  document.head.appendChild(s);
}

/* ── API config ── */
// const API = "http://localhost:5000/api";
const tk  = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const DEPTS     = ["IT", "MECH", "CIVIL", "ENTC", "ELECTRICAL", "CS"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const EMPTY     = { name: "", email: "", password: "", adm_no: "", cgpa: "", department: "", semester: "", phone: "" };

/* ── SVG icon helpers ── */
const IcoUser  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoMail  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcoLock  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoStar  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoBldg  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IcoBook  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IcoPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.91-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcoId    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
const ErrIcon  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

function initials(name) {
  return (name || "").trim().split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
}

export default function AddStudent() {
  const [form,     setForm]     = useState(EMPTY);
  const [errors,   setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState({ msg: "", type: "ok" });

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3500);
  };

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = "Full name is required";
    if (!form.email.trim())    errs.email    = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password.trim()) errs.password = "Password is required";
    else if (form.password.length < 6)         errs.password = "Minimum 6 characters";
    if (!form.department)      errs.department = "Select a department";
    if (form.cgpa && (isNaN(form.cgpa) || form.cgpa < 0 || form.cgpa > 10))
      errs.cgpa = "CGPA must be between 0 and 10";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/student/add`, form, tk());
      showToast(`${form.name} added successfully!`);
      setForm(EMPTY);
      setErrors({});
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add student. Please try again.", "err");
    } finally {
      setLoading(false);
    }
  };

  const hasPreview = form.name || form.email || form.department || form.semester || form.cgpa;

  return (
    <>
      <div className="as-root">
        <TpoSidebar />

        <div className="as-main">
          <TpoNavbar />

          <div className="as-body">

            {/* Page header */}
            <div className="as-hd">
              <div className="as-ey">TPO Office</div>
              <h1 className="as-title">Add New Student</h1>
              <p className="as-sub">Register a new student account. They can log in immediately after creation.</p>
            </div>

            <div className="as-layout">

              {/* ── LEFT: Form card ── */}
              <div className="as-card">
                <div className="as-card-head">
                  <div className="as-card-icon" style={{ background: "#EBF2FD", border: "1px solid #C2D6FA" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="as-card-title">Student Information</div>
                </div>

                <div className="as-card-body">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="as-grid">

                      {/* Full Name */}
                      <div className="as-field">
                        <label className="as-lbl"><IcoUser /> Full Name <span className="as-req">*</span></label>
                        <div className={`as-iw${errors.name ? " error" : ""}`}>
                          <span className="as-iw-ico"><IcoUser /></span>
                          <input className="as-in" placeholder="e.g. Riya Sharma" value={form.name} onChange={set("name")} />
                        </div>
                        {errors.name && <div className="as-hint"><ErrIcon />{errors.name}</div>}
                      </div>

                      {/* Admission No */}
                      <div className="as-field">
                        <label className="as-lbl"><IcoId /> Admission No</label>
                        <div className="as-iw">
                          <span className="as-iw-ico"><IcoId /></span>
                          <input className="as-in" placeholder="e.g. 2021GCEK0045" value={form.adm_no} onChange={set("adm_no")} />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="as-field as-full">
                        <label className="as-lbl"><IcoMail /> Email Address <span className="as-req">*</span></label>
                        <div className={`as-iw${errors.email ? " error" : ""}`}>
                          <span className="as-iw-ico"><IcoMail /></span>
                          <input className="as-in" type="email" placeholder="student@gcek.ac.in" value={form.email} onChange={set("email")} />
                        </div>
                        {errors.email && <div className="as-hint"><ErrIcon />{errors.email}</div>}
                      </div>

                      {/* Password */}
                      <div className="as-field">
                        <label className="as-lbl"><IcoLock /> Password <span className="as-req">*</span></label>
                        <div className={`as-iw${errors.password ? " error" : ""}`}>
                          <span className="as-iw-ico"><IcoLock /></span>
                          <input
                            className="as-in"
                            type={showPass ? "text" : "password"}
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={set("password")}
                          />
                          <button type="button" className="as-eye" onClick={() => setShowPass(p => !p)}>
                            {showPass
                              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                        {errors.password && <div className="as-hint"><ErrIcon />{errors.password}</div>}
                      </div>

                      {/* Phone */}
                      <div className="as-field">
                        <label className="as-lbl"><IcoPhone /> Phone Number</label>
                        <div className="as-iw">
                          <span className="as-iw-ico"><IcoPhone /></span>
                          <input className="as-in" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                        </div>
                      </div>

                      {/* Department */}
                      <div className="as-field">
                        <label className="as-lbl"><IcoBldg /> Department <span className="as-req">*</span></label>
                        <div className={`as-iw${errors.department ? " error" : ""}`}>
                          <span className="as-iw-ico"><IcoBldg /></span>
                          <select className="as-sel" value={form.department} onChange={set("department")}>
                            <option value="">Select Department</option>
                            {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        {errors.department && <div className="as-hint"><ErrIcon />{errors.department}</div>}
                      </div>

                      {/* Semester */}
                      <div className="as-field">
                        <label className="as-lbl"><IcoBook /> Semester</label>
                        <div className="as-iw">
                          <span className="as-iw-ico"><IcoBook /></span>
                          <select className="as-sel" value={form.semester} onChange={set("semester")}>
                            <option value="">Select Semester</option>
                            {SEMESTERS.map(n => <option key={n} value={n}>Semester {n}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* CGPA */}
                      <div className="as-field">
                        <label className="as-lbl"><IcoStar /> CGPA</label>
                        <div className={`as-iw${errors.cgpa ? " error" : ""}`}>
                          <span className="as-iw-ico"><IcoStar /></span>
                          <input
                            className="as-in"
                            type="number" step="0.01" min="0" max="10"
                            placeholder="e.g. 8.50"
                            value={form.cgpa}
                            onChange={set("cgpa")}
                          />
                        </div>
                        {errors.cgpa && <div className="as-hint"><ErrIcon />{errors.cgpa}</div>}
                      </div>

                    </div>

                    <div className="as-divider" />

                    {/* Submit */}
                    <button type="submit" className="as-submit" disabled={loading}>
                      {loading
                        ? <><div className="as-spinner" />Adding Student…</>
                        : <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                              <line x1="19" y1="8" x2="19" y2="14"/>
                              <line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                            Add Student
                          </>
                      }
                    </button>

                    {/* Reset */}
                    <button
                      type="button"
                      className="as-reset"
                      onClick={() => { setForm(EMPTY); setErrors({}); }}
                      disabled={loading}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10"/>
                        <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                      </svg>
                      Clear Form
                    </button>

                  </form>
                </div>
              </div>

              {/* ── RIGHT: Info + Preview panel ── */}
              <div className="as-panel">

                {/* Required fields note */}
                <div className="as-legend">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div className="as-legend-txt">
                    Fields marked <strong style={{ color: "#EF4444" }}>*</strong> are required.
                    The student can update their profile after first login.
                  </div>
                </div>

                {/* Live preview card */}
                <div className="as-preview">
                  <div className="as-prev-head">
                    <div className="as-card-icon" style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </div>
                    <div className="as-prev-title">Live Preview</div>
                  </div>
                  <div className="as-prev-body">
                    {hasPreview ? (
                      <>
                        <div className="as-prev-av">{initials(form.name)}</div>
                        <div className="as-prev-name">{form.name || <span style={{ color: "#C0C8D5" }}>Student Name</span>}</div>
                        <div className="as-prev-email">{form.email || <span style={{ color: "#C0C8D5" }}>email@gcek.ac.in</span>}</div>
                        <div className="as-prev-tags">
                          {form.department && (
                            <span className="as-prev-tag" style={{ background: "#EBF2FD", color: "#1B3A6B" }}>{form.department}</span>
                          )}
                          {form.semester && (
                            <span className="as-prev-tag" style={{ background: "#F5F3FF", color: "#7C3AED" }}>Sem {form.semester}</span>
                          )}
                          {form.cgpa && (
                            <span className="as-prev-tag" style={{ background: "#F0FDF4", color: "#16A34A" }}>
                              {Number(form.cgpa).toFixed(2)} CGPA
                            </span>
                          )}
                          {form.adm_no && (
                            <span className="as-prev-tag" style={{ background: "#F0F2F6", color: "#4A5568" }}>{form.adm_no}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="as-prev-empty">Start filling the form to see a preview</div>
                    )}
                  </div>
                </div>

                {/* Tips card */}
                <div className="as-info-card">
                  <div className="as-info-head">
                    <div className="as-card-icon" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <div className="as-info-title">Quick Tips</div>
                  </div>
                  <div className="as-info-body">
                    {[
                      { text: <><strong>Email</strong> will be the student's login username. Use their institute email.</> },
                      { text: <><strong>Password</strong> can be their roll number initially. They can change it later.</> },
                      { text: <><strong>CGPA</strong> is used to filter students for placement drives automatically.</> },
                      { text: <>Students can upload their <strong>resume</strong> and add skills from their profile.</> },
                    ].map((tip, i) => (
                      <div className="as-info-row" key={i}>
                        <div className="as-info-dot" />
                        <div className="as-info-text">{tip.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast.msg && (
        <div className="as-toast" style={{ borderColor: toast.type === "err" ? "#FECACA" : "#BBF7D0" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={toast.type === "err" ? "#DC2626" : "#16A34A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {toast.type === "err"
              ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              : <polyline points="20 6 9 17 4 12"/>
            }
          </svg>
          {toast.msg}

          
        </div>
        
      )}
      
    </>
  );
}