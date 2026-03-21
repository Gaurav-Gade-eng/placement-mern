import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --navy:      #0C1A2E;
    --navy-mid:  #142035;
    --navy-soft: #1B3A6B;
    --blue:      #3B7DED;
    --blue-lt:   #60A5FA;
    --cream:     #F8FAFB;
    --border:    #E4EBF5;
    --border-dk: #D0DCF0;
    --slate:     #7A8A9A;
    --slate-lt:  #B0BAC8;
    --white:     #FFFFFF;
    --red:       #DC2626;
    --green:     #16A34A;
    --gold:      #D97706;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  .sc-page {
    min-height:100vh; background:var(--cream);
    display:flex; font-family:'Plus Jakarta Sans',sans-serif;
    overflow:hidden;
  }

  /* ── Sidebar ── */
  .sc-sidebar {
    width:290px; min-height:100vh;
    background:linear-gradient(180deg,#0C1A2E 0%,#0F2040 100%);
    display:flex; flex-direction:column; flex-shrink:0;
    position:relative; overflow:hidden;
    border-right:1px solid rgba(255,255,255,0.06);
  }
  .sc-sidebar::before {
    content:''; position:absolute; bottom:-100px; right:-100px;
    width:280px; height:280px; border-radius:50%;
    border:50px solid rgba(59,125,237,0.07); pointer-events:none;
  }
  .sc-sidebar::after {
    content:''; position:absolute; top:-80px; left:-80px;
    width:220px; height:220px; border-radius:50%;
    border:40px solid rgba(59,125,237,0.05); pointer-events:none;
  }

  /* brand */
  .sc-brand {
    padding:28px 24px 22px; border-bottom:1px solid rgba(255,255,255,0.06);
    position:relative; z-index:1;
  }
  .sc-brand-ey {
    font-family:'DM Mono',monospace; font-size:9px; letter-spacing:3px;
    text-transform:uppercase; color:var(--blue-lt); margin-bottom:10px;
    display:flex; align-items:center; gap:8px; opacity:.8;
  }
  .sc-brand-ey::before { content:''; width:16px; height:1px; background:var(--blue-lt); opacity:.6; }
  .sc-brand-logo {
    width:48px; height:48px; border-radius:14px;
    background:linear-gradient(135deg,var(--navy-soft),var(--blue));
    display:flex; align-items:center; justify-content:center;
    margin-bottom:14px; box-shadow:0 4px 16px rgba(59,125,237,0.3);
    border:1px solid rgba(255,255,255,0.1);
  }
  .sc-brand-name { font-size:17px; font-weight:800; color:#fff; letter-spacing:-.3px; margin-bottom:4px; }
  .sc-brand-name span { color:var(--blue-lt); }
  .sc-brand-sub  { font-size:11.5px; color:rgba(176,186,200,.7); font-weight:400; line-height:1.5; }
  .sc-online {
    display:inline-flex; align-items:center; gap:6px; margin-top:14px;
    padding:5px 12px; background:rgba(22,163,74,0.1); border:1px solid rgba(22,163,74,0.2);
    border-radius:20px; font-family:'DM Mono',monospace; font-size:9px;
    font-weight:500; color:#4ADE80; letter-spacing:1px;
  }
  .sc-online-dot { width:6px; height:6px; border-radius:50%; background:#22C55E; animation:scPulse 2s ease infinite; }
  @keyframes scPulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 50%{opacity:.7;box-shadow:0 0 0 4px rgba(34,197,94,0)} }

  /* ── Back to Home — sidebar version ── */
  .sc-back-btn {
    display:flex; align-items:center; gap:9px;
    margin:14px 24px 0; padding:9px 13px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:12px; font-weight:600; color:rgba(176,186,200,0.7);
    transition:all .18s; text-align:left;
    position:relative; z-index:1;
  }
  .sc-back-btn:hover {
    background:rgba(59,125,237,0.12);
    border-color:rgba(59,125,237,0.3);
    color:#fff;
    transform:translateX(-2px);
  }
  .sc-back-btn-ico {
    width:22px; height:22px; border-radius:6px;
    background:rgba(59,125,237,0.15); border:1px solid rgba(59,125,237,0.2);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; color:var(--blue-lt); transition:background .18s;
  }
  .sc-back-btn:hover .sc-back-btn-ico { background:rgba(59,125,237,0.28); }

  /* topics */
  .sc-topics { padding:20px 24px; position:relative; z-index:1; flex:1; overflow-y:auto; }
  .sc-topics::-webkit-scrollbar { width:3px; }
  .sc-topics::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:4px; }
  .sc-topics-lbl {
    font-family:'DM Mono',monospace; font-size:9px; letter-spacing:2.5px;
    text-transform:uppercase; color:rgba(176,186,200,.5); margin-bottom:12px;
  }
  .sc-topic-btn {
    display:flex; align-items:center; gap:10px; width:100%;
    padding:10px 12px; background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.06); border-radius:10px;
    margin-bottom:6px; cursor:pointer; transition:all .18s; text-align:left;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .sc-topic-btn:hover { background:rgba(59,125,237,0.1); border-color:rgba(59,125,237,0.25); transform:translateX(3px); }
  .sc-topic-ico {
    width:30px; height:30px; border-radius:8px;
    background:rgba(59,125,237,0.12); border:1px solid rgba(59,125,237,0.2);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    color:var(--blue-lt);
  }
  .sc-topic-text { font-size:12px; font-weight:500; color:rgba(176,186,200,.85); line-height:1.4; }

  /* stats */
  .sc-stats {
    margin:0 24px; padding:16px 0;
    border-top:1px solid rgba(255,255,255,0.06);
    display:grid; grid-template-columns:1fr 1fr; gap:10px;
    position:relative; z-index:1; flex-shrink:0;
  }
  .sc-stat {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:12px;
  }
  .sc-stat-num { font-size:20px; font-weight:800; color:var(--blue-lt); letter-spacing:-.5px; line-height:1; margin-bottom:3px; }
  .sc-stat-lbl { font-size:10px; color:rgba(176,186,200,.5); font-weight:400; line-height:1.3; }

  /* footer */
  .sc-sb-foot {
    padding:16px 24px 20px; border-top:1px solid rgba(255,255,255,0.06);
    position:relative; z-index:1; flex-shrink:0;
  }
  .sc-user-row { display:flex; align-items:center; gap:10px; }
  .sc-user-av {
    width:34px; height:34px; border-radius:9px; flex-shrink:0;
    background:linear-gradient(135deg,var(--navy-soft),var(--blue));
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:800; color:#fff; letter-spacing:-.3px;
    border:1px solid rgba(255,255,255,0.12);
  }
  .sc-user-name { font-size:12.5px; font-weight:700; color:#fff; line-height:1.2; }
  .sc-user-role { font-size:10px; color:rgba(176,186,200,.5); font-weight:400; }

  /* ── Main ── */
  .sc-main { flex:1; display:flex; flex-direction:column; min-width:0; background:var(--cream); }

  .sc-topbar {
    height:62px; background:var(--white); border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 32px; flex-shrink:0;
    box-shadow:0 1px 6px rgba(0,0,0,.04);
  }
  .sc-topbar-l { display:flex; align-items:center; gap:12px; }
  .sc-topbar-r { display:flex; align-items:center; gap:10px; }
  .sc-topbar-badge {
    display:flex; align-items:center; gap:7px; padding:5px 12px;
    background:linear-gradient(135deg,var(--navy-soft),var(--blue));
    border-radius:8px; font-size:11px; font-weight:700; color:#fff;
    letter-spacing:.2px;
  }
  .sc-topbar-sep { width:1px; height:20px; background:var(--border); }
  .sc-topbar-info { font-size:12.5px; color:var(--slate); font-weight:500; }

  /* ── Back to Home — topbar version ── */
  .sc-home-btn {
    display:flex; align-items:center; gap:6px;
    height:32px; padding:0 13px;
    border-radius:8px; border:1.5px solid var(--border);
    background:var(--white); cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:11.5px; font-weight:600; color:var(--slate);
    transition:all .15s; white-space:nowrap;
  }
  .sc-home-btn:hover {
    border-color:var(--blue); color:var(--blue);
    background:#EBF2FD; transform:translateX(-1px);
  }

  .sc-clear-btn {
    display:flex; align-items:center; gap:6px; height:32px; padding:0 12px;
    border-radius:8px; border:1px solid var(--border); background:var(--white);
    font-family:'Plus Jakarta Sans',sans-serif; font-size:11.5px; font-weight:600;
    color:var(--slate); cursor:pointer; transition:all .15s;
  }
  .sc-clear-btn:hover { border-color:var(--red); color:var(--red); background:#FEF2F2; }

  /* messages */
  .sc-messages {
    flex:1; overflow-y:auto; padding:28px 36px;
    display:flex; flex-direction:column; gap:20px; scroll-behavior:smooth;
  }
  .sc-messages::-webkit-scrollbar { width:5px; }
  .sc-messages::-webkit-scrollbar-thumb { background:var(--border-dk); border-radius:4px; }

  /* welcome */
  .sc-welcome {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:18px; min-height:55vh; text-align:center;
    animation:scFadeUp .5s ease both;
  }
  @keyframes scFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  .sc-welcome-crest {
    width:76px; height:76px; border-radius:22px;
    background:linear-gradient(140deg,var(--navy),var(--navy-soft));
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 28px rgba(12,26,46,.2); position:relative;
  }
  .sc-welcome-crest::after {
    content:''; position:absolute; inset:-4px; border-radius:26px;
    border:1.5px solid rgba(59,125,237,.25); pointer-events:none;
  }
  .sc-welcome-h { font-size:26px; font-weight:800; color:var(--navy); letter-spacing:-.5px; line-height:1.2; }
  .sc-welcome-h span { color:var(--blue); }
  .sc-welcome-p { font-size:13.5px; color:var(--slate); max-width:400px; line-height:1.7; font-weight:400; }

  /* suggestion chips */
  .sc-chips { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; max-width:540px; margin-top:4px; }
  .sc-chip {
    display:inline-flex; align-items:center; gap:7px; padding:8px 16px;
    background:var(--white); border:1.5px solid var(--border); border-radius:22px;
    font-size:12px; font-weight:600; color:var(--navy); cursor:pointer;
    transition:all .18s; box-shadow:0 1px 4px rgba(0,0,0,.04);
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .sc-chip:hover {
    border-color:var(--blue); color:var(--blue); background:#EBF2FD;
    transform:translateY(-2px); box-shadow:0 4px 14px rgba(59,125,237,.14);
  }
  .sc-chip-ico { color:var(--blue); flex-shrink:0; }

  /* message rows */
  .sc-row { display:flex; gap:12px; animation:scMsgIn .22s ease both; }
  @keyframes scMsgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .sc-row.user { flex-direction:row-reverse; }

  .sc-msg-av {
    width:34px; height:34px; border-radius:10px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:11px; font-weight:800; letter-spacing:-.3px; margin-top:2px;
  }
  .sc-msg-av.bot  { background:var(--navy); color:var(--blue-lt); box-shadow:0 2px 8px rgba(12,26,46,.2); }
  .sc-msg-av.user { background:linear-gradient(135deg,var(--navy-soft),var(--blue)); color:#fff; }

  .sc-msg-body { display:flex; flex-direction:column; gap:4px; max-width:68%; }
  .sc-row.user .sc-msg-body { align-items:flex-end; }

  .sc-msg-lbl {
    font-family:'DM Mono',monospace; font-size:9px; letter-spacing:1.5px;
    text-transform:uppercase; color:var(--slate-lt); padding:0 2px;
  }
  .sc-bubble {
    padding:13px 17px; border-radius:16px; font-size:13.5px;
    line-height:1.75; word-break:break-word; white-space:pre-wrap;
  }
  .sc-bubble.bot {
    background:var(--white); border:1px solid var(--border); color:var(--navy);
    border-bottom-left-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,.04);
  }
  .sc-bubble.user {
    background:linear-gradient(135deg,var(--navy),var(--navy-soft));
    color:#fff; border-bottom-right-radius:4px;
    box-shadow:0 4px 14px rgba(12,26,46,.2);
  }

  /* typing */
  .sc-typing-row { display:flex; gap:12px; animation:scMsgIn .22s ease both; }
  .sc-typing {
    padding:15px 18px; background:var(--white); border:1px solid var(--border);
    border-radius:16px; border-bottom-left-radius:4px;
    display:flex; align-items:center; gap:5px; box-shadow:0 2px 8px rgba(0,0,0,.04);
  }
  .sc-typing span {
    width:7px; height:7px; border-radius:50%; background:var(--slate-lt);
    animation:scTyping 1.3s ease infinite;
  }
  .sc-typing span:nth-child(2) { animation-delay:.18s; }
  .sc-typing span:nth-child(3) { animation-delay:.36s; }
  @keyframes scTyping {
    0%,80%,100% { transform:scale(.75); opacity:.4; }
    40% { transform:scale(1.15); opacity:1; background:var(--blue); }
  }

  /* ── Input ── */
  .sc-input-area {
    background:var(--white); border-top:1px solid var(--border);
    padding:18px 36px 22px; flex-shrink:0;
  }
  .sc-input-shell {
    display:flex; align-items:flex-end; gap:12px; max-width:860px; margin:0 auto;
    background:var(--cream); border:1.5px solid var(--border);
    border-radius:16px; padding:12px 12px 12px 18px;
    transition:border-color .18s, box-shadow .18s;
  }
  .sc-input-shell:focus-within {
    border-color:var(--blue); box-shadow:0 0 0 3px rgba(59,125,237,.1);
    background:var(--white);
  }
  .sc-textarea {
    flex:1; background:transparent; border:none; outline:none;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13.5px; font-weight:400;
    color:var(--navy); resize:none; line-height:1.6;
    min-height:24px; max-height:120px; padding:2px 0;
  }
  .sc-textarea::placeholder { color:var(--slate-lt); font-weight:400; }
  .sc-input-r { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .sc-hint { font-family:'DM Mono',monospace; font-size:9px; color:var(--slate-lt); letter-spacing:.5px; }
  .sc-send {
    width:42px; height:42px; border-radius:12px; border:none;
    background:linear-gradient(135deg,var(--navy-soft),var(--blue));
    color:#fff; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:transform .15s,box-shadow .15s;
    box-shadow:0 4px 14px rgba(27,58,107,.3); flex-shrink:0;
  }
  .sc-send:hover:not(:disabled) { transform:scale(1.07); box-shadow:0 6px 20px rgba(27,58,107,.4); }
  .sc-send:disabled { opacity:.35; cursor:not-allowed; transform:none; box-shadow:none; }
  .sc-foot-note {
    text-align:center; font-size:11px; color:var(--slate-lt); margin-top:9px;
    font-weight:400; max-width:860px; margin-left:auto; margin-right:auto;
    font-family:'DM Mono',monospace; letter-spacing:.3px;
  }

  @media (max-width:768px) {
    .sc-sidebar { display:none; }
    .sc-messages { padding:20px; }
    .sc-input-area { padding:14px 20px 18px; }
    .sc-topbar { padding:0 20px; }
  }
`;

/* ── SVG icon set ── */
const I = {
  Brain:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14z"/></svg>,
  Building: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  File:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Target:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Users:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Code:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Globe:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Star:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Chat:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Send:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Trash:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>,
  Bot:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/><circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/></svg>,
  Interview:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  ChevLeft: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  Home:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

const SUGGESTIONS = [
  { icon: I.Interview, text:"How to ace placement interviews?" },
  { icon: I.Building,  text:"Top companies visiting campus?" },
  { icon: I.File,      text:"Resume writing tips" },
  { icon: I.Calendar,  text:"Placement schedule & deadlines" },
  { icon: I.Star,      text:"In-demand skills this year" },
  { icon: I.Users,     text:"Cracking group discussions" },
];

const SIDEBAR_TOPICS = [
  { icon: I.Interview, text:"Interview Preparation"    },
  { icon: I.Building,  text:"Company Research"         },
  { icon: I.File,      text:"Resume & Cover Letter"    },
  { icon: I.Code,      text:"Aptitude & Coding Tests"  },
  { icon: I.Globe,     text:"Off-Campus Opportunities" },
];

export default function StudentChatbot() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user") || '{"name":"Student"}');
  const secondName = user?.name?.split(" ")[1] || "Student";
  const initials  = (user?.name || "S").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const [msg,     setMsg]     = useState("");
  const [chat,    setChat]    = useState([]);
  const [loading, setLoading] = useState(false);

  const endRef      = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [chat, loading]);

  const handleInput = (e) => {
    setMsg(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const sendMessage = async (text) => {
    const content = (text || msg).trim();
    if (!content || loading) return;
    setMsg("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setChat(prev => [...prev, { sender:"user", text:content }]);
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/chat`,
        { message: content },
        { headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } }
      );
      setChat(prev => [...prev, { sender:"bot", text:res.data.reply }]);
    } catch {
      setChat(prev => [...prev, { sender:"bot", text:"I'm having trouble connecting right now. Please check your connection and try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 60);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const goHome = () => navigate("/dashboard");

  return (
    <>
      <style>{css}</style>
      <div className="sc-page">

        {/* ── Sidebar ── */}
        <aside className="sc-sidebar">

          {/* Brand */}
          <div className="sc-brand">
            <div className="sc-brand-ey">Placement Portal</div>
            <div className="sc-brand-logo">{I.Chat}</div>
            <div className="sc-brand-name">AI <span>Advisor</span></div>
            <div className="sc-brand-sub">Intelligent guidance for your career journey</div>
            <div className="sc-online">
              <span className="sc-online-dot"/>
              ONLINE
            </div>
          </div>

          {/* ── Back to Home (sidebar) ── */}
          <button className="sc-back-btn" onClick={goHome}>
            <span className="sc-back-btn-ico">{I.ChevLeft}</span>
            Back to Home
          </button>

          {/* Topics */}
          <div className="sc-topics">
            <div className="sc-topics-lbl">Browse Topics</div>
            {SIDEBAR_TOPICS.map((t, i) => (
              <button key={i} className="sc-topic-btn" onClick={() => sendMessage(t.text)}>
                <span className="sc-topic-ico">{t.icon}</span>
                <span className="sc-topic-text">{t.text}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="sc-stats">
            <div className="sc-stat">
              <div className="sc-stat-num">500+</div>
              <div className="sc-stat-lbl">Companies in database</div>
            </div>
            <div className="sc-stat">
              <div className="sc-stat-num">24 / 7</div>
              <div className="sc-stat-lbl">Always available</div>
            </div>
          </div>

          {/* Footer */}
          <div className="sc-sb-foot">
            <div className="sc-user-row">
              <div className="sc-user-av">{initials}</div>
              <div>
                <div className="sc-user-name">{user.name || "Student"}</div>
                <div className="sc-user-role">Student · Placement Portal</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="sc-main">

          {/* Top bar */}
          <div className="sc-topbar">
            <div className="sc-topbar-l">
              <div className="sc-topbar-badge">
                {I.Bot}
                Placement Assistant
              </div>
              <div className="sc-topbar-sep"/>
              <div className="sc-topbar-info">
                {chat.length === 0
                  ? "Start a conversation below"
                  : `${chat.length} message${chat.length !== 1 ? "s" : ""} · this session`}
              </div>
            </div>

            {/* ── Topbar right ── */}
            <div className="sc-topbar-r">
              {/* Back to Home pill — always visible */}
              <button className="sc-home-btn" onClick={goHome}>
                {I.ChevLeft}
                {I.Home}
                Home
              </button>
              {chat.length > 0 && (
                <button className="sc-clear-btn" onClick={() => setChat([])}>
                  {I.Trash}
                  Clear session
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="sc-messages">
            {chat.length === 0 ? (
              <div className="sc-welcome">
                <div className="sc-welcome-crest">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.7">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <path d="M9 11V7a3 3 0 0 1 6 0v4"/>
                    <circle cx="9"  cy="16" r="1" fill="#60A5FA"/>
                    <circle cx="15" cy="16" r="1" fill="#60A5FA"/>
                  </svg>
                </div>
                <div className="sc-welcome-h">Welcome, <span>{secondName}</span></div>
                <div className="sc-welcome-p">
                  I'm your dedicated placement advisor. Ask me anything about interview preparation,
                  company research, resume tips, or placement timelines.
                </div>
                <div className="sc-chips">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="sc-chip" onClick={() => sendMessage(s.text)}>
                      <span className="sc-chip-ico">{s.icon}</span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chat.map((c, i) => (
                  <div key={i} className={`sc-row ${c.sender}`}>
                    <div className={`sc-msg-av ${c.sender}`}>
                      {c.sender === "bot" ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="10" rx="2"/>
                          <path d="M9 11V7a3 3 0 0 1 6 0v4"/>
                          <circle cx="9"  cy="16" r="1" fill="#60A5FA"/>
                          <circle cx="15" cy="16" r="1" fill="#60A5FA"/>
                        </svg>
                      ) : initials}
                    </div>
                    <div className="sc-msg-body">
                      <span className="sc-msg-lbl">{c.sender === "bot" ? "Advisor" : "You"}</span>
                      <div className={`sc-bubble ${c.sender}`}>{c.text}</div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="sc-typing-row">
                    <div className="sc-msg-av bot">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2"/>
                        <path d="M9 11V7a3 3 0 0 1 6 0v4"/>
                        <circle cx="9"  cy="16" r="1" fill="#60A5FA"/>
                        <circle cx="15" cy="16" r="1" fill="#60A5FA"/>
                      </svg>
                    </div>
                    <div className="sc-typing"><span/><span/><span/></div>
                  </div>
                )}
              </>
            )}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div className="sc-input-area">
            <div className="sc-input-shell">
              <textarea
                ref={textareaRef}
                className="sc-textarea"
                placeholder="Ask about placements, companies, interviews…"
                value={msg}
                onChange={handleInput}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
                autoFocus
              />
              <div className="sc-input-r">
                <span className="sc-hint">↵ send</span>
                <button
                  className="sc-send"
                  onClick={() => sendMessage()}
                  disabled={!msg.trim() || loading}
                >
                  {I.Send}
                </button>
              </div>
            </div>
            <div className="sc-foot-note">
              Responses are AI-generated · Verify critical details with your TPO office
            </div>
          </div>

        </div>
      </div>
    </>
  );
}