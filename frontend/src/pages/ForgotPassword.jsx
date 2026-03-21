import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fp-root {
    min-height: 100vh;
    background: #F4F6F9;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 24px;
    position: relative; overflow: hidden;
  }

  .fp-blob {
    position: absolute; border-radius: 50%; pointer-events: none;
  }
  .fp-blob-1 {
    width: 560px; height: 560px; top: -200px; left: -180px;
    background: radial-gradient(circle, rgba(59,125,237,0.08) 0%, transparent 65%);
    animation: blobDrift1 10s ease-in-out infinite;
  }
  .fp-blob-2 {
    width: 460px; height: 460px; bottom: -160px; right: -140px;
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

  .fp-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
  }

  /* ── CARD ── */
  .fp-card {
    position: relative; z-index: 10;
    display: flex;
    width: 820px; min-height: 500px;
    border-radius: 20px; overflow: hidden;
    border: 1px solid #E2E4E9;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
    animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── LEFT ── */
  .fp-left {
    width: 42%;
    background: linear-gradient(160deg, #1B3A6B 0%, #1e4080 50%, #163264 100%);
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 36px;
  }
  .fp-left::before {
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
  .fp-left::after {
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

  .fp-shape { position: absolute; pointer-events: none; }
  .fp-s1 {
    width: 72px; height: 72px; border-radius: 18px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    top: 12%; left: 8%; transform: rotate(18deg);
    animation: floatA 6s ease-in-out infinite;
  }
  .fp-s2 {
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    bottom: 10%; left: 12%; animation: floatB 8s ease-in-out infinite;
  }
  .fp-s3 {
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

  .fp-left-content {
    position: relative; z-index: 2; color: #fff;
    animation: leftIn 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes leftIn {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .fp-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
    border-radius: 20px; padding: 4px 12px 4px 8px;
    font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.75); margin-bottom: 20px;
  }
  .fp-badge-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #60CFAA;
    box-shadow: 0 0 0 3px rgba(96,207,170,0.25);
    animation: dotPulse 2s ease infinite;
  }
  @keyframes dotPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(96,207,170,0.25); }
    50%      { box-shadow: 0 0 0 6px rgba(96,207,170,0.08); }
  }

  .fp-left-title {
    font-size: 34px; font-weight: 700; line-height: 1.15;
    letter-spacing: -0.5px; color: #fff; margin-bottom: 6px;
  }
  .fp-left-sub {
    font-size: 10.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.4); margin-bottom: 18px;
  }
  .fp-left-line {
    width: 32px; height: 2px; margin-bottom: 18px;
    background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1));
    border-radius: 2px;
  }
  .fp-left-body {
    font-size: 12.5px; line-height: 1.8; color: rgba(255,255,255,0.5);
    max-width: 220px; font-weight: 400;
  }

  /* ── RIGHT ── */
  .fp-right {
    flex: 1; background: #FFFFFF;
    display: flex; flex-direction: column; justify-content: center;
    padding: 32px 36px; position: relative;
    overflow-y: auto;
  }

  .fp-right-head {
    margin-bottom: 16px;
    animation: rightIn 0.8s 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes rightIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .fp-right-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: #B0BAC8; margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .fp-right-label::before { content: ''; width: 16px; height: 1px; background: #D1D9E0; }
  .fp-right-title {
    font-size: 22px; font-weight: 700; color: #0D1C33;
    letter-spacing: -0.5px; line-height: 1.1;
  }
  .fp-right-sub {
    font-size: 12px; color: #7A8599; margin-top: 4px; line-height: 1.6;
  }

  /* step indicator */
  .fp-steps {
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 16px;
    animation: fieldIn 0.5s 0.35s ease both;
  }
  .fp-step-dot {
    height: 4px; border-radius: 4px;
    transition: width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s;
  }

  /* fields */
  .fp-field {
    display: flex; flex-direction: column; gap: 5px; margin-bottom: 11px;
    animation: fieldIn 0.55s ease both;
  }
  @keyframes fieldIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fp-field-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: #7A8599;
  }
  .fp-input-wrap {
    position: relative; display: flex; align-items: center;
    background: #F4F6F9; border: 1px solid #E2E4E9;
    border-radius: 9px; height: 44px; padding: 0 14px;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }
  .fp-input-wrap:focus-within {
    border-color: #3B7DED; background: #fff;
    box-shadow: 0 0 0 3px rgba(59,125,237,0.1);
  }
  .fp-input-icon {
    margin-right: 10px; display: flex; align-items: center;
    color: #C0C8D5; flex-shrink: 0; transition: color 0.18s;
  }
  .fp-input-wrap:focus-within .fp-input-icon { color: #3B7DED; }
  .fp-input {
    flex: 1; border: none; background: transparent; outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 400; color: #0D1C33;
  }
  .fp-input::placeholder { color: #C0C8D5; }
  .fp-show-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    color: #B0BAC8; transition: color 0.15s;
  }
  .fp-show-btn:hover { color: #3B7DED; }

  /* OTP boxes */
  .fp-otp-wrap {
    display: flex; gap: 7px; margin-bottom: 10px;
    animation: fieldIn 0.55s 0.45s ease both;
    width: 100%;
  }
  .fp-otp-box {
    flex: 1; min-width: 0; height: 48px; border-radius: 10px;
    border: 1px solid #E2E4E9; background: #F4F6F9;
    text-align: center; font-size: 18px; font-weight: 700;
    color: #0D1C33; outline: none; width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    caret-color: #3B7DED;
  }
  .fp-otp-box:focus {
    border-color: #3B7DED; background: #fff;
    box-shadow: 0 0 0 3px rgba(59,125,237,0.1);
  }

  /* resend */
  .fp-resend {
    font-size: 12px; color: #7A8599; margin-bottom: 12px;
    animation: fieldIn 0.5s 0.5s ease both;
  }
  .fp-resend a {
    color: #3B7DED; font-weight: 600; text-decoration: none; cursor: pointer;
  }
  .fp-resend a:hover { color: #1B3A6B; }

  /* submit */
  .fp-submit {
    width: 100%; height: 46px; border: none; border-radius: 9px; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 700; letter-spacing: 0.3px;
    color: #fff; background: #1B3A6B;
    position: relative; overflow: hidden;
    transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 4px 16px rgba(27,58,107,0.22);
    animation: fieldIn 0.55s 0.65s ease both;
    animation-fill-mode: both; opacity: 0;
  }
  .fp-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%); transition: transform 0.5s ease;
  }
  .fp-submit:hover { background: #2254A8; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(27,58,107,0.32); }
  .fp-submit:hover::before { transform: translateX(100%); }
  .fp-submit:active { transform: translateY(0); }
  .fp-submit-inner {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; z-index: 1;
  }

  /* back link */
  .fp-back {
    display: flex; align-items: center; gap: 6px; margin-top: 12px;
    font-size: 12px; color: #7A8599; text-decoration: none;
    animation: fieldIn 0.5s 0.75s ease both;
    transition: color 0.15s; justify-content: center;
  }
  .fp-back:hover { color: #3B7DED; }

  /* error / success */
  .fp-error {
    display: flex; align-items: center; gap: 8px;
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 8px 12px; margin-bottom: 10px;
    font-size: 12.5px; color: #DC2626; font-weight: 500;
    animation: fieldIn 0.3s ease both;
  }
  .fp-success {
    display: flex; align-items: center; gap: 8px;
    background: #F0FDF4; border: 1px solid #BBF7D0;
    border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;
    font-size: 12.5px; color: #16A34A; font-weight: 500;
    animation: fieldIn 0.3s ease both;
  }

  /* shake */
  .fp-shake { animation: shake 0.4s ease both; }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-7px); }
    40% { transform: translateX(7px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  /* spinner */
  .fp-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* success screen */
  .fp-success-screen {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; text-align: center;
    animation: rightIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }
  .fp-checkmark {
    width: 64px; height: 64px; border-radius: 50%;
    background: #F0FDF4; border: 2px solid #BBF7D0;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    animation: popIn 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes popIn {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
`;

const OTP_LENGTH = 6;

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep]             = useState(1); // 1=email, 2=otp+pass, 3=done
  const [email, setEmail]           = useState("");
  const [otpArr, setOtpArr]         = useState(Array(OTP_LENGTH).fill(""));
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [shake, setShake]           = useState(false);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  /* ── Step 1: send OTP ── */
  const sendOTP = async () => {
    if (!email) { setError("Please enter your email address."); triggerShake(); return; }
    setLoading(true); setError("");
    try {
      await axios.post("/auth/forgot-password", { email });
      setSuccess("OTP sent! Check your inbox.");
      setTimeout(() => { setSuccess(""); setStep(2); }, 1200);
    } catch {
      setError("Email not found. Please try again.");
      triggerShake();
    } finally { setLoading(false); }
  };

  /* ── OTP input handling ── */
  const inputRefs = Array.from({ length: OTP_LENGTH }, () => null);
  const handleOtp = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpArr];
    next[idx] = val;
    setOtpArr(next);
    if (val && idx < OTP_LENGTH - 1) inputRefs[idx + 1]?.focus();
  };
  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otpArr[idx] && idx > 0) inputRefs[idx - 1]?.focus();
  };

  /* ── Step 2: reset password ── */
  const resetPassword = async () => {
    const otp = otpArr.join("");
    if (otp.length < OTP_LENGTH) { setError("Please enter the complete OTP."); triggerShake(); return; }
    if (!password) { setError("Please enter a new password."); triggerShake(); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); triggerShake(); return; }
    setLoading(true); setError("");
    try {
      await axios.post("/auth/reset-password", { email, otp, password });
      setStep(3);
    } catch {
      setError("Invalid or expired OTP. Please try again.");
      triggerShake();
    } finally { setLoading(false); }
  };

  const handleKey = (e, fn) => { if (e.key === "Enter") fn(); };

  /* ── Step indicator ── */
  const StepBar = () => (
    <div className="fp-steps">
      {[1, 2].map(n => (
        <div key={n} className="fp-step-dot" style={{
          width: step > n || (step === n) ? (step === n ? 28 : 14) : 10,
          background: step >= n ? "#3B7DED" : "#E2E4E9",
        }} />
      ))}
      <span style={{ fontSize: 11, color: "#B0BAC8", fontWeight: 600, marginLeft: 4 }}>
        Step {Math.min(step, 2)} of 2
      </span>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="fp-root">
        <div className="fp-blob fp-blob-1" />
        <div className="fp-blob fp-blob-2" />
        <div className="fp-grid" />

        <div className="fp-card">

          {/* ── LEFT ── */}
          <div className="fp-left">
            <div className="fp-shape fp-s1" />
            <div className="fp-shape fp-s2" />
            <div className="fp-shape fp-s3" />
            <div className="fp-left-content">
              <div className="fp-badge">
                <span className="fp-badge-dot" />
                Placement Portal
              </div>
              <h1 className="fp-left-title">
                {step === 3 ? "All Done!" : "Reset\nPassword"}
              </h1>
              <p className="fp-left-sub">
                {step === 1 ? "Account Recovery" : step === 2 ? "Verify & Reset" : "Access Restored"}
              </p>
              <div className="fp-left-line" />
              <p className="fp-left-body">
                {step === 1
                  ? "Enter your registered email and we'll send you a one-time password to regain access."
                  : step === 2
                  ? "Enter the OTP sent to your inbox and choose a strong new password."
                  : "Your password has been updated. You can now sign in with your new credentials."}
              </p>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="fp-right">

            {/* ── Step 3: success ── */}
            {step === 3 && (
              <div className="fp-success-screen">
                <div className="fp-checkmark">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="#16A34A" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1C33", marginBottom: 8 }}>
                  Password Updated!
                </h2>
                <p style={{ fontSize: 13, color: "#7A8599", lineHeight: 1.7, maxWidth: 260, marginBottom: 28 }}>
                  Your password has been reset successfully. Sign in with your new credentials.
                </p>
                <button className="fp-submit" style={{ maxWidth: 260, animation: "none", opacity: 1 }}
                  onClick={() => navigate("/login")}>
                  <div className="fp-submit-inner">
                    Go to Sign In
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.3">
                      <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </button>
              </div>
            )}

            {/* ── Step 1: email ── */}
            {step === 1 && (<>
              <div className="fp-right-head">
                <div className="fp-right-label">Account Recovery</div>
                <h2 className="fp-right-title">Forgot your password?</h2>
                <p className="fp-right-sub">
                  Enter your registered email to receive a verification code.
                </p>
              </div>

              <StepBar />

              {error   && <div className="fp-error"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
              {success && <div className="fp-success"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>{success}</div>}

              <div className={`fp-field ${shake ? "fp-shake" : ""}`} style={{ animationDelay: "0.4s" }}>
                <label className="fp-field-label">Email Address</label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    className="fp-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => handleKey(e, sendOTP)}
                    autoComplete="email"
                    type="email"
                  />
                </div>
              </div>

              <button className="fp-submit" onClick={sendOTP} disabled={loading}
                style={{ animationDelay: "0.5s" }}>
                <div className="fp-submit-inner">
                  {loading
                    ? <><div className="fp-spinner"/>Sending OTP…</>
                    : <>Send OTP <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg></>}
                </div>
              </button>

              <Link to="/login" className="fp-back">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to Sign In
              </Link>
            </>)}

            {/* ── Step 2: OTP + new password ── */}
            {step === 2 && (<>
              <div className="fp-right-head">
                <div className="fp-right-label">Verify Identity</div>
                <h2 className="fp-right-title">Enter OTP & new password</h2>
                <p className="fp-right-sub">
                  Code sent to <strong style={{ color: "#0D1C33" }}>{email}</strong>
                </p>
              </div>

              <StepBar />

              {error && <div className="fp-error"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}

              {/* OTP boxes */}
              <label className="fp-field-label" style={{ marginBottom: 8, display: "block",
                fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#7A8599" }}>
                Verification Code
              </label>
              <div className={`fp-otp-wrap ${shake ? "fp-shake" : ""}`}>
                {otpArr.map((val, idx) => (
                  <input
                    key={idx}
                    ref={el => inputRefs[idx] = el}
                    className="fp-otp-box"
                    maxLength={1}
                    value={val}
                    inputMode="numeric"
                    onChange={e => handleOtp(e.target.value, idx)}
                    onKeyDown={e => handleOtpKey(e, idx)}
                  />
                ))}
              </div>

              <p className="fp-resend">
                Didn't receive it?{" "}
                <a onClick={async () => {
                  setOtpArr(Array(OTP_LENGTH).fill(""));
                  setError(""); setLoading(true);
                  try { await axios.post("/auth/forgot-password", { email }); setSuccess("OTP resent!"); setTimeout(() => setSuccess(""), 2000); }
                  catch { setError("Could not resend. Try again."); }
                  finally { setLoading(false); }
                }}>
                  Resend OTP
                </a>
              </p>

              {/* New password */}
              <div className={`fp-field ${shake ? "fp-shake" : ""}`} style={{ animationDelay: "0.5s" }}>
                <label className="fp-field-label">New Password</label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    className="fp-input"
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => handleKey(e, resetPassword)}
                  />
                  <button className="fp-show-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="fp-submit" onClick={resetPassword} disabled={loading}
                style={{ animationDelay: "0.6s" }}>
                <div className="fp-submit-inner">
                  {loading
                    ? <><div className="fp-spinner"/>Resetting…</>
                    : <>Reset Password <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg></>}
                </div>
              </button>

              <button className="fp-back" style={{ border: "none", background: "none", cursor: "pointer" }}
                onClick={() => { setStep(1); setError(""); setOtpArr(Array(OTP_LENGTH).fill("")); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Back
              </button>
            </>)}

          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;