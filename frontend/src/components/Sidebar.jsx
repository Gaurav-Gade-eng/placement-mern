import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

/* ── inject styles once ── */
if (!document.getElementById("sb-styles")) {
  const s = document.createElement("style");
  s.id = "sb-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    .sidebar {
      width: 64px; background: #FFFFFF; height: 100vh;
      display: flex; flex-direction: column; align-items: center;
      padding: 18px 0; position: sticky; top: 0;
      border-right: 1px solid #EFF1F5;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow: visible; z-index: 50; flex-shrink: 0;
    }
    .sb-logo {
      width: 36px; height: 36px; background: #EBF2FD;
      border: 1px solid #C2D6FA; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 28px; flex-shrink: 0; color: #3B7DED;
      transition: background 0.15s;
    }
    .sb-logo:hover { background: #D6E8FC; }
    .sb-nav {
      display: flex; flex-direction: column; align-items: center;
      gap: 2px; flex: 1; width: 100%; padding: 0 10px;
    }
    .sb-item {
      position: relative; width: 100%;
      display: flex; align-items: center; justify-content: center;
    }
    .sb-link {
      display: flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 10px;
      color: #B0B8C8; text-decoration: none;
      transition: background 0.15s, color 0.15s; position: relative;
    }
    .sb-link:hover { background: #F5F7FA; color: #4A5568; }
    .sb-link.active { background: #EBF2FD; color: #3B7DED; }
    .sb-link.active::before {
      content: ''; position: absolute; left: -10px; top: 50%;
      transform: translateY(-50%); width: 3px; height: 20px;
      background: #3B7DED; border-radius: 0 3px 3px 0;
    }
    .sb-tip {
      position: absolute; left: calc(100% + 14px); top: 50%;
      transform: translateY(-50%) translateX(-4px);
      background: #1A2235; color: #F0F4FA;
      font-size: 11.5px; font-weight: 600; padding: 5px 11px;
      border-radius: 7px; white-space: nowrap; pointer-events: none;
      opacity: 0; transition: opacity 0.15s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15); z-index: 100; letter-spacing: 0.1px;
    }
    .sb-tip::before {
      content: ''; position: absolute; right: 100%; top: 50%;
      transform: translateY(-50%); border: 5px solid transparent;
      border-right-color: #1A2235;
    }
    .sb-item:hover .sb-tip { opacity: 1; transform: translateY(-50%) translateX(0); }
    .sb-div { width: 32px; height: 1px; background: #EFF1F5; margin: 8px 0; }
    .sb-bottom {
      display: flex; flex-direction: column; align-items: center;
      gap: 2px; width: 100%; padding: 0 10px 6px;
    }
    .sb-icon-btn {
      display: flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 10px;
      color: #B0B8C8; cursor: pointer; background: none; border: none;
      transition: background 0.15s, color 0.15s;
    }
    .sb-icon-btn:hover { background: #F5F7FA; color: #4A5568; }
    .sb-avatar {
      width: 34px; height: 34px; border-radius: 9px;
      background: #EBF2FD; border: 1px solid #C2D6FA;
      display: flex; align-items: center; justify-content: center;
      font-size: 11.5px; font-weight: 700; color: #3B7DED; cursor: pointer;
      transition: background 0.15s, box-shadow 0.15s;
      letter-spacing: 0.3px; margin-top: 2px;
    }
    .sb-avatar:hover { background: #D6E8FC; box-shadow: 0 2px 8px rgba(59,125,237,0.15); }

    @keyframes popupIn {
      from { opacity: 0; transform: translateX(-8px) scale(0.96); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
  `;
  document.head.appendChild(s);
}

const navItems = [
  { to: "/dashboard", label: "Dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { to: "/companies", label: "Companies",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { to: "/announcements", label: "Announcements",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { to: "/resume", label: "Upload Resume",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> },
  { to: "/profile", label: "Update Profile",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { to: "/suggestions", label: "Companies Suggestions",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
];

/* ── Logout popup ── */
function AccountPopup({ user, onClose, onLogout }) {
  const ref = useRef(null);
  const [logoutHover, setLogoutHover] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: "absolute",
      left: "calc(100% + 12px)",
      bottom: 0,
      width: 210,
      background: "#fff",
      border: "1px solid #E2E4E9",
      borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      overflow: "hidden",
      zIndex: 200,
      animation: "popupIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* user info header */}
      <div style={{
        padding: "14px 16px 12px",
        borderBottom: "1px solid #F0F2F6",
      }}>
        {/* avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "#EBF2FD", border: "1px solid #C2D6FA",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#3B7DED", flexShrink: 0,
          }}>
            {(user.name || "S").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0D1C33", lineHeight: 1.2 }}>
              {user.name || "Student"}
            </div>
            <div style={{ fontSize: 10.5, color: "#7A8599", marginTop: 1 }}>
              {user.email || user.role || ""}
            </div>
          </div>
        </div>
      </div>

      {/* logout button */}
      <button
        onMouseEnter={() => setLogoutHover(true)}
        onMouseLeave={() => setLogoutHover(false)}
        onClick={onLogout}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "11px 16px",
          background: logoutHover ? "#FEF2F2" : "transparent",
          border: "none", cursor: "pointer",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12.5, fontWeight: 600,
          color: logoutHover ? "#DC2626" : "#4A5568",
          transition: "background 0.15s, color 0.15s",
          textAlign: "left",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          style={{ transition: "transform 0.2s", transform: logoutHover ? "translateX(2px)" : "translateX(0)" }}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Log Out
      </button>
    </div>
  );
}

function Sidebar() {
  const location              = useLocation();
  const navigate              = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const user     = JSON.parse(localStorage.getItem("user") || '{"name":"Student"}');
  const initials = (user.name || "S").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="sb-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>

      {/* Nav items */}
      <nav className="sb-nav">
        {navItems.map(item => (
          <div className="sb-item" key={item.to}>
            <Link
              to={item.to}
              className={`sb-link ${location.pathname === item.to ? "active" : ""}`}
            >
              {item.icon}
            </Link>
            <div className="sb-tip">{item.label}</div>
          </div>
        ))}
      </nav>

      <div className="sb-div" />

      {/* Bottom */}
      <div className="sb-bottom">

        {/* Account icon — replaces Settings */}
        <div className="sb-item" style={{ position: "relative" }}>
          <button
            className="sb-icon-btn"
            onClick={() => setShowPopup(p => !p)}
            style={{
              color: showPopup ? "#3B7DED" : undefined,
              background: showPopup ? "#EBF2FD" : undefined,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          {/* tooltip only when popup is closed */}
          {!showPopup && <div className="sb-tip">Account</div>}
          {/* popup */}
          {showPopup && (
            <AccountPopup
              user={user}
              onClose={() => setShowPopup(false)}
              onLogout={handleLogout}
            />
          )}
        </div>

        {/* Avatar */}
        <div className="sb-item">
          <div
            className="sb-avatar"
            onClick={() => setShowPopup(p => !p)}
          >
            {initials}
          </div>
          {!showPopup && <div className="sb-tip">{user.name || "Student"}</div>}
        </div>

      </div>
    </div>
  );
}

export default Sidebar;