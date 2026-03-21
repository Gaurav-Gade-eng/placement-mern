import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ── inject styles once ── */
if (!document.getElementById("al-styles")) {
  const s = document.createElement("style");
  s.id = "al-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes blobDrift1 {
      0%,100% { transform: translate(0,0) scale(1); }
      40%     { transform: translate(24px,16px) scale(1.05); }
      70%     { transform: translate(-12px,28px) scale(0.97); }
    }
    @keyframes blobDrift2 {
      0%,100% { transform: translate(0,0); }
      50%     { transform: translate(-20px,-16px); }
    }
    @keyframes meshShift {
      from { background-position: 0 0; }
      to   { background-position: 40px 40px; }
    }
    @keyframes ringPulse {
      0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.6; }
      50%      { transform: translate(-50%,-50%) scale(1.06); opacity: 0.2; }
    }
    @keyframes floatA {
      0%,100% { transform: rotate(18deg) translateY(0); }
      50%      { transform: rotate(18deg) translateY(-10px); }
    }
    @keyframes floatB {
      0%,100% { transform: translateY(0) scale(1); }
      50%      { transform: translateY(-12px) scale(1.04); }
    }
    @keyframes floatC {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-8px); }
    }
    @keyframes dotPulse {
      0%,100% { box-shadow: 0 0 0 3px rgba(96,207,170,0.25); }
      50%      { box-shadow: 0 0 0 6px rgba(96,207,170,0.08); }
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(32px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes leftIn {
      from { opacity: 0; transform: translateX(-18px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes rightIn {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fieldIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-7px); }
      40%      { transform: translateX(7px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .al-shake { animation: shake 0.4s ease both; }
  `;
  document.head.appendChild(s);
}

const T = {
  ff:    "'Plus Jakarta Sans', sans-serif",
  navy:  "#1B3A6B",
  blue:  "#3B7DED",
  ink:   "#0D1C33",
  ink3:  "#7A8599",
  ink4:  "#B0BAC8",
  border:"#E2E4E9",
  bg:    "#F4F6F9",
};

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [shake, setShake]               = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const login = async () => {

  if (!email || !password) {
    setError("Please enter your email and password.");
    triggerShake();
    return;
  }

  setLoading(true);
  setError("");

  try {

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    const user = res.data.user;

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "tpo") {
      navigate("/tpo-dashboard");
    } else {
      setError("Access denied. Only TPO can login here.");
      triggerShake();
    }

  } catch (err) {
    setError("Invalid credentials. Please try again.");
    triggerShake();
  } finally {
    setLoading(false);
  }
};

  const handleKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: T.ff,
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* blobs */}
      <div style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: 560, height: 560, top: -200, left: -180,
        background: "radial-gradient(circle, rgba(59,125,237,0.08) 0%, transparent 65%)",
        animation: "blobDrift1 10s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: 460, height: 460, bottom: -160, right: -140,
        background: "radial-gradient(circle, rgba(180,83,9,0.07) 0%, transparent 65%)",
        animation: "blobDrift2 13s ease-in-out infinite",
      }} />
      {/* dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
      }} />

      {/* ── CARD ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex",
        width: 820, minHeight: 500,
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${T.border}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        animation: "cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both",
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: "42%",
          background: "linear-gradient(160deg, #1B3A6B 0%, #163264 50%, #0F2347 100%)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 36px",
        }}>
          {/* mesh grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "meshShift 20s linear infinite",
          }} />
          {/* ring */}
          <div style={{
            position: "absolute",
            width: 320, height: 320, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "ringPulse 4s ease-in-out infinite",
          }} />
          {/* floating shapes */}
          {[
            { w:72,  h:72,  br:18, top:"12%",  left:"8%",   anim:"floatA 6s ease-in-out infinite",   rot:"rotate(18deg)" },
            { w:120, h:120, br:60, bottom:"10%",left:"12%",  anim:"floatB 8s ease-in-out infinite",   rot:"" },
            { w:60,  h:60,  br:30, bottom:"28%",left:"58%",  anim:"floatC 5s ease-in-out infinite",   rot:"" },
            { w:44,  h:44,  br:12, top:"38%",  left:"72%",  anim:"floatA 7s 1s ease-in-out infinite", rot:"rotate(-12deg)" },
          ].map((sh, i) => (
            <div key={i} style={{
              position: "absolute", pointerEvents: "none",
              width: sh.w, height: sh.h, borderRadius: sh.br,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              top: sh.top, left: sh.left, bottom: sh.bottom,
              transform: sh.rot,
              animation: sh.anim,
            }} />
          ))}

          {/* left content */}
          <div style={{
            position: "relative", zIndex: 2, color: "#fff",
            animation: "leftIn 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            {/* badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 20, padding: "4px 12px 4px 8px",
              fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)", marginBottom: 20,
              fontFamily: T.ff,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%", background: "#F59E0B",
                boxShadow: "0 0 0 3px rgba(245,158,11,0.25)",
                animation: "dotPulse 2s ease infinite",
              }} />
              Admin Access
            </div>

            <h1 style={{
              fontFamily: T.ff,
              fontSize: 34, fontWeight: 700, lineHeight: 1.15,
              letterSpacing: "-0.5px", color: "#fff", marginBottom: 6,
            }}>
              Admin<br />Portal
            </h1>
            <p style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
              marginBottom: 18, fontFamily: T.ff,
            }}>
              Restricted Access
            </p>
            <div style={{
              width: 32, height: 2, marginBottom: 18,
              background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))",
              borderRadius: 2,
            }} />
            <p style={{
              fontSize: 12.5, lineHeight: 1.8, color: "rgba(255,255,255,0.5)",
              maxWidth: 220, fontWeight: 400, fontFamily: T.ff,
            }}>
              Authorised personnel only. Manage students, companies, placements, and announcements.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          flex: 1, background: "#FFFFFF",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "48px 44px", position: "relative",
        }}>
          {/* head */}
          <div style={{
            marginBottom: 28,
            animation: "rightIn 0.8s 0.3s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: T.ink4, marginBottom: 8,
              display: "flex", alignItems: "center", gap: 8, fontFamily: T.ff,
            }}>
              <span style={{ width: 16, height: 1, background: "#D1D9E0", display: "inline-block" }} />
              Administrator Access
            </div>
            <h2 style={{
              fontSize: 26, fontWeight: 700, color: T.ink,
              letterSpacing: "-0.5px", lineHeight: 1.1, fontFamily: T.ff,
            }}>
              Sign in to continue
            </h2>
          </div>

          {/* error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 8, padding: "10px 14px", marginBottom: 14,
              fontSize: 12.5, color: "#DC2626", fontWeight: 500,
              fontFamily: T.ff,
              animation: "fieldIn 0.3s ease both",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Email field */}
          <Field label="Email" delay="0.4s" shake={shake}>
            <InputWrap>
              <InputIcon>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </InputIcon>
              <input
                style={inputStyle}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="username"
              />
            </InputWrap>
          </Field>

          {/* Password field */}
          <Field label="Password" delay="0.5s" shake={shake}>
            <InputWrap>
              <InputIcon>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </InputIcon>
              <input
                type={showPassword ? "text" : "password"}
                style={inputStyle}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="current-password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: T.ff, fontSize: 10, fontWeight: 700,
                  letterSpacing: "1px", textTransform: "uppercase", color: T.ink4,
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.target.style.color = T.blue}
                onMouseLeave={e => e.target.style.color = T.ink4}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </InputWrap>
          </Field>

          {/* Submit */}
          <SubmitButton loading={loading} onClick={login} />
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function Field({ label, delay, shake, children }) {
  return (
    <div
      className={shake ? "al-shake" : ""}
      style={{
        display: "flex", flexDirection: "column", gap: 6,
        marginBottom: 14,
        opacity: 0,
        animation: `fieldIn 0.55s ${delay} ease both`,
        animationFillMode: "both",
      }}
    >
      <label style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
        textTransform: "uppercase", color: "#7A8599",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InputWrap({ children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: "relative", display: "flex", alignItems: "center",
        background: focused ? "#fff" : "#F4F6F9",
        border: `1px solid ${focused ? "#3B7DED" : "#E2E4E9"}`,
        borderRadius: 9, height: 46, padding: "0 14px",
        boxShadow: focused ? "0 0 0 3px rgba(59,125,237,0.1)" : "none",
        transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s",
      }}
    >
      {children}
    </div>
  );
}

function InputIcon({ children }) {
  return (
    <span style={{
      marginRight: 10, display: "flex", alignItems: "center",
      color: "#C0C8D5", flexShrink: 0,
    }}>
      {children}
    </span>
  );
}

const inputStyle = {
  flex: 1, border: "none", background: "transparent", outline: "none",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 13.5, fontWeight: 400, color: "#0D1C33",
};

function SubmitButton({ loading, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", height: 48, border: "none", borderRadius: 9, cursor: "pointer",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13.5, fontWeight: 700, letterSpacing: "0.3px", color: "#fff",
        background: hover
          ? "linear-gradient(135deg, #2254A8 0%, #1B3A6B 100%)"
          : "linear-gradient(135deg, #1B3A6B 0%, #163264 100%)",
        position: "relative", overflow: "hidden",
        boxShadow: hover
          ? "0 10px 28px rgba(27,58,107,0.32)"
          : "0 4px 16px rgba(27,58,107,0.22)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.18s, box-shadow 0.2s, background 0.2s",
        opacity: 0,
        animation: "fieldIn 0.55s 0.6s ease both",
        animationFillMode: "both",
        marginTop: 8,
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, position: "relative", zIndex: 1,
      }}>
        {loading ? (
          <>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "#fff",
              animation: "spin 0.7s linear infinite",
            }} />
            Signing in…
          </>
        ) : (
          <>
            Sign In
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </>
        )}
      </div>
    </button>
  );
}

export default AdminLogin;