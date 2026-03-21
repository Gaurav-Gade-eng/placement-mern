import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── inject styles once ── */
if (!document.getElementById("tpo-nav-styles")) {
  const s = document.createElement("style");
  s.id = "tpo-nav-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @keyframes tpoNavIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes tpoPopupIn {
      from { opacity: 0; transform: translateY(-6px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .tpo-nav {
      position: sticky; top: 0; z-index: 100;
      height: 60px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 28px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid #EFF1F5;
      box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
      font-family: 'Plus Jakarta Sans', sans-serif;
      animation: tpoNavIn 0.4s ease both;
    }

    /* brand — width matches sidebar (64px) so text lines up perfectly */
    .tpo-nav-brand {
      display: flex; align-items: center;
      width: 64px; /* same as .tpo-sidebar width */
      cursor: pointer; text-decoration: none; flex-shrink: 0;
      padding-left: 0;
    }
    .tpo-nav-wordmark { display: flex; flex-direction: column; }
    .tpo-nav-name {
      font-size: 13.5px; font-weight: 800; color: #0D1C33;
      letter-spacing: -0.4px; line-height: 1.15;
      white-space: nowrap;
    }
    .tpo-nav-sub {
      font-size: 8px; font-weight: 700; color: #B0BAC8;
      letter-spacing: 1.6px; text-transform: uppercase; line-height: 1.3;
      white-space: nowrap;
    }

    /* badge */
    .tpo-nav-badge {
      display: inline-flex; align-items: center; gap: 5px;
      background: #FEF3C7; border: 1px solid #FDE68A;
      border-radius: 20px; padding: 4px 10px 4px 7px;
      font-size: 10.5px; font-weight: 700; color: #92400E;
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: 0.2px;
    }
    .tpo-nav-badge-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #D97706;
      box-shadow: 0 0 0 2px rgba(217,119,6,0.2);
    }

    /* links pill container */
    .tpo-nav-links {
      display: flex; align-items: center;
      background: #F0F2F6; border-radius: 10px;
      padding: 3px; gap: 1px;
      border: 1px solid #E2E4E9;
    }
    .tpo-nav-link {
      text-decoration: none; padding: 5px 14px;
      font-size: 12.5px; font-weight: 500; border-radius: 7px;
      color: #7A8599; transition: color 0.15s, background 0.15s, box-shadow 0.15s;
      white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer; border: none; background: transparent;
    }
    .tpo-nav-link:hover { color: #0D1C33; background: rgba(255,255,255,0.7); }
    .tpo-nav-link.active {
      background: #fff; color: #1B3A6B; font-weight: 700;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    /* right side */
    .tpo-nav-right {
      display: flex; align-items: center; gap: 10px;
    }

    /* logout popup */
    .tpo-nav-user {
      position: relative; display: flex; align-items: center; gap: 8px;
      cursor: pointer; padding: 5px 10px 5px 7px;
      border-radius: 8px; border: 1px solid #E2E4E9;
      background: #fff; transition: border-color 0.15s, box-shadow 0.15s;
    }
    .tpo-nav-user:hover { border-color: #C7D9F5; box-shadow: 0 2px 8px rgba(59,125,237,0.08); }
    .tpo-nav-avatar {
      width: 28px; height: 28px; border-radius: 7px;
      background: linear-gradient(135deg, #1B3A6B, #2563EB);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; color: #fff; letter-spacing: 0.5px;
      flex-shrink: 0;
    }
    .tpo-nav-uname {
      font-size: 12px; font-weight: 600; color: #0D1C33;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .tpo-nav-urole {
      font-size: 10px; color: #B0BAC8; font-weight: 500;
    }
    .tpo-nav-chevron {
      color: #B0BAC8; transition: transform 0.18s;
    }
    .tpo-nav-user.open .tpo-nav-chevron { transform: rotate(180deg); }

    /* dropdown */
    .tpo-nav-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 200px; background: #fff;
      border: 1px solid #E2E4E9; border-radius: 12px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05);
      overflow: hidden; z-index: 200;
      animation: tpoPopupIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .tpo-nav-dd-head {
      padding: 12px 14px 10px;
      border-bottom: 1px solid #F0F2F6;
    }
    .tpo-nav-dd-name { font-size: 12.5px; font-weight: 700; color: #0D1C33; }
    .tpo-nav-dd-email { font-size: 10.5px; color: #7A8599; margin-top: 1px; }
    .tpo-nav-dd-btn {
      display: flex; align-items: center; gap: 9px;
      width: 100%; padding: 10px 14px;
      background: none; border: none; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12.5px; font-weight: 600; color: #4A5568;
      transition: background 0.15s, color 0.15s; text-align: left;
    }
    .tpo-nav-dd-btn:hover { background: #FEF2F2; color: #DC2626; }
  `;
  document.head.appendChild(s);
}

const NAV_LINKS = [
  { label: "Dashboard", path: "/tpo-dashboard" },
  { label: "Students",  path: "/admin/students" },
  { label: "About",     path: "/admin/about" },
];

function TpoNavbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);
  const [logHover, setLogHover] = useState(false);
  const ref = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"TPO Admin","email":""}');
  const initials = (user.name || "TP").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="tpo-nav">
      {/* Brand — icon lives in sidebar; navbar shows only wordmark aligned to sidebar width */}
      <div className="tpo-nav-brand" onClick={() => navigate("/tpo-dashboard")}>
        <div className="tpo-nav-wordmark">
          <span className="tpo-nav-name">PlacementHub</span>
          <span className="tpo-nav-sub">Admin Portal</span>
        </div>
      </div>

      {/* Nav links */}
      <div className="tpo-nav-links">
        {NAV_LINKS.map(l => (
          <button
            key={l.path}
            className={`tpo-nav-link${location.pathname === l.path ? " active" : ""}`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="tpo-nav-right">
        {/* TPO badge */}
        <div className="tpo-nav-badge">
          <div className="tpo-nav-badge-dot" />
          TPO Office
        </div>

        {/* User menu */}
        <div
          ref={ref}
          className={`tpo-nav-user${open ? " open" : ""}`}
          onClick={() => setOpen(p => !p)}
        >
          <div className="tpo-nav-avatar">{initials}</div>
          <div>
            <div className="tpo-nav-uname">{user.name || "Admin"}</div>
            <div className="tpo-nav-urole">{user.role || "TPO"}</div>
          </div>
          <svg className="tpo-nav-chevron" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.3">
            <polyline points="6 9 12 15 18 9"/>
          </svg>

          {open && (
            <div className="tpo-nav-dropdown" onClick={e => e.stopPropagation()}>
              <div className="tpo-nav-dd-head">
                <div className="tpo-nav-dd-name">{user.name || "Admin"}</div>
                <div className="tpo-nav-dd-email">{user.email || user.role || "TPO"}</div>
              </div>
              <button
                className="tpo-nav-dd-btn"
                onMouseEnter={() => setLogHover(true)}
                onMouseLeave={() => setLogHover(false)}
                onClick={logout}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  style={{ transform: logHover ? "translateX(2px)" : "translateX(0)", transition: "transform 0.18s" }}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TpoNavbar;