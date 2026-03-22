import { useEffect, useState } from "react";
import TpoNavbar  from "../components/TpoNavbar";
import TpoSidebar from "../components/TpoSidebar";
import API from "../api";

if (!document.getElementById("tpo-about-styles")) {
  const s = document.createElement("style");
  s.id = "tpo-about-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes abUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes abFade { from{opacity:0} to{opacity:1} }
    @keyframes abPulse{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.12)} }
    @keyframes abShim { from{background-position:200% 0} to{background-position:-200% 0} }

    .ab-root { display:flex; min-height:100vh; background:#F4F6F9; font-family:'Plus Jakarta Sans',sans-serif; }
    .ab-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .ab-body { flex:1; padding:0 0 72px; overflow-y:auto; }

    /* ── Hero ── */
    .ab-hero {
      background:linear-gradient(135deg,#0D1F4E 0%,#1B3A6B 50%,#2563EB 100%);
      padding:48px 48px 52px; position:relative; overflow:hidden;
      animation:abUp 0.5s ease both;
    }
    .ab-hero::before {
      content:''; position:absolute; right:-80px; top:-80px;
      width:320px; height:320px; border-radius:50%;
      background:rgba(255,255,255,0.04); pointer-events:none;
    }
    .ab-hero::after {
      content:''; position:absolute; right:120px; bottom:-100px;
      width:200px; height:200px; border-radius:50%;
      background:rgba(255,255,255,0.03); pointer-events:none;
    }
    .ab-hero-inner { position:relative; z-index:1; display:flex; align-items:center; gap:32px; }
    .ab-hero-logo  {
      width:80px; height:80px; border-radius:20px; flex-shrink:0;
      background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 8px 32px rgba(0,0,0,0.2);
    }
    .ab-hero-tag   { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.18); border-radius:20px; padding:4px 12px; font-size:10.5px; font-weight:700; color:rgba(255,255,255,0.8); letter-spacing:0.5px; text-transform:uppercase; margin-bottom:10px; }
    .ab-hero-dot   { width:6px; height:6px; border-radius:50%; background:#34D399; animation:abPulse 2s ease infinite; }
    .ab-hero-title { font-size:28px; font-weight:800; color:#fff; letter-spacing:-0.6px; line-height:1.2; margin-bottom:6px; }
    .ab-hero-sub   { font-size:14px; color:rgba(255,255,255,0.65); font-weight:400; line-height:1.6; max-width:480px; }
    .ab-hero-stats { display:flex; gap:32px; margin-top:28px; position:relative; z-index:1; }
    .ab-hero-stat  { display:flex; flex-direction:column; }
    .ab-hero-stat-val { font-size:26px; font-weight:800; color:#fff; letter-spacing:-0.8px; line-height:1; }
    .ab-hero-stat-lbl { font-size:11px; color:rgba(255,255,255,0.6); margin-top:3px; font-weight:500; }
    .ab-hero-divider { width:1px; background:rgba(255,255,255,0.15); align-self:stretch; margin:0 4px; }

    /* ── Content area ── */
    .ab-content { padding:36px 48px; display:grid; grid-template-columns:1fr 1fr; gap:20px; }

    /* ── Card ── */
    .ab-card {
      background:#fff; border:1px solid #E2E4E9; border-radius:16px; overflow:hidden;
      box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
      transition:box-shadow 0.22s, transform 0.22s;
    }
    .ab-card:hover { box-shadow:0 8px 28px rgba(0,0,0,0.08); transform:translateY(-2px); }
    .ab-card-head { padding:16px 22px; border-bottom:1px solid #F0F2F6; display:flex; align-items:center; gap:10px; }
    .ab-card-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ab-card-title{ font-size:14px; font-weight:800; color:#0D1C33; }
    .ab-card-body { padding:20px 22px; }

    /* full width card */
    .ab-card-full { grid-column:1/-1; }

    /* ── Contact row ── */
    .ab-contact-row { display:flex; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid #F5F7FA; }
    .ab-contact-row:last-child { border-bottom:none; }
    .ab-contact-ico { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ab-contact-lbl { font-size:10.5px; font-weight:700; color:#B0BAC8; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px; }
    .ab-contact-val { font-size:13.5px; font-weight:600; color:#0D1C33; }
    .ab-contact-link { color:#3B7DED; text-decoration:none; font-size:13.5px; font-weight:600; transition:color 0.15s; }
    .ab-contact-link:hover { color:#1B3A6B; text-decoration:underline; }

    /* ── Team member ── */
    .ab-team-row { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1px solid #F5F7FA; }
    .ab-team-row:last-child { border-bottom:none; }
    .ab-team-av  { width:44px; height:44px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; color:#fff; flex-shrink:0; }
    .ab-team-name{ font-size:13.5px; font-weight:700; color:#0D1C33; }
    .ab-team-role{ font-size:11.5px; color:#7A8599; margin-top:2px; }
    .ab-team-badge{ display:inline-flex; padding:3px 10px; border-radius:20px; font-size:10.5px; font-weight:700; margin-left:auto; flex-shrink:0; }

    /* ── Feature item ── */
    .ab-feat { display:flex; gap:14px; padding:12px 0; border-bottom:1px solid #F5F7FA; }
    .ab-feat:last-child { border-bottom:none; }
    .ab-feat-ico { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
    .ab-feat-title{ font-size:13px; font-weight:700; color:#0D1C33; margin-bottom:3px; }
    .ab-feat-desc { font-size:12px; color:#7A8599; line-height:1.65; }

    /* ── skeleton ── */
    .ab-sk { background:linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%); background-size:200% 100%; animation:abShim 1.5s ease infinite; border-radius:4px; }
  `;
  document.head.appendChild(s);
}

const tk  = () => ({ headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } });

const TEAM = [
  { name:"Prof. Uma. S. Patil",      role:"Training & Placement Officer", color:"linear-gradient(135deg,#1B3A6B,#2563EB)" },
  { name:"Prof. Pournima Kawalkar",  role:"Assistant Professor",          color:"linear-gradient(135deg,#059669,#10B981)" },
  { name:"Mr. Umesh D. Suryawanshi", role:"TPO Assistant",                color:"linear-gradient(135deg,#7C3AED,#A78BFA)" },
];

/* ─────────────────────────────
   Professional SVG Icon Components
───────────────────────────── */

// Email / At-sign
const IcoMail = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

// Phone
const IcoPhone = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.91-.87a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

// Office building / door
const IcoOffice = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
    <line x1="15" y1="3" x2="15" y2="21"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
  </svg>
);

// Clock — working hours
const IcoClock = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

// Map pin — address
const IcoMapPin = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// Megaphone — Announcements
const IcoMegaphone = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
);

// Briefcase — Company Management
const IcoBriefcase = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

// Clipboard — Applications
const IcoClipboard = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

// Check circle — Placement Tracking
const IcoCheckCircle = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// File text — Resume Management
const IcoFileText = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// Users — Student Records
const IcoUsers = ({ size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* Contact rows — icon component + color config */
const CONTACTS = [
  {
    Icon: IcoMail, bg:"#EBF2FD", ic:"#3B7DED",
    lbl:"Email", val:"tpo@gcek.ac.in", isLink:true, href:"mailto:tpo@gcek.ac.in",
  },
  {
    Icon: IcoPhone, bg:"#F0FDF4", ic:"#16A34A",
    lbl:"Phone", val:"+91 8275706613", isLink:false,
  },
  {
    Icon: IcoOffice, bg:"#FEF3C7", ic:"#D97706",
    lbl:"Office", val:"TPO Block, Ground Floor", isLink:false,
  },
  {
    Icon: IcoClock, bg:"#F5F3FF", ic:"#7C3AED",
    lbl:"Working Hours", val:"Mon – Sat, 9:00 AM – 5:00 PM", isLink:false,
  },
  {
    Icon: IcoMapPin, bg:"#ECFDF5", ic:"#065F46",
    lbl:"Address", val:"Vidyanagar, Karad, Maharashtra – 415124", isLink:false,
  },
];

/* Feature rows — SVG icon component + color config */
const FEATURES = [
  {
    Icon: IcoMegaphone,  bg:"#EBF2FD", bc:"#C2D6FA", ic:"#3B7DED",
    title:"Announcements",
    desc:"TPO posts placement drives and general notices. Students receive real-time updates.",
  },
  {
    Icon: IcoBriefcase,  bg:"#FEF3C7", bc:"#FDE68A", ic:"#D97706",
    title:"Company Management",
    desc:"Manage company profiles, salary packages, eligibility criteria and required skills.",
  },
  {
    Icon: IcoClipboard,  bg:"#F5F3FF", bc:"#DDD6FE", ic:"#7C3AED",
    title:"Applications",
    desc:"Students apply to drives. TPO reviews, accepts or rejects with remarks.",
  },
  {
    Icon: IcoCheckCircle, bg:"#F0FDF4", bc:"#BBF7D0", ic:"#16A34A",
    title:"Placement Tracking",
    desc:"Mark students as Placed or Unplaced. Live placement rate dashboard.",
  },
  {
    Icon: IcoFileText,   bg:"#FEF2F2", bc:"#FECACA", ic:"#DC2626",
    title:"Resume Management",
    desc:"Students upload resumes. TPO views PDFs directly in the portal.",
  },
  {
    Icon: IcoUsers,      bg:"#ECFDF5", bc:"#A7F3D0", ic:"#065F46",
    title:"Student Records",
    desc:"Filter by branch, semester, CGPA, skills. Download as CSV with one click.",
  },
];

export default function TpoAbout() {
  const [students,  setStudents]  = useState([]);
  const [companies, setCompanies] = useState([]);
  const [anns,      setAnns]      = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/user/students`, tk()),
      API.get(`/company`,       tk()),
      API.get(`/announcement`,  tk()),
    ])
      .then(([s, c, a]) => {
        setStudents(s.data);
        setCompanies(c.data);
        setAnns(a.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const placed = students.filter(s => s.status==="placed"||s.isPlaced).length;
  const drives = anns.filter(a => a.type==="drive").length;
  const maxPkg = companies.length
    ? Math.max(...companies.map(c => Number(c.salary)||0))
    : 0;

  const initials = (name) => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="ab-root">
      <TpoSidebar />
      <div className="ab-main">
        <TpoNavbar />
        <div className="ab-body">

          {/* ── Hero ── */}
          <div className="ab-hero">
            <div className="ab-hero-inner">
              <div className="ab-hero-logo">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <div className="ab-hero-tag">
                  <span className="ab-hero-dot"/>
                  Training & Placement Cell
                </div>
                <h1 className="ab-hero-title">PlacementHub — GCEK</h1>
                <p className="ab-hero-sub">
                  Government College of Engineering, Karad's centralized placement management portal.
                  Connecting students with opportunities, one drive at a time.
                </p>
              </div>
            </div>

            {/* Live stats */}
            <div className="ab-hero-stats">
              {[
                { val:loading?"—":students.length,  lbl:"Students Registered" },
                { val:loading?"—":companies.length, lbl:"Partner Companies"   },
                { val:loading?"—":placed,            lbl:"Students Placed"    },
                { val:loading?"—":drives,            lbl:"Active Drives"      },
                { val:loading||!maxPkg?"—":`${maxPkg} LPA`, lbl:"Highest Package" },
              ].map((st, i, arr) => (
                <>
                  <div key={i} className="ab-hero-stat">
                    <div className="ab-hero-stat-val">{st.val}</div>
                    <div className="ab-hero-stat-lbl">{st.lbl}</div>
                  </div>
                  {i < arr.length - 1 && <div key={`d${i}`} className="ab-hero-divider"/>}
                </>
              ))}
            </div>
          </div>

          {/* ── Grid content ── */}
          <div className="ab-content">

            {/* TPO Contact */}
            <div className="ab-card" style={{ animation:"abUp 0.5s 0.08s ease both" }}>
              <div className="ab-card-head">
                <div className="ab-card-icon" style={{ background:"#EBF2FD", border:"1px solid #C2D6FA" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3B7DED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.91-.87a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="ab-card-title">TPO Office Contact</div>
              </div>
              <div className="ab-card-body">
                {CONTACTS.map((c, i) => (
                  <div className="ab-contact-row" key={i}>
                    {/* SVG icon replacing emoji */}
                    <div className="ab-contact-ico" style={{ background:c.bg }}>
                      <c.Icon size={16} color={c.ic} sw={2} />
                    </div>
                    <div>
                      <div className="ab-contact-lbl">{c.lbl}</div>
                      {c.isLink
                        ? <a className="ab-contact-link" href={c.href}>{c.val}</a>
                        : <div className="ab-contact-val">{c.val}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="ab-card" style={{ animation:"abUp 0.5s 0.12s ease both" }}>
              <div className="ab-card-head">
                <div className="ab-card-icon" style={{ background:"#F5F3FF", border:"1px solid #DDD6FE" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="ab-card-title">Placement Team</div>
              </div>
              <div className="ab-card-body">
                {TEAM.map((m, i) => (
                  <div className="ab-team-row" key={i}>
                    <div className="ab-team-av" style={{ background:m.color }}>
                      {initials(m.name)}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="ab-team-name">{m.name}</div>
                      <div className="ab-team-role">{m.role}</div>
                    </div>
                    <span className="ab-team-badge" style={{ background:"#EBF2FD", color:"#1B3A6B" }}>
                      GCEK
                    </span>
                  </div>
                ))}

                {/* Institute info */}
                <div style={{ marginTop:20, padding:"14px 16px", background:"linear-gradient(135deg,#F8FAFC,#EBF2FD44)", border:"1px solid #E2E4E9", borderRadius:10 }}>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:"#B0BAC8", marginBottom:6 }}>Institute</div>
                  <div style={{ fontSize:13.5, fontWeight:800, color:"#0D1C33", marginBottom:3 }}>
                    Govt. College of Engineering, Karad
                  </div>
                  <div style={{ fontSize:12, color:"#7A8599", lineHeight:1.6 }}>
                    Autonomous Institute · Affiliated to Shivaji University<br/>
                    NAAC Accredited · Est. 1960
                  </div>
                </div>
              </div>
            </div>

            {/* Portal Features — full width */}
            <div className="ab-card ab-card-full" style={{ animation:"abUp 0.5s 0.16s ease both" }}>
              <div className="ab-card-head">
                <div className="ab-card-icon" style={{ background:"#FEF3C7", border:"1px solid #FDE68A" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div className="ab-card-title">Portal Features</div>
              </div>
              <div className="ab-card-body">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 32px" }}>
                  {FEATURES.map((f, i) => (
                    <div className="ab-feat" key={i}>
                      {/* SVG icon replacing emoji */}
                      <div
                        className="ab-feat-ico"
                        style={{ background:f.bg, border:`1px solid ${f.bc}` }}
                      >
                        <f.Icon size={16} color={f.ic} sw={2} />
                      </div>
                      <div>
                        <div className="ab-feat-title">{f.title}</div>
                        <div className="ab-feat-desc">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}