import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";

/* ── inject font + keyframes once ── */
if (!document.getElementById("cd-styles")) {
  const s = document.createElement("style");
  s.id = "cd-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes cd-fade-down { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cd-fade-up   { from{opacity:0;transform:translateY(18px)}  to{opacity:1;transform:translateY(0)} }
    @keyframes cd-fade-in   { from{opacity:0}                             to{opacity:1} }
    @keyframes cd-logo-in   { from{opacity:0;transform:scale(0.85)}       to{opacity:1;transform:scale(1)} }
    @keyframes cd-shimmer   { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes cd-skill-in  { from{opacity:0;transform:translateX(-8px)}  to{opacity:1;transform:translateX(0)} }
    @keyframes cd-bar-fill  { from{width:0%} to{width:var(--w)} }
  `;
  document.head.appendChild(s);
}

const T = {
  ff:     "'Plus Jakarta Sans', sans-serif",
  bg:     "#F4F6F9",
  white:  "#FFFFFF",
  ink:    "#0D1C33",
  ink2:   "#4A5568",
  ink3:   "#7A8599",
  ink4:   "#B0BAC8",
  blue:   "#1B3A6B",
  blue2:  "#3B7DED",
  blueLt: "#EBF2FD",
  border: "#E2E4E9",
};

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

const INIT_COLORS = ["#2563EB","#0891B2","#059669","#7C3AED","#DB2777","#D97706"];

function getLogoUrl(name = "") {
  const n = name.toLowerCase();
  for (const [k, d] of Object.entries(LOGO_MAP))
    if (n.includes(k)) return `https://logo.clearbit.com/${d}`;
  return `https://logo.clearbit.com/${n.replace(/\s+/g,"").replace(/[^a-z0-9]/g,"")}.com`;
}
function getInitColor(name = "") { return INIT_COLORS[name.charCodeAt(0) % INIT_COLORS.length]; }
function getInitials(name = "") { return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

/* ── Skeleton ── */
function Skeleton() {
  const sh = {
    background: "linear-gradient(90deg,#EAECF0 25%,#F4F6F9 50%,#EAECF0 75%)",
    backgroundSize: "200% 100%",
    animation: "cd-shimmer 1.5s ease infinite",
    borderRadius: 6,
  };
  return (
    <div style={{ fontFamily: T.ff, background: T.bg, minHeight: "100vh", padding: "32px 48px" }}>
      {/* hero skeleton */}
      <div style={{ background: T.white, borderRadius: 14, padding: "36px 40px", marginBottom: 24,
        border: `1px solid ${T.border}`, display: "flex", gap: 32, alignItems: "center" }}>
        <div style={{ width: 96, height: 96, borderRadius: 16, ...sh, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 18, width: "20%", ...sh }} />
          <div style={{ height: 32, width: "45%", ...sh }} />
          <div style={{ height: 14, width: "30%", ...sh }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ background: T.white, borderRadius: 12, padding: "24px",
            border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ height: 10, width: "35%", ...sh }} />
            <div style={{ height: 22, width: "60%", ...sh }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, icon, color, delay = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: T.white,
        border: `1px solid ${hover ? color + "44" : T.border}`,
        borderRadius: 12,
        padding: "20px 22px",
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: hover ? `0 6px 20px ${color}18` : "0 1px 3px rgba(0,0,0,0.05)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `cd-fade-up 0.45s ease ${delay}s both`,
        cursor: "default",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: color + "15", color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transform: hover ? "scale(1.1) rotate(-5deg)" : "scale(1)",
        transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
          color: T.ink4, marginBottom: 4, fontFamily: T.ff }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, fontFamily: T.ff, letterSpacing: "-0.3px" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ── Skill tag ── */
function SkillTag({ skill, index }) {
  const [hover, setHover] = useState(false);
  const colors = [
    { bg: "#EBF2FD", color: "#1B3A6B", border: "#C7D9F5" },
    { bg: "#E6F7F5", color: "#0D6B5E", border: "#AADDD9" },
    { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
    { bg: "#F3E8FF", color: "#6D28D9", border: "#DDD6FE" },
    { bg: "#FFE4E6", color: "#9F1239", border: "#FECDD3" },
    { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
  ];
  const c = colors[index % colors.length];
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "5px 12px",
        background: hover ? c.color : c.bg,
        color: hover ? "#fff" : c.color,
        border: `1px solid ${hover ? c.color : c.border}`,
        borderRadius: 6,
        fontSize: 12, fontWeight: 600,
        fontFamily: T.ff,
        cursor: "default",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hover ? `0 3px 10px ${c.color}30` : "none",
        transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `cd-skill-in 0.35s ease ${0.05 * index}s both`,
        letterSpacing: "0.2px",
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="3"/>
      </svg>
      {skill}
    </span>
  );
}

function CompanyDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [company, setCompany]   = useState(null);
  const [imgErr, setImgErr]     = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    API.get(`/company/${id}`).then(res => setCompany(res.data));
  }, [id]);

  if (!company) return <Layout><Skeleton /></Layout>;

  const logoUrl  = company.logo || getLogoUrl(company.companyName);
  const color    = getInitColor(company.companyName);
  const initials = getInitials(company.companyName);

  return (
    <Layout>
      <div style={{ fontFamily: T.ff, background: T.bg, minHeight: "100vh", padding: "32px 48px 64px" }}>

        {/* ── BACK BUTTON ── */}
        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: T.ff, fontSize: 13, fontWeight: 600,
            color: btnHover ? T.blue : T.ink3,
            marginBottom: 24, padding: 0,
            transform: btnHover ? "translateX(-3px)" : "translateX(0)",
            transition: "color 0.18s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
            animation: "cd-fade-in 0.3s ease both",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
            style={{ transition: "transform 0.2s", transform: btnHover ? "translateX(-2px)" : "translateX(0)" }}>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Companies
        </button>

        {/* ── HERO CARD ── */}
        <div style={{
          background: T.white,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          animation: "cd-fade-down 0.45s ease both",
          position: "relative",
        }}>
          {/* top gradient bar */}
          <div style={{
            height: 4,
            background: `linear-gradient(90deg, ${T.blue}, ${T.blue2}, #60A5FA)`,
          }} />

          <div style={{ padding: "32px 40px", display: "flex", alignItems: "center", gap: 32 }}>

            {/* logo */}
            <div style={{
              width: 100, height: 100, borderRadius: 16, flexShrink: 0,
              background: "#F9FAFB", border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", position: "relative",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}>
              {!imgErr ? (
                <img
                  src={logoUrl}
                  alt={company.companyName}
                  onError={() => setImgErr(true)}
                  onLoad={() => setImgLoaded(true)}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "contain", padding: 12,
                    opacity: imgLoaded ? 1 : 0,
                    transform: imgLoaded ? "scale(1)" : "scale(0.85)",
                    transition: "opacity 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                    animation: "cd-logo-in 0.4s ease both",
                  }}
                />
              ) : (
                <span style={{
                  fontSize: 28, fontWeight: 800, color,
                  fontFamily: T.ff, letterSpacing: -1,
                  animation: "cd-logo-in 0.4s ease both",
                }}>
                  {initials}
                </span>
              )}
            </div>

            {/* name + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                textTransform: "uppercase", color: T.ink3, marginBottom: 8,
                animation: "cd-fade-down 0.4s 0.1s ease both",
              }}>
                Campus Recruitment · 2025
              </div>
              <h1 style={{
                fontSize: 30, fontWeight: 800, color: T.ink,
                letterSpacing: "-0.8px", lineHeight: 1.15, margin: "0 0 10px",
                fontFamily: T.ff,
                animation: "cd-fade-down 0.45s 0.15s ease both",
              }}>
                {company.companyName}
              </h1>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                animation: "cd-fade-up 0.4s 0.2s ease both",
              }}>
                
                  
              </div>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14, marginBottom: 20,
        }}>
          <StatCard
            delay={0.1}
            label="Package"
            value={`${company.salary} LPA`}
            color="#1B3A6B"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
          <StatCard
            delay={0.16}
            label="Minimum CGPA"
            value={company.minimumCGPA || "N/A"}
            color="#0D9A8A"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
          />
          <StatCard
            delay={0.22}
            label="Total Offers [Last Year]"
            value={company.offers || "—"}
            color="#7C3AED"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </div>

        {/* ── BOTTOM ROW: description + skills ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* Description */}
          <div style={{
            background: T.white,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "24px 26px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            animation: "cd-fade-up 0.45s 0.28s ease both",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: T.blueLt, color: T.blue2,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: T.ink3, fontFamily: T.ff }}>
                About the Role
              </span>
            </div>
            <p style={{
              fontSize: 13.5, lineHeight: 1.75, color: T.ink2,
              fontFamily: T.ff, margin: 0,
            }}>
              {company.description || "No description provided."}
            </p>
          </div>

          {/* Required Skills */}
          <div style={{
            background: T.white,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "24px 26px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            animation: "cd-fade-up 0.45s 0.34s ease both",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "#F3E8FF", color: "#7C3AED",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: T.ink3, fontFamily: T.ff }}>
                Required Skills
              </span>
            </div>

            {company.requiredSkills?.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {company.requiredSkills.map((skill, i) => (
                  <SkillTag key={i} skill={skill} index={i} />
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: T.ink3, fontFamily: T.ff, margin: 0 }}>
                No specific skills listed.
              </p>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default CompanyDetails;