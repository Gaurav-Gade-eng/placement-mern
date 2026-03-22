import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api";

/* ── inject styles once ── */
if (!document.getElementById("resume-styles")) {
  const s = document.createElement("style");
  s.id = "resume-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes rsSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes rsPopIn {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes rsFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes rsPulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.5; }
    }
    @keyframes rsSpin {
      to { transform: rotate(360deg); }
    }
    @keyframes rsBarFill {
      from { width: 0%; }
      to   { width: 100%; }
    }
    @keyframes rsCheckPop {
      0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
      60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    .rs-root {
      display: flex; min-height: 100vh;
      background: #F4F6F9;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .rs-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .rs-body {
      flex: 1; padding: 36px 40px; overflow-y: auto;
      display: flex; flex-direction: column;
    }

    /* ── Page header ── */
    .rs-header {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: 28px;
      animation: rsSlideUp 0.5s ease both;
    }
    .rs-eyebrow {
      font-size: 10px; font-weight: 700; letter-spacing: 3px;
      text-transform: uppercase; color: #3B7DED; margin-bottom: 6px;
    }
    .rs-title {
      font-size: 26px; font-weight: 800; color: #0D1C33;
      letter-spacing: -0.5px; line-height: 1.1;
    }
    .rs-subtitle {
      font-size: 13px; color: #7A8599; margin-top: 4px; font-weight: 400;
    }

    /* ── Layout grid ── */
    .rs-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
      animation: rsSlideUp 0.55s 0.08s ease both;
    }
    @media (max-width: 900px) {
      .rs-grid { grid-template-columns: 1fr; }
    }

    /* ── Cards ── */
    .rs-card {
      background: #fff;
      border: 1px solid #E2E4E9;
      border-radius: 16px;
      overflow: hidden;
    }
    .rs-card-head {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #F0F2F6;
      display: flex; align-items: center; gap: 10px;
    }
    .rs-card-icon {
      width: 34px; height: 34px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .rs-card-title {
      font-size: 14px; font-weight: 700; color: #0D1C33; letter-spacing: -0.2px;
    }
    .rs-card-sub {
      font-size: 11.5px; color: #7A8599; margin-top: 1px;
    }
    .rs-card-body { padding: 24px; }

    /* ── Dropzone ── */
    .rs-drop {
      border: 2px dashed #D4DCE8;
      border-radius: 12px;
      padding: 44px 24px;
      text-align: center;
      cursor: pointer;
      background: #FAFBFC;
      transition: border-color 0.2s, background 0.2s, transform 0.2s;
      position: relative;
    }
    .rs-drop:hover {
      border-color: #3B7DED;
      background: #F4F8FF;
    }
    .rs-drop.active {
      border-color: #3B7DED;
      background: #EBF2FD;
      transform: scale(1.01);
    }
    .rs-drop-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: #EBF2FD; border: 1px solid #C2D6FA;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      transition: background 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .rs-drop:hover .rs-drop-icon,
    .rs-drop.active .rs-drop-icon {
      background: #3B7DED;
      transform: translateY(-4px);
    }
    .rs-drop:hover .rs-drop-icon svg,
    .rs-drop.active .rs-drop-icon svg { stroke: #fff; }

    .rs-drop-title {
      font-size: 14px; font-weight: 700; color: #0D1C33; margin-bottom: 4px;
    }
    .rs-drop-sub {
      font-size: 12px; color: #7A8599; line-height: 1.6;
    }
    .rs-drop-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: #F0F2F6; border: 1px solid #E2E4E9;
      border-radius: 6px; padding: 3px 10px;
      font-size: 11px; font-weight: 600; color: #7A8599;
      margin-top: 12px; letter-spacing: 0.3px;
    }

    /* ── File preview ── */
    .rs-file {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px;
      background: #F8FAFC; border: 1px solid #E8EDF3;
      border-radius: 10px; margin-top: 16px;
      animation: rsPopIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .rs-file-icon {
      width: 40px; height: 40px; border-radius: 9px;
      background: #FEF2F2; border: 1px solid #FECACA;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .rs-file-name {
      font-size: 13px; font-weight: 600; color: #0D1C33;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      max-width: 220px;
    }
    .rs-file-meta {
      font-size: 11px; color: #7A8599; margin-top: 2px;
    }
    .rs-file-remove {
      background: none; border: none; cursor: pointer;
      color: #B0BAC8; padding: 4px; border-radius: 6px;
      display: flex; align-items: center; margin-left: auto;
      transition: color 0.15s, background 0.15s;
    }
    .rs-file-remove:hover { color: #DC2626; background: #FEF2F2; }

    /* ── Progress bar ── */
    .rs-progress-wrap {
      margin-top: 16px;
      animation: rsFadeIn 0.3s ease both;
    }
    .rs-progress-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 7px;
    }
    .rs-progress-label { font-size: 11.5px; font-weight: 600; color: #7A8599; }
    .rs-progress-pct   { font-size: 11.5px; font-weight: 700; color: #3B7DED; }
    .rs-progress-track {
      height: 6px; background: #EEF0F4; border-radius: 10px; overflow: hidden;
    }
    .rs-progress-fill {
      height: 100%; border-radius: 10px;
      background: linear-gradient(90deg, #3B7DED, #60A5FA);
      animation: rsBarFill 2s cubic-bezier(0.4,0,0.2,1) both;
    }

    /* ── Status banners ── */
    .rs-status {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px; border-radius: 10px; margin-top: 16px;
      font-size: 12.5px; font-weight: 500; line-height: 1.5;
      animation: rsPopIn 0.3s ease both;
    }
    .rs-status.error   { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }
    .rs-status.success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #16A34A; }

    /* ── Submit button ── */
    .rs-btn {
      width: 100%; height: 48px; border: none; border-radius: 10px;
      margin-top: 20px; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px; font-weight: 700; color: #fff;
      background: linear-gradient(135deg, #1B3A6B 0%, #2563EB 100%);
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 4px 16px rgba(27,58,107,0.22);
      transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
      position: relative; overflow: hidden;
    }
    .rs-btn::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
      transform: translateX(-100%); transition: transform 0.5s;
    }
    .rs-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,58,107,0.3); }
    .rs-btn:hover:not(:disabled)::before { transform: translateX(100%); }
    .rs-btn:active:not(:disabled) { transform: translateY(0); }
    .rs-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .rs-spinner {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.35);
      border-top-color: #fff; animation: rsSpin 0.7s linear infinite;
    }

    /* ── Right sidebar cards ── */
    .rs-tip-list { display: flex; flex-direction: column; gap: 12px; padding: 20px 24px; }
    .rs-tip {
      display: flex; gap: 12px; align-items: flex-start;
    }
    .rs-tip-num {
      width: 22px; height: 22px; border-radius: 6px;
      background: #EBF2FD; border: 1px solid #C2D6FA;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; color: #3B7DED; flex-shrink: 0; margin-top: 1px;
    }
    .rs-tip-text { font-size: 12.5px; color: #4A5568; line-height: 1.6; }
    .rs-tip-bold { font-weight: 700; color: #0D1C33; }

    .rs-req-list { display: flex; flex-direction: column; gap: 8px; padding: 16px 24px 20px; }
    .rs-req-row {
      display: flex; align-items: center; gap: 10px;
      font-size: 12.5px; color: #4A5568;
    }
    .rs-req-dot {
      width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    }

    /* ── Success overlay ── */
    .rs-success-card {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; padding: 48px 32px;
      animation: rsPopIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
    }
    .rs-success-ring {
      width: 72px; height: 72px; border-radius: 50%;
      background: #F0FDF4; border: 2px solid #BBF7D0;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
    }
    .rs-success-check {
      animation: rsCheckPop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
    }
  `;
  document.head.appendChild(s);
}

const T = {
  navy: "#1B3A6B",
  blue: "#3B7DED",
  ink:  "#0D1C33",
  ink3: "#7A8599",
  border: "#E2E4E9",
};

/* ── format bytes ── */
const fmtSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

function Resume() {
  const [file, setFile]           = useState(null);
  const [status, setStatus]       = useState("idle"); // idle | uploading | success | error
  const [errorMsg, setErrorMsg]   = useState("");

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setStatus("idle");
      setErrorMsg("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const uploadResume = async () => {
    if (!file) { setErrorMsg("Please select a PDF file first."); setStatus("error"); return; }
    setStatus("uploading");
    setErrorMsg("");
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem("user") || '{"_id":"guest"}');
    formData.append("resume", file);
    formData.append("userId", user._id);
    try {
      await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
      setFile(null);
    } catch (err) {
      console.error(err.response?.data);
      setErrorMsg("Upload failed. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="rs-root">
      <Sidebar />
      <div className="rs-main">
        <Navbar />
        <div className="rs-body">

          {/* ── Page header ── */}
          <div className="rs-header">
            <div>
              <div className="rs-eyebrow">Document Centre</div>
              <h1 className="rs-title">Upload Resume</h1>
              <p className="rs-subtitle">Upload your latest PDF resume for placement consideration.</p>
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="rs-grid">

            {/* ── LEFT: upload card ── */}
            <div className="rs-card">
              <div className="rs-card-head">
                <div className="rs-card-icon" style={{ background: "#EBF2FD", border: "1px solid #C2D6FA" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <div className="rs-card-title">Resume Upload</div>
                  <div className="rs-card-sub">Accepted format: PDF only · Max 5 MB</div>
                </div>
              </div>

              {status === "success" ? (
                /* ── Success state ── */
                <div className="rs-success-card">
                  <div className="rs-success-ring">
                    <div className="rs-success-check">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                        stroke="#16A34A" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 8 }}>
                    Resume Uploaded!
                  </h3>
                  <p style={{ fontSize: 13, color: T.ink3, lineHeight: 1.7, maxWidth: 300, marginBottom: 24 }}>
                    Your resume has been submitted successfully.
                  </p>
                  <button
                    className="rs-btn"
                    style={{ maxWidth: 220, margin: 0 }}
                    onClick={() => setStatus("idle")}
                  >
                    Upload Another
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="rs-card-body">

                  {/* Dropzone */}
                  <div
                    {...getRootProps()}
                    className={`rs-drop${isDragActive ? " active" : ""}`}
                  >
                    <input {...getInputProps()} />
                    <div className="rs-drop-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke={T.blue} strokeWidth="2.2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    {isDragActive ? (
                      <p className="rs-drop-title" style={{ color: T.blue }}>Drop it here…</p>
                    ) : (
                      <>
                        <p className="rs-drop-title">Drag & drop your resume</p>
                        <p className="rs-drop-sub">or click to browse files from your computer</p>
                        <span className="rs-drop-badge">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          PDF only
                        </span>
                      </>
                    )}
                  </div>

                  {/* File preview */}
                  {file && (
                    <div className="rs-file">
                      <div className="rs-file-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="#DC2626" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="rs-file-name">{file.name}</div>
                        <div className="rs-file-meta">{fmtSize(file.size)} · PDF Document</div>
                      </div>
                      <button className="rs-file-remove" onClick={removeFile} aria-label="Remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Upload progress */}
                  {status === "uploading" && (
                    <div className="rs-progress-wrap">
                      <div className="rs-progress-row">
                        <span className="rs-progress-label">Uploading…</span>
                        <span className="rs-progress-pct">In progress</span>
                      </div>
                      <div className="rs-progress-track">
                        <div className="rs-progress-fill" />
                      </div>
                    </div>
                  )}

                  {/* Error banner */}
                  {status === "error" && errorMsg && (
                    <div className="rs-status error">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    className="rs-btn"
                    onClick={uploadResume}
                    disabled={!file || status === "uploading"}
                  >
                    {status === "uploading" ? (
                      <><div className="rs-spinner"/> Uploading…</>
                    ) : (
                      <>
                        Upload Resume
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.3">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </>
                    )}
                  </button>

                </div>
              )}
            </div>

            {/* ── RIGHT column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Tips card */}
              <div className="rs-card">
                <div className="rs-card-head">
                  <div className="rs-card-icon" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#D97706" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div>
                    <div className="rs-card-title">Resume Tips</div>
                    <div className="rs-card-sub">Improve your chances</div>
                  </div>
                </div>
                <div className="rs-tip-list">
                  {[
                    { n: "1", bold: "Keep it concise", text: " — 1 page for students, 2 pages max." },
                    { n: "2", bold: "Use keywords", text: " that match the job description." },
                    { n: "3", bold: "Quantify achievements", text: " with numbers and metrics." },
                    { n: "4", bold: "No spelling errors", text: " — proofread before uploading." },
                  ].map(tip => (
                    <div className="rs-tip" key={tip.n}>
                      <div className="rs-tip-num">{tip.n}</div>
                      <div className="rs-tip-text">
                        <span className="rs-tip-bold">{tip.bold}</span>{tip.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements card */}
              <div className="rs-card">
                <div className="rs-card-head">
                  <div className="rs-card-icon" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#16A34A" strokeWidth="2.2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="rs-card-title">Requirements</div>
                    <div className="rs-card-sub">File specifications</div>
                  </div>
                </div>
                <div className="rs-req-list">
                  {[
                    { dot: "#3B7DED", text: "Format: PDF only" },
                    { dot: "#16A34A", text: "Max file size: 5 MB" },
                    { dot: "#D97706", text: "Must be selectable text (not scanned)" },
                    { dot: "#7C3AED", text: "Latest version — updated within 6 months" },
                    { dot: "#0D9A8A", text: "Include contact info & LinkedIn URL" },
                  ].map((r, i) => (
                    <div className="rs-req-row" key={i}>
                      <div className="rs-req-dot" style={{ background: r.dot }} />
                      {r.text}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;