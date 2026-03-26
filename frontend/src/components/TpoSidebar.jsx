import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ── Inject styles once ── */
if (!document.getElementById("tpo-sb-styles")) {
  const s = document.createElement("style");
  s.id = "tpo-sb-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @keyframes tpoPopupIn {
      from { opacity: 0; transform: translateX(-8px) scale(0.96); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes tpoSheetIn {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes tpoSheetOverlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Desktop sidebar ── */
    .tpo-sidebar {
      width: 64px;
      background: #FFFFFF;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 18px 0;
      position: sticky;
      top: 0;
      border-right: 1px solid #EFF1F5;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow: visible;
      z-index: 50;
      flex-shrink: 0;
    }

    .tpo-sb-logo {
      width: 36px; height: 36px;
      background: linear-gradient(145deg, #1B3A6B 0%, #2563EB 100%);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 28px;
      flex-shrink: 0;
      box-shadow: 0 3px 10px rgba(27,58,107,0.28);
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
      cursor: pointer;
    }
    .tpo-sb-logo:hover {
      transform: scale(1.08);
      box-shadow: 0 5px 16px rgba(27,58,107,0.36);
    }

    .tpo-sb-nav {
      display: flex; flex-direction: column;
      align-items: center; gap: 2px;
      flex: 1; width: 100%; padding: 0 10px;
    }

    .tpo-sb-item {
      position: relative; width: 100%;
      display: flex; align-items: center; justify-content: center;
    }

    .tpo-sb-btn {
      display: flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 10px;
      color: #B0B8C8; cursor: pointer;
      background: none; border: none;
      transition: background 0.15s, color 0.15s;
      position: relative;
    }
    .tpo-sb-btn:hover { background: #F5F7FA; color: #4A5568; }
    .tpo-sb-btn.active { background: #EBF2FD; color: #3B7DED; }
    .tpo-sb-btn.active::before {
      content: '';
      position: absolute;
      left: -10px; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 20px;
      background: #3B7DED;
      border-radius: 0 3px 3px 0;
    }

    /* Tooltip */
    .tpo-sb-tip {
      position: absolute;
      left: calc(100% + 14px); top: 50%;
      transform: translateY(-50%) translateX(-4px);
      background: #1A2235; color: #F0F4FA;
      font-size: 11.5px; font-weight: 600;
      padding: 5px 11px; border-radius: 7px;
      white-space: nowrap; pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      z-index: 100; letter-spacing: 0.1px;
    }
    .tpo-sb-tip::before {
      content: ''; position: absolute;
      right: 100%; top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: #1A2235;
    }
    .tpo-sb-item:hover .tpo-sb-tip {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }

    .tpo-sb-div {
      width: 32px; height: 1px;
      background: #EFF1F5; margin: 8px 0;
    }

    .tpo-sb-bottom {
      display: flex; flex-direction: column;
      align-items: center; gap: 2px;
      width: 100%; padding: 0 10px 6px;
    }

    /* Account popup */
    .tpo-sb-popup {
      position: absolute;
      left: calc(100% + 12px); bottom: 0;
      width: 210px; background: #fff;
      border: 1px solid #E2E4E9; border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden; z-index: 200;
      animation: tpoPopupIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .tpo-sb-popup-head {
      padding: 13px 15px 11px;
      border-bottom: 1px solid #F0F2F6;
      display: flex; align-items: center; gap: 9px;
    }
    .tpo-sb-popup-av {
      width: 30px; height: 30px; border-radius: 8px;
      background: linear-gradient(135deg, #1B3A6B, #2563EB);
      display: flex; align-items: center; justify-content: center;
      font-size: 10.5px; font-weight: 800; color: #fff; flex-shrink: 0;
    }
    .tpo-sb-popup-name { font-size: 12.5px; font-weight: 700; color: #0D1C33; line-height: 1.2; }
    .tpo-sb-popup-role { font-size: 10.5px; color: #7A8599; margin-top: 1px; }
    .tpo-sb-popup-btn {
      display: flex; align-items: center; gap: 9px;
      width: 100%; padding: 10px 15px;
      background: none; border: none; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12.5px; font-weight: 600; color: #4A5568;
      transition: background 0.15s, color 0.15s; text-align: left;
    }
    .tpo-sb-popup-btn:hover { background: #FEF2F2; color: #DC2626; }

    .tpo-sb-avatar {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(135deg, #1B3A6B, #2563EB);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.15s;
      letter-spacing: 0.5px; margin-top: 2px;
    }
    .tpo-sb-avatar:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 12px rgba(27,58,107,0.3);
    }

    /* ── Bottom tab bar (mobile only) ── */
    .tpo-bottom-bar {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 60px;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-top: 1px solid #EFF1F5;
      box-shadow: 0 -2px 16px rgba(0,0,0,0.07);
      z-index: 80;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 0 4px;
      align-items: center;
      justify-content: space-around;
    }

    .tpo-tab-btn {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 3px;
      flex: 1; height: 100%;
      background: none; border: none;
      cursor: pointer;
      color: #B0B8C8;
      transition: color 0.15s;
      position: relative;
      padding: 6px 4px;
      min-width: 0;
    }
    .tpo-tab-btn.active { color: #2563EB; }
    .tpo-tab-btn.active::before {
      content: '';
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      width: 28px; height: 2.5px;
      background: #2563EB;
      border-radius: 0 0 4px 4px;
    }
    .tpo-tab-label {
      font-size: 9.5px; font-weight: 700;
      letter-spacing: 0.2px;
      white-space: nowrap; overflow: hidden;
      text-overflow: ellipsis; max-width: 52px;
    }

    /* More button tab */
    .tpo-tab-more { color: #7A8599; }
    .tpo-tab-more.sheet-open { color: #2563EB; }

    /* ── More sheet overlay ── */
    .tpo-sheet-overlay {
      display: none;
      position: fixed; inset: 0;
      z-index: 88;
      background: rgba(13,28,51,0.4);
      backdrop-filter: blur(2px);
      animation: tpoSheetOverlayIn 0.2s ease;
    }
    .tpo-sheet-overlay.visible { display: block; }

    /* ── More sheet ── */
    .tpo-more-sheet {
      display: none;
      position: fixed;
      bottom: 60px; left: 0; right: 0;
      background: #fff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border-top: 1px solid #EFF1F5;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.1);
      z-index: 89;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 0 0 16px;
      animation: tpoSheetIn 0.25s cubic-bezier(0.4,0,0.2,1) both;
    }
    .tpo-more-sheet.open { display: block; }

    .tpo-sheet-handle {
      width: 36px; height: 4px;
      background: #E2E4E9; border-radius: 4px;
      margin: 12px auto 14px;
    }
    .tpo-sheet-section-label {
      font-size: 9.5px; font-weight: 700; color: #B0BAC8;
      letter-spacing: 1px; text-transform: uppercase;
      padding: 0 20px; margin-bottom: 6px;
    }
    .tpo-sheet-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 20px;
      background: none; border: none;
      width: 100%; text-align: left;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px; font-weight: 600; color: #4A5568;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .tpo-sheet-item:hover { background: #F5F7FA; color: #0D1C33; }
    .tpo-sheet-item.active { color: #1B3A6B; background: #EBF2FD; }
    .tpo-sheet-icon {
      width: 36px; height: 36px; border-radius: 9px;
      background: #F0F2F6;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s;
    }
    .tpo-sheet-item.active .tpo-sheet-icon { background: #D6E8FB; color: #2563EB; }
    .tpo-sheet-divider {
      height: 1px; background: #F0F2F6; margin: 8px 16px;
    }
    .tpo-sheet-logout {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 20px;
      background: none; border: none;
      width: 100%; text-align: left;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px; font-weight: 600; color: #DC2626;
      cursor: pointer;
      transition: background 0.15s;
    }
    .tpo-sheet-logout:hover { background: #FEF2F2; }

    /* ── Mobile responsive ── */
    @media (max-width: 768px) {
      /* Hide the desktop sidebar */
      .tpo-sidebar { display: none; }

      /* Show the bottom tab bar */
      .tpo-bottom-bar { display: flex; }
    }
  `;
  document.head.appendChild(s);
}

const NAV_ITEMS = [
  {
    path: "/tpo-dashboard",
    label: "Dashboard",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "rgba(37,99,235,0.15)" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    path: "/admin/students",
    label: "Students",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    path: "/admin/companies",
    label: "Companies",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    path: "/admin/announcements",
    label: "Announce",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

// Items shown in "More" sheet (the ones not in bottom bar)
const MORE_ITEMS = [
  {
    path: "/admin/add-student",
    label: "Add Student",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    ),
  },
  {
    path: "/admin/applications",
    label: "Applications",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    path: "/admin/placed",
    label: "Mark Placed",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

// All sidebar items for desktop
const ALL_NAV_ITEMS = [
  { path: "/tpo-dashboard", label: "Dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { path: "/admin/students", label: "Students",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { path: "/admin/add-student", label: "Add Student",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
  { path: "/admin/companies", label: "Company Info",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { path: "/admin/announcements", label: "Announcements",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { path: "/admin/applications", label: "Applications",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { path: "/admin/placed", label: "Mark Placed",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
];

function TpoSidebar() {
  const location              = useLocation();
  const navigate              = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [logHover,  setLogHover]  = useState(false);
  const popRef = useRef(null);

  const user     = JSON.parse(localStorage.getItem("user") || '{"name":"TPO Admin"}');
  const initials = (user.name || "TP").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const h = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setShowPopup(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  const isMoreActive = MORE_ITEMS.some(i => i.path === location.pathname);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <div className="tpo-sidebar">
        {/* Logo */}
        <div className="tpo-sb-logo" onClick={() => navigate("/tpo-dashboard")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>

        {/* Nav items */}
        <nav className="tpo-sb-nav">
          {ALL_NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <div className="tpo-sb-item" key={item.path}>
                <button
                  className={`tpo-sb-btn${isActive ? " active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                </button>
                <div className="tpo-sb-tip">{item.label}</div>
              </div>
            );
          })}
        </nav>

        <div className="tpo-sb-div" />

        {/* Bottom: account + avatar */}
        <div className="tpo-sb-bottom">
          <div className="tpo-sb-item" ref={popRef} style={{ position: "relative" }}>
            <button
              className="tpo-sb-btn"
              onClick={() => setShowPopup(p => !p)}
              style={{
                color:      showPopup ? "#3B7DED" : undefined,
                background: showPopup ? "#EBF2FD" : undefined,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </button>
            {!showPopup && <div className="tpo-sb-tip">Account</div>}

            {showPopup && (
              <div className="tpo-sb-popup">
                <div className="tpo-sb-popup-head">
                  <div className="tpo-sb-popup-av">{initials}</div>
                  <div>
                    <div className="tpo-sb-popup-name">{user.name || "TPO Admin"}</div>
                    <div className="tpo-sb-popup-role">{user.email || user.role || "TPO"}</div>
                  </div>
                </div>
                <button
                  className="tpo-sb-popup-btn"
                  onMouseEnter={() => setLogHover(true)}
                  onMouseLeave={() => setLogHover(false)}
                  onClick={logout}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: logHover ? "translateX(2px)" : "translateX(0)", transition: "transform 0.18s" }}
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>

          <div className="tpo-sb-item">
            <div className="tpo-sb-avatar" onClick={() => setShowPopup(p => !p)}>
              {initials}
            </div>
            {!showPopup && <div className="tpo-sb-tip">{user.name || "TPO Admin"}</div>}
          </div>
        </div>
      </div>

      {/* ── Mobile: Bottom Tab Bar ── */}
      <div className="tpo-bottom-bar">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`tpo-tab-btn${isActive ? " active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon(isActive)}
              <span className="tpo-tab-label">{item.label}</span>
            </button>
          );
        })}

        {/* More button */}
        <button
          className={`tpo-tab-btn tpo-tab-more${showSheet ? " sheet-open" : ""}${isMoreActive ? " active" : ""}`}
          onClick={() => setShowSheet(p => !p)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
          </svg>
          <span className="tpo-tab-label">More</span>
        </button>
      </div>

      {/* ── More sheet overlay ── */}
      <div
        className={`tpo-sheet-overlay${showSheet ? " visible" : ""}`}
        onClick={() => setShowSheet(false)}
      />

      {/* ── More sheet ── */}
      <div className={`tpo-more-sheet${showSheet ? " open" : ""}`}>
        <div className="tpo-sheet-handle" />

        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 12px", borderBottom: "1px solid #F0F2F6" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #1B3A6B, #2563EB)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>{initials}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0D1C33", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.name || "TPO Admin"}</div>
            <div style={{ fontSize: 11, color: "#7A8599", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.email || user.role || "TPO"}</div>
          </div>
        </div>

        <div className="tpo-sheet-section-label" style={{ marginTop: 12 }}>More Options</div>

        {MORE_ITEMS.map(item => (
          <button
            key={item.path}
            className={`tpo-sheet-item${location.pathname === item.path ? " active" : ""}`}
            onClick={() => { navigate(item.path); setShowSheet(false); }}
          >
            <span className="tpo-sheet-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="tpo-sheet-divider" />

        <button className="tpo-sheet-logout" onClick={logout}>
          <span className="tpo-sheet-icon" style={{ background: "#FEF2F2" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          Log Out
        </button>
      </div>
    </>
  );
}

export default TpoSidebar;