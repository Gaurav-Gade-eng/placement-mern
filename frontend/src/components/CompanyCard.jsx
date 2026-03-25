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
function getInitials(name = "") { return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

const T = {
  ff:     "'Plus Jakarta Sans', sans-serif",
  ink:    "#111827",
  ink2:   "#6B7280",
  ink3:   "#374151",
  border: "#E5E7EB",
  blue:   "#2563EB",
};

/* inject font + keyframes once */
if (!document.getElementById("fcc-styles")) {
  const s = document.createElement("style");
  s.id = "fcc-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    @keyframes fcc-shimmer-btn {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
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

    /* Mobile: disable 3D tilt (can feel janky on touch) */
    @media (max-width: 600px) {
      .fcc-card { transform: none !important; }
      .fcc-card:active { transform: scale(0.98) !important; }
    }
  `;
  document.head.appendChild(s);
}

function CompanyCard({ company }) {
  const navigate                    = useNavigate();
  const [hover, setHover]           = useState(false);
  const [btnHover, setBtnHover]     = useState(false);
  const [pressed, setPressed]       = useState(false);
  const [imgErr, setImgErr]         = useState(false);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const cardRef                     = useRef(null);

  const logoUrl  = company.logo || getLogoUrl(company.companyName);
  const color    = getInitColor(company.companyName);
  const initials = getInitials(company.companyName);

  /* subtle tilt on mouse move — skip on touch devices */
  const handleMouseMove = (e) => {
    if (!cardRef.current || window.matchMedia("(max-width: 600px)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 4;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -4;
    cardRef.current.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
  };

  const handleMouseLeave = () => {
    setHover(false);
    setPressed(false);
    if (cardRef.current) cardRef.current.style.transform = "translateY(0) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={cardRef}
      className="fcc-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={() => navigate(`/company/${company._id}`)}
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
        transition: "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s cubic-bezier(0.23,1,0.32,1)",
        cursor: "pointer",
        transformStyle: "preserve-3d",
        willChange: "transform",
        /* Ensure min height looks good on narrow screens */
        minHeight: 90,
      }}
    >
      {/* top accent line — slides in on hover */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, #1D4ED8, #3B82F6, #60A5FA)",
        backgroundSize: "200% 100%",
        opacity: hover ? 1 : 0,
        transform: hover ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "opacity 0.3s, transform 0.4s cubic-bezier(0.23,1,0.32,1)",
        zIndex: 2,
        borderRadius: "12px 12px 0 0",
        animation: hover ? "fcc-shimmer-btn 2s linear infinite" : "none",
      }} />

      {/* ── LEFT: logo panel ── */}
      <div style={{
        width: 90,
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
        {/* subtle glow behind logo on hover */}
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
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              padding: "14px",
              borderRadius: 10,
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
              fontSize: 24, fontWeight: 800,
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

      {/* ── RIGHT: info ── */}
      <div style={{
        flex: 1,
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 6,
        minWidth: 0,
      }}>
        {/* company name */}
        <div style={{
          fontSize: 14, fontWeight: 700, color: hover ? "#1D4ED8" : T.ink,
          lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 0.2s ease",
          animation: "fcc-slide-right 0.3s ease both",
        }}>
          {company.companyName}
        </div>

        <div style={{
          fontSize: 12.5, fontWeight: 400, color: T.ink2,
          animation: "fcc-slide-right 0.3s 0.05s ease both",
        }}>
          Package per LPA:{" "}
          <span style={{
            fontWeight: 600, color: hover ? T.blue : T.ink3,
            transition: "color 0.2s",
          }}>
            {company.salary}
          </span>
        </div>

        {/* Explore More button */}
        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={e => { e.stopPropagation(); navigate(`/company/${company._id}`); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: btnHover ? 8 : 5,
            alignSelf: "flex-start",
            border: `1px solid ${btnHover ? T.blue : "#D1D5DB"}`,
            background: btnHover
              ? "linear-gradient(135deg, #2563EB, #3B82F6)"
              : "#fff",
            borderRadius: 6,
            padding: "5px 10px",
            fontFamily: T.ff,
            fontSize: 12, fontWeight: 500,
            color: btnHover ? "#fff" : T.ink3,
            cursor: "pointer",
            boxShadow: btnHover
              ? "0 4px 14px rgba(37,99,235,0.35)"
              : "0 1px 2px rgba(0,0,0,0.05)",
            transform: btnHover ? "translateY(-1px)" : "translateY(0)",
            transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s, gap 0.15s",
            marginTop: 2,
            animation: btnHover ? "fcc-pulse-ring 0.6s ease" : "none",
          }}
        >
          Explore More
          <svg
            width="11" height="11" viewBox="0 0 24 24"
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
      </div>
    </div>
  );
}

export default CompanyCard;