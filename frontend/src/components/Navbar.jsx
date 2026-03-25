import { Link, useLocation, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

  .navbar {
    height: 64px;
    background: #fff;
    border-bottom: 1px solid #e8ecf4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    font-family: 'Sora', sans-serif;
    position: sticky;
    top: 0;
    z-index: 40;
    box-shadow: 0 1px 8px rgba(0,0,0,0.05);
    gap: 24px;
  }

  .navbar-left {
    display: flex;
    flex-direction: column;
    min-width: 140px;
  }

  .navbar-greeting {
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
    letter-spacing: 0.5px;
    line-height: 1;
    margin-bottom: 2px;
  }

  .navbar-name {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.2px;
    line-height: 1;
  }

  .navbar-name span { color: #6366f1; }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
    justify-content: center;
  }

  .navbar-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    transition: background 0.15s, color 0.15s;
    position: relative;
  }

  .navbar-link:hover  { background: #f1f5f9; color: #1e293b; }
  .navbar-link.active { background: rgba(99,102,241,0.08); color: #6366f1; font-weight: 600; }
  .navbar-link.active .nav-dot { opacity: 1; }

  .nav-dot {
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #6366f1;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    justify-content: flex-end;
  }

  .icon-btn {
    width: 38px; height: 38px;
    border-radius: 10px;
    border: 1px solid #e8ecf4;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s;
    position: relative;
  }

  .icon-btn:hover {
    background: rgba(99,102,241,0.07);
    color: #6366f1;
    border-color: rgba(99,102,241,0.25);
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

  .icon-btn.ann-active {
    background: rgba(99,102,241,0.1);
    color: #6366f1;
    border-color: rgba(99,102,241,0.35);
    box-shadow: 0 2px 8px rgba(99,102,241,0.15);
  }

  .notif-badge {
    position: absolute;
    top: 7px; right: 7px;
    width: 7px; height: 7px;
    background: #ef4444;
    border-radius: 50%;
    border: 1.5px solid #fff;
    animation: badgePulse 2s ease infinite;
  }

  @keyframes badgePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.45); }
    60%     { box-shadow: 0 0 0 5px rgba(239,68,68,0);   }
  }

  .nav-vdivider { width: 1px; height: 22px; background: #e8ecf4; flex-shrink: 0; }

  .navbar-avatar {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    border: 2px solid rgba(99,102,241,0.2);
    user-select: none;
    flex-shrink: 0;
  }

  .navbar-avatar:hover {
    transform: scale(1.06);
    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
  }

  /* ── AI Assistant button ── */
  .ai-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    height: 36px;
    padding: 0 16px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 10px rgba(99,102,241,0.35);
    white-space: nowrap;
    flex-shrink: 0;
    text-decoration: none;
    letter-spacing: 0.1px;
  }

  .ai-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #818cf8, #6366f1);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .ai-btn > * { position: relative; z-index: 1; }

  .ai-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(99,102,241,0.5);
  }

  .ai-btn:hover::after { opacity: 1; }
  .ai-btn:active       { transform: none; }

  .ai-btn.ai-active {
    background: linear-gradient(135deg, #4338ca, #3730a3);
    box-shadow: 0 2px 10px rgba(67,56,202,0.45),
                inset 0 1px 0 rgba(255,255,255,0.08);
  }

  .ai-shimmer {
    position: absolute;
    top: 0; left: -100%;
    width: 55%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    animation: aiShimmer 2.8s ease infinite;
    pointer-events: none;
  }

  @keyframes aiShimmer {
    0%   { left: -100%; }
    45%  { left: 160%;  }
    100% { left: 160%;  }
  }

  .ai-icon {
    display: flex;
    align-items: center;
    animation: aiWobble 3s ease infinite;
  }

  @keyframes aiWobble {
    0%,100% { transform: rotate(0deg);  }
    20%     { transform: rotate(10deg); }
    40%     { transform: rotate(-8deg); }
    60%     { transform: rotate(5deg);  }
    80%     { transform: rotate(0deg);  }
  }

  /* ─────────────────────────────────────────────
     MOBILE RESPONSIVE  (≤ 768px)
  ───────────────────────────────────────────── */
  @media (max-width: 768px) {
    .navbar {
      height: 56px;
      padding: 0 16px;
      gap: 12px;
    }

    /* Hide center nav links on mobile — navigation is in bottom tab bar */
    .navbar-links { display: none; }

    .navbar-left { min-width: 0; }

    .navbar-greeting { font-size: 10px; }
    .navbar-name     { font-size: 14px; }

    /* Right side: show only AI btn + bell + avatar; hide dividers */
    .nav-vdivider { display: none; }

    .navbar-right { gap: 8px; }

    .ai-btn {
      height: 34px;
      padding: 0 12px;
      font-size: 11.5px;
      gap: 5px;
    }

    /* Hide text label on very small screens, keep icon */
    .ai-btn-label { display: none; }

    .ai-btn {
      padding: 0 10px;
      width: 34px;
      justify-content: center;
    }

    .icon-btn {
      width: 34px; height: 34px;
    }

    .navbar-avatar {
      width: 34px; height: 34px;
      font-size: 12px;
    }
  }

  /* ── Slightly larger phones (411px+): show AI label again ── */
  @media (min-width: 411px) and (max-width: 768px) {
    .ai-btn {
      width: auto;
      padding: 0 12px;
    }
    .ai-btn-label { display: inline; }
  }
`;

const navLinks = [
  {
    to: "/dashboard",
    label: "Home",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3"  y="3"  width="7" height="7" rx="1"/>
        <rect x="14" y="3"  width="7" height="7" rx="1"/>
        <rect x="3"  y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: "/companies",
    label: "Companies",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: "/resources",
    label: "Resources",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M4 4v15.5A2.5 2.5 0 0 1 6.5 17H20V4z"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const user     = JSON.parse(localStorage.getItem("user") || '{"name":"Student User"}');
  const location = useLocation();
  const navigate = useNavigate();

  const nameParts  = user?.name?.split(" ") || [];
  const firstName  = nameParts[0] || "Student";
  const secondName = nameParts[1] && nameParts[1] !== firstName ? nameParts[1] : "";
  const initials   = nameParts.map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const onAnnPage = location.pathname === "/announcements";
  const onAiPage  = location.pathname === "/chatbot";

  return (
    <>
      <style>{styles}</style>
      <div className="navbar">

        {/* Left */}
        <div className="navbar-left">
          <span className="navbar-greeting">Hello,</span>
          <span className="navbar-name">
            {firstName} <span>{secondName}</span>
          </span>
        </div>

        {/* Centre — hidden on mobile */}
        <nav className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link${location.pathname === link.to ? " active" : ""}`}
            >
              {link.icon}
              {link.label}
              <span className="nav-dot" />
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="navbar-right">

          {/* AI Assistant button */}
          <Link
            to="/chatbot"
            className={`ai-btn${onAiPage ? " ai-active" : ""}`}
          >
            <span className="ai-shimmer" />
            <span className="ai-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9"  y1="9"  x2="9.01"  y2="9"/>
                <line x1="15" y1="9"  x2="15.01" y2="9"/>
              </svg>
            </span>
            <span className="ai-btn-label">AI Assistant</span>
          </Link>

          <div className="nav-vdivider" />

          {/* Bell */}
          <button
            className={`icon-btn${onAnnPage ? " ann-active" : ""}`}
            title="View Announcements"
            onClick={() => navigate("/announcements")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {!onAnnPage && <span className="notif-badge" />}
          </button>

          <div className="nav-vdivider" />

          {/* Avatar */}
          <div className="navbar-avatar" title={user.name}>{initials}</div>
        </div>

      </div>
    </>
  );
}