import { useState } from "react";
import API from "../api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    background: #F4F6F9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  /* soft background blobs */
  .lg-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .lg-blob-1 {
    width: 560px; height: 560px;
    top: -200px; left: -180px;
    background: radial-gradient(circle, rgba(59,125,237,0.08) 0%, transparent 65%);
    animation: blobDrift1 10s ease-in-out infinite;
  }
  .lg-blob-2 {
    width: 460px; height: 460px;
    bottom: -160px; right: -140px;
    background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%);
    animation: blobDrift2 13s ease-in-out infinite;
  }

  @keyframes blobDrift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%     { transform: translate(24px,16px) scale(1.05); }
    70%     { transform: translate(-12px,28px) scale(0.97); }
  }
  @keyframes blobDrift2 {
    0%,100% { transform: translate(0,0); }
    50%     { transform: translate(-20px,-16px); }
  }

  /* dot grid */
  .lg-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
  }

  /* ── CARD ── */
  .lg-card {
    position: relative; z-index: 10;
    display: flex;
    width: 820px;
    min-height: 500px;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #E2E4E9;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
    animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── LEFT PANEL ── */
  .lg-left {
    width: 42%;
    background: linear-gradient(160deg, #1B3A6B 0%, #1e4080 50%, #163264 100%);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 36px;
  }

  /* animated mesh */
  .lg-left::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: meshShift 20s linear infinite;
  }
  @keyframes meshShift {
    from { background-position: 0 0; }
    to   { background-position: 40px 40px; }
  }

  /* ring */
  .lg-left::after {
    content: '';
    position: absolute;
    width: 320px; height: 320px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.08);
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    animation: ringPulse 4s ease-in-out infinite;
  }
  @keyframes ringPulse {
    0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.6; }
    50%      { transform: translate(-50%,-50%) scale(1.06); opacity: 0.2; }
  }

  /* floating shapes */
  .ls-shape { position: absolute; pointer-events: none; }
  .ls-s1 {
    width: 72px; height: 72px; border-radius: 18px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    top: 12%; left: 8%; transform: rotate(18deg);
    animation: floatA 6s ease-in-out infinite;
  }
  .ls-s2 {
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    bottom: 10%; left: 12%;
    animation: floatB 8s ease-in-out infinite;
  }
  .ls-s3 {
    width: 60px; height: 60px; border-radius: 50%;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    bottom: 28%; left: 58%;
    animation: floatC 5s ease-in-out infinite;
  }
  .ls-s4 {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    top: 38%; left: 72%; transform: rotate(-12deg);
    animation: floatA 7s 1s ease-in-out infinite;
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

  .lg-left-content {
    position: relative; z-index: 2; color: #fff;
    animation: leftIn 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes leftIn {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .lg-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
    border-radius: 20px; padding: 4px 12px 4px 8px;
    font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.75); margin-bottom: 20px;
  }
  .lg-badge-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #60CFAA;
    box-shadow: 0 0 0 3px rgba(96,207,170,0.25);
    animation: dotPulse 2s ease infinite;
  }
  @keyframes dotPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(96,207,170,0.25); }
    50%      { box-shadow: 0 0 0 6px rgba(96,207,170,0.08); }
  }

  .lg-left-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 34px; font-weight: 700; line-height: 1.15;
    letter-spacing: -0.5px; color: #fff; margin-bottom: 6px;
  }

  .lg-left-sub {
    font-size: 10.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.4); margin-bottom: 18px;
  }

  .lg-left-line {
    width: 32px; height: 2px; margin-bottom: 18px;
    background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1));
    border-radius: 2px;
  }

  .lg-left-body {
    font-size: 12.5px; line-height: 1.8; color: rgba(255,255,255,0.5);
    max-width: 220px; font-weight: 400;
  }

  /* ── RIGHT PANEL ── */
  .lg-right {
    flex: 1;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 44px;
    position: relative;
  }

  .lg-right-head {
    margin-bottom: 28px;
    animation: rightIn 0.8s 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes rightIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .lg-right-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: #B0BAC8; margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .lg-right-label::before { content: ''; width: 16px; height: 1px; background: #D1D9E0; }

  .lg-right-title {
    font-size: 26px; font-weight: 700; color: #0D1C33;
    letter-spacing: -0.5px; line-height: 1.1;
  }

  /* fields */
  .lg-field {
    display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;
    animation: fieldIn 0.55s ease both;
  }
  .lg-field:nth-child(1) { animation-delay: 0.4s; }
  .lg-field:nth-child(2) { animation-delay: 0.5s; }
  .lg-field:nth-child(3) { animation-delay: 0.6s; }

  @keyframes fieldIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lg-field-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: #7A8599;
  }

  .lg-input-wrap {
    position: relative; display: flex; align-items: center;
    background: #F4F6F9;
    border: 1px solid #E2E4E9;
    border-radius: 9px; height: 46px; padding: 0 14px;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }
  .lg-input-wrap:focus-within {
    border-color: #3B7DED;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59,125,237,0.1);
  }

  .lg-input-icon {
    margin-right: 10px; display: flex; align-items: center;
    color: #C0C8D5; flex-shrink: 0;
    transition: color 0.18s;
  }
  .lg-input-wrap:focus-within .lg-input-icon { color: #3B7DED; }

  .lg-input {
    flex: 1; border: none; background: transparent; outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 400; color: #0D1C33;
  }
  .lg-input::placeholder { color: #C0C8D5; }
  .lg-input:-webkit-autofill,
  .lg-input:-webkit-autofill:hover,
  .lg-input:-webkit-autofill:focus,
  .lg-input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 100px #F4F6F9 inset !important;
    -webkit-text-fill-color: #0D1C33 !important;
    caret-color: #0D1C33;
    transition: background-color 9999s ease-in-out 0s;
  }

  .lg-show-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    color: #B0BAC8; transition: color 0.15s;
  }
  .lg-show-btn:hover { color: #3B7DED; }

  /* row */
  .lg-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px;
    animation: fieldIn 0.55s 0.65s ease both;
    animation-fill-mode: both; opacity: 0;
  }

  .lg-check-label {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; font-weight: 400; color: #7A8599; cursor: pointer;
  }
  .lg-check-label input[type="checkbox"] {
    width: 14px; height: 14px; accent-color: #3B7DED; cursor: pointer;
  }

  .lg-forgot {
    font-size: 12px; color: #3B7DED; font-weight: 500; text-decoration: none;
    transition: color 0.15s;
  }
  .lg-forgot:hover { color: #1B3A6B; }

  /* submit */
  .lg-submit {
    width: 100%; height: 48px; border: none; border-radius: 9px; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 700; letter-spacing: 0.3px;
    color: #fff;
    background: #1B3A6B;
    position: relative; overflow: hidden;
    transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 4px 16px rgba(27,58,107,0.22);
    animation: fieldIn 0.55s 0.75s ease both;
    animation-fill-mode: both; opacity: 0;
  }
  .lg-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .lg-submit:hover {
    background: #2254A8;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(27,58,107,0.32);
  }
  .lg-submit:hover::before { transform: translateX(100%); }
  .lg-submit:active { transform: translateY(0); }

  .lg-submit-inner {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; z-index: 1;
  }

  /* shake */
  .lg-shake { animation: shake 0.4s ease both; }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-7px); }
    40%      { transform: translateX(7px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }

  /* error */
  .lg-error {
    display: flex; align-items: center; gap: 8px;
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;
    font-size: 12.5px; color: #DC2626; font-weight: 500;
    animation: fieldIn 0.3s ease both;
  }

  /* spinner */
  .lg-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(true);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [shake, setShake]               = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const login = async () => {

if (!email || !password) {
  setError("Please enter your username and password.");
  triggerShake();
  return;
}

setLoading(true);
setError("");

try {

const res = await API.post(
  "/auth/login",
  { email, password }
);

const user = res.data.user;

// ❌ Block admins
if(user.role !== "student"){
  setError("This login is only for students.");
  triggerShake();
  setLoading(false);
  return;
}

localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(user));

// ✅ Only students reach here
window.location.href = "/#/dashboard";

}
catch (err) {
setError("Invalid credentials. Please try again.");
triggerShake();
}

finally {
setLoading(false);
}

};
  const handleKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <>
      <style>{css}</style>
      <div className="lg-root">
        <div className="lg-blob lg-blob-1" />
        <div className="lg-blob lg-blob-2" />
        <div className="lg-grid" />

        <div className="lg-card">

          {/* LEFT */}
          <div className="lg-left">
            <div className="ls-shape ls-s1" />
            <div className="ls-shape ls-s2" />
            <div className="ls-shape ls-s3" />
            <div className="ls-shape ls-s4" />
            <div className="lg-left-content">
              <div className="lg-badge">
                <span className="lg-badge-dot" />
                Placement Portal
              </div>
              <h1 className="lg-left-title">Welcome<br />Back</h1>
              <p className="lg-left-sub">Placement Gateway</p>
              <div className="lg-left-line" />
              <p className="lg-left-body">
                Your gateway to successful career opportunities. Access resources, track applications, and connect with top companies.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg-right">
            <div className="lg-right-head">
              <div className="lg-right-label">Student Access</div>
              <h2 className="lg-right-title">Sign in to continue</h2>
            </div>

            {error && (
              <div className="lg-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Username */}
            <div className={`lg-field ${shake ? "lg-shake" : ""}`}>
              <label className="lg-field-label">Username</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  className="lg-input"
                  placeholder="Enter your username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className={`lg-field ${shake ? "lg-shake" : ""}`}>
              <label className="lg-field-label">Password</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="lg-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                />
                <button className="lg-show-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="lg-row">
              <label className="lg-check-label">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                Remember me
              </label>
              <a href="/forgot-password" className="lg-forgot">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button className="lg-submit" onClick={login} disabled={loading}>
              <div className="lg-submit-inner">
                {loading ? (
                  <><div className="lg-spinner" /> Signing in…</>
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
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;