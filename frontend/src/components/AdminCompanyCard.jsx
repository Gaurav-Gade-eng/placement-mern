import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LOGO_MAP = {
  google:"google.com", microsoft:"microsoft.com", amazon:"amazon.com",
  apple:"apple.com", meta:"meta.com", netflix:"netflix.com",
  infosys:"infosys.com", wipro:"wipro.com", tcs:"tcs.com",
  "tata consultancy":"tcs.com", accenture:"accenture.com", ibm:"ibm.com",
  oracle:"oracle.com", salesforce:"salesforce.com", adobe:"adobe.com",
  uber:"uber.com", flipkart:"flipkart.com", swiggy:"swiggy.com",
  zomato:"zomato.com", paytm:"paytm.com", razorpay:"razorpay.com",
  freshworks:"freshworks.com", zoho:"zoho.com", capgemini:"capgemini.com",
  deloitte:"deloitte.com", cognizant:"cognizant.com", hcl:"hcltech.com",
  samsung:"samsung.com", intel:"intel.com", nvidia:"nvidia.com",
  linkedin:"linkedin.com", spotify:"spotify.com",
  "morgan stanley":"morganstanley.com", servicenow:"servicenow.com",
  snowflake:"snowflake.com", deutsche:"db.com", cadence:"cadence.com",
  "applied materials":"appliedmaterials.com", druva:"druva.com",
  veritas:"veritas.com", gupshup:"gupshup.io", pubmatic:"pubmatic.com",
  "futures first":"futuresfirst.com", "oracle fss":"oracle.com",
  siemens:"siemens.com", schneider:"se.com", whirlpool:"whirlpool.com",
  persistent:"persistent.com", "larsen":"larsen.in", adani:"adani.com",
  "tata consulting":"tcs.com", hsbc:"hsbc.com", "tech mahindra":"techmahindra.com",
  seagate:"seagate.com", workday:"workday.com", bmcsoft:"bmc.com",
};

const INIT_COLORS = [
  "#2563EB","#0891B2","#059669","#7C3AED","#DB2777","#D97706",
];

function getLogoUrl(name = "") {
  const n = name.toLowerCase();
  for (const [k, d] of Object.entries(LOGO_MAP))
    if (n.includes(k)) return `https://logo.clearbit.com/${d}`;
  return `https://logo.clearbit.com/${n.replace(/\s+/g,"").replace(/[^a-z0-9]/g,"")}.com`;
}
function getInitColor(name = "") { return INIT_COLORS[name.charCodeAt(0) % INIT_COLORS.length]; }
function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0,2).map(w => w[0]).join("").toUpperCase();
}

const T = {
  ff:     "'Plus Jakarta Sans', sans-serif",
  ink:    "#111827",
  ink2:   "#6B7280",
  ink3:   "#374151",
  border: "#E5E7EB",
  blue:   "#2563EB",
};

/* inject font + keyframes once — same id as student card so no duplication */
if (!document.getElementById("fcc-styles")) {
  const s = document.createElement("style");
  s.id = "fcc-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    @keyframes fcc-shimmer-btn {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes fcc-pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.3); }
      70%  { box-shadow: 0 0 0 6px rgba(37,99,235,0); }
      100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
    }
    @keyframes fcc-logo-in {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes fcc-slide-right {
      from { transform: translateX(-6px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }


  `;
  document.head.appendChild(s);
}

/**
 * AdminCompanyCard
 * Props:
 *   company  — same shape as student company object
 *   onDelete — called with company when trash icon clicked
 */
/* ── Delete button component (matches View Details style) ── */
function DeleteBtn({ onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={e => { e.stopPropagation(); onDelete(); }}
      style={{
        display: "inline-flex", alignItems: "center",
        gap: hover ? 8 : 5,
        border: `1px solid ${hover ? "#DC2626" : "#E5E7EB"}`,
        background: hover ? "linear-gradient(135deg,#DC2626,#EF4444)" : "#fff",
        borderRadius: 6,
        padding: "5px 12px",
        fontFamily: T.ff,
        fontSize: 12.5, fontWeight: 500,
        color: hover ? "#fff" : "#9CA3AF",
        cursor: "pointer",
        boxShadow: hover
          ? "0 4px 14px rgba(220,38,38,0.3)"
          : "0 1px 2px rgba(0,0,0,0.05)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        transition:
          "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s, gap 0.15s",
      }}
    >
      <svg
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.2"
        style={{
          transform: hover ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          flexShrink: 0,
        }}
      >
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
      </svg>
      Delete
    </button>
  );
}

function AdminCompanyCard({ company, onDelete }) {
  const navigate                  = useNavigate();
  const cardRef                   = useRef(null);
  const [hover, setHover]         = useState(false);
  const [btnHover, setBtnHover]   = useState(false);
  const [delHover, setDelHover]   = useState(false);
  const [delBtnHover, setDelBtnHover] = useState(false);
  const [pressed, setPressed]     = useState(false);
  const [imgErr, setImgErr]       = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const logoUrl  = company.logo || getLogoUrl(company.companyName);
  const color    = getInitColor(company.companyName);
  const initials = getInitials(company.companyName);

  /* 3-D tilt — identical to student card */
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 4;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -4;
    cardRef.current.style.transform =
      `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
  };
  const handleMouseLeave = () => {
    setHover(false); setPressed(false);
    if (cardRef.current)
      cardRef.current.style.transform =
        "translateY(0) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        fontFamily: T.ff,
        background: "#fff",
        border: `1px solid ${hover ? "#93C5FD" : T.border}`,
        borderRadius: 12,
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        boxShadow: pressed
          ? "0 2px 8px rgba(0,0,0,0.08)"
          : hover
            ? "0 12px 32px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.06)"
            : "0 1px 3px rgba(0,0,0,0.06)",
        transition:
          "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s cubic-bezier(0.23,1,0.32,1)",
        cursor: "default",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* ── shimmer accent line — identical to student card ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg,#1D4ED8,#3B82F6,#60A5FA)",
        backgroundSize: "200% 100%",
        opacity: hover ? 1 : 0,
        transform: hover ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "opacity 0.3s, transform 0.4s cubic-bezier(0.23,1,0.32,1)",
        zIndex: 2,
        borderRadius: "12px 12px 0 0",
        animation: hover ? "fcc-shimmer-btn 2s linear infinite" : "none",
      }} />

      {/* ── Logo panel — identical to student card ── */}
      <div style={{
        width: 110,
        flexShrink: 0,
        background: hover ? "#F0F7FF" : "#F9FAFB",
        borderRight: `1px solid ${hover ? "#DBEAFE" : "#F1F3F6"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        {/* radial glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${color}18 0%, transparent 70%)`,
          opacity: hover ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />

        {!imgErr ? (
          <img
            src={logoUrl}
            alt={`${company.companyName} logo`}
            onError={() => setImgErr(true)}
            onLoad={() => setImgLoaded(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "contain", objectPosition: "center",
              padding: "16px", borderRadius: 10,
              opacity: imgLoaded ? 1 : 0,
              transform: hover
                ? "scale(1.08)"
                : imgLoaded ? "scale(1)" : "scale(0.88)",
              transition: imgLoaded
                ? "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease"
                : "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
              animation: imgLoaded ? "none" : "fcc-logo-in 0.4s ease both",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${color}14`,
            animation: "fcc-logo-in 0.35s ease both",
          }}>
            <span style={{
              fontFamily: T.ff,
              fontSize: 28, fontWeight: 800,
              color, letterSpacing: -1, lineHeight: 1,
              transform: hover ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              display: "inline-block",
            }}>
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* ── Info panel — identical to student card ── */}
      <div style={{
        flex: 1,
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 7,
        minWidth: 0,
      }}>
        {/* company name */}
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: hover ? "#1D4ED8" : T.ink,
          lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 0.2s ease",
          animation: "fcc-slide-right 0.3s ease both",
          transition: "color 0.2s ease",
        }}>
          {company.companyName}
        </div>

        {/* salary */}
        <div style={{
          fontSize: 13, fontWeight: 400, color: T.ink2,
          animation: "fcc-slide-right 0.3s 0.05s ease both",
        }}>
          Package per LPA:{" "}
          <span style={{
            fontWeight: 600,
            color: hover ? T.blue : T.ink3,
            transition: "color 0.2s",
          }}>
            {company.salary}
          </span>
        </div>

        {/* ── Action buttons row ── */}
        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>

          {/* View Details — identical to student "Explore More" */}
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
                          onClick={(e)=>{
              e.stopPropagation();
              navigate(`/admin/companies/${company._id}`);
              }}
              

            style={{
              display: "inline-flex", alignItems: "center",
              gap: btnHover ? 8 : 5,
              border: `1px solid ${btnHover ? T.blue : "#D1D5DB"}`,
              background: btnHover
                ? "linear-gradient(135deg,#2563EB,#3B82F6)"
                : "#fff",
              borderRadius: 6,
              padding: "5px 12px",
              fontFamily: T.ff,
              fontSize: 12.5, fontWeight: 500,
              color: btnHover ? "#fff" : T.ink3,
              cursor: "pointer",
              boxShadow: btnHover
                ? "0 4px 14px rgba(37,99,235,0.35)"
                : "0 1px 2px rgba(0,0,0,0.05)",
              transform: btnHover ? "translateY(-1px)" : "translateY(0)",
              transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s, gap 0.15s",
              animation: btnHover ? "fcc-pulse-ring 0.6s ease" : "none",
            }}
          >
            View Details
            <svg width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              style={{
                transform: btnHover ? "translateX(2px) scale(1.1)" : "translateX(0) scale(1)",
                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                flexShrink: 0,
              }}
            >
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* Delete button — same size/shape, red variant */}
          <button
            onMouseEnter={() => setDelBtnHover(true)}
            onMouseLeave={() => setDelBtnHover(false)}
            onClick={e => { e.stopPropagation(); onDelete && onDelete(company); }}
            style={{
              display: "inline-flex", alignItems: "center",
              gap: delBtnHover ? 7 : 5,
              border: `1px solid ${delBtnHover ? "#EF4444" : "#FCA5A5"}`,
              background: delBtnHover
                ? "linear-gradient(135deg,#DC2626,#EF4444)"
                : "#FEF2F2",
              borderRadius: 6,
              padding: "5px 12px",
              fontFamily: T.ff,
              fontSize: 12.5, fontWeight: 500,
              color: delBtnHover ? "#fff" : "#DC2626",
              cursor: "pointer",
              boxShadow: delBtnHover
                ? "0 4px 14px rgba(220,38,38,0.3)"
                : "0 1px 2px rgba(0,0,0,0.04)",
              transform: delBtnHover ? "translateY(-1px)" : "translateY(0)",
              transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s, gap 0.15s",
            }}
          >
            Delete
            <svg width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              style={{
                transform: delBtnHover ? "translateX(1px) scale(1.1)" : "translateX(0) scale(1)",
                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                flexShrink: 0,
              }}
            >
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </button>

        </div>
      </div>
      
    </div>
  );
}

export default AdminCompanyCard;