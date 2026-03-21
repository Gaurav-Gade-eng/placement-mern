import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api";
/* ── inject styles once ── */
if (!document.getElementById("res-styles")) {
  const s = document.createElement("style");
  s.id = "res-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes resSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes resFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes resShimmer {
      from { transform: translateX(-100%); }
      to   { transform: translateX(200%); }
    }

    .res-root {
      display: flex; min-height: 100vh;
      background: #F4F6F9;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .res-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .res-body  { flex: 1; padding: 36px 40px; overflow-y: auto; }

    /* ── Page header ── */
    .res-header {
      margin-bottom: 32px;
      animation: resSlideUp 0.5s ease both;
    }
    .res-eyebrow {
      font-size: 10px; font-weight: 700; letter-spacing: 3.5px;
      text-transform: uppercase; color: #3B7DED; margin-bottom: 8px;
      display: flex; align-items: center; gap: 8px;
    }
    .res-eyebrow::before {
      content: ''; width: 20px; height: 2px;
      background: #3B7DED; border-radius: 2px;
    }
    .res-title {
      font-size: 28px; font-weight: 800; color: #0D1C33;
      letter-spacing: -0.6px; line-height: 1.1; margin-bottom: 8px;
    }
    .res-subtitle {
      font-size: 13.5px; color: #7A8599; line-height: 1.6; max-width: 480px;
    }

    /* ── Filter chips ── */
    .res-filters {
      display: flex; gap: 8px; flex-wrap: wrap;
      margin-bottom: 28px;
      animation: resSlideUp 0.5s 0.08s ease both;
    }
    .res-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 20px;
      font-size: 12px; font-weight: 600; cursor: pointer;
      border: 1px solid #E2E4E9;
      background: #fff; color: #7A8599;
      transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1);
      white-space: nowrap;
    }
    .res-chip:hover { border-color: #3B7DED; color: #3B7DED; transform: translateY(-1px); }
    .res-chip.active {
      background: #1B3A6B; border-color: #1B3A6B; color: #fff;
      box-shadow: 0 4px 12px rgba(27,58,107,0.22);
    }
    .res-chip-dot {
      width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.7;
    }

    /* ── Grid ── */
    .res-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    /* ── Card ── */
    .res-card {
      background: #fff;
      border: 1px solid #E2E4E9;
      border-radius: 16px;
      overflow: hidden;
      transition: box-shadow 0.25s, transform 0.25s, border-color 0.2s;
      position: relative;
    }
    .res-card:hover {
      box-shadow: 0 10px 36px rgba(0,0,0,0.09);
      transform: translateY(-3px);
      border-color: #C7D9F5;
    }

    .res-card-bar { height: 3px; width: 100%; }

    .res-card-head {
      padding: 18px 20px 14px;
      border-bottom: 1px solid #F0F2F6;
      display: flex; align-items: flex-start; gap: 12px;
    }
    .res-card-badge {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .res-card-title {
      font-size: 14px; font-weight: 700; color: #0D1C33;
      letter-spacing: -0.2px; line-height: 1.3;
    }
    .res-card-tag {
      display: inline-flex; align-items: center;
      font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; color: #B0BAC8; margin-top: 3px;
    }

    /* ── Tabs inside card ── */
    .res-tabs {
      display: flex; border-bottom: 1px solid #F0F2F6;
    }
    .res-tab {
      flex: 1; padding: 10px 0; text-align: center;
      font-size: 11.5px; font-weight: 700; cursor: pointer;
      color: #B0BAC8; border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
      letter-spacing: 0.3px;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .res-tab.active { color: #3B7DED; border-bottom-color: #3B7DED; }
    .res-tab:hover:not(.active) { color: #7A8599; }

    /* ── Links panel ── */
    .res-links {
      padding: 14px 20px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .res-link-row {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 8px;
      border: 1px solid #F0F2F6; background: #FAFBFC;
      text-decoration: none; color: #0D1C33;
      font-size: 12.5px; font-weight: 600;
      transition: border-color 0.15s, background 0.15s, transform 0.18s;
      position: relative; overflow: hidden;
    }
    .res-link-row:hover {
      border-color: #C7D9F5; background: #F4F8FF;
      transform: translateX(3px);
    }
    .res-link-row::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(59,125,237,0.04), transparent);
      transform: translateX(-100%);
      transition: transform 0s;
    }
    .res-link-row:hover::after {
      transform: translateX(100%);
      transition: transform 0.6s;
    }
    .res-link-icon {
      width: 26px; height: 26px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .res-link-arrow {
      margin-left: auto; color: #C0C8D5; flex-shrink: 0;
      transition: transform 0.18s, color 0.15s;
    }
    .res-link-row:hover .res-link-arrow { transform: translateX(3px); color: #3B7DED; }

    /* ── Videos panel ── */
    .res-videos {
      padding: 14px 20px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .res-video-wrap {
      position: relative; border-radius: 10px; overflow: hidden;
      border: 1px solid #E8EDF3;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .res-video-wrap iframe {
      display: block; width: 100%; height: 178px; border: none;
    }
    .res-video-label {
      padding: 8px 12px;
      font-size: 11px; font-weight: 600; color: #7A8599;
      background: #FAFBFC; border-top: 1px solid #F0F2F6;
      display: flex; align-items: center; gap: 6px;
    }

    /* ── Empty state ── */
    .res-empty {
      grid-column: 1/-1;
      display: flex; flex-direction: column; align-items: center;
      padding: 64px 32px; text-align: center;
      animation: resFadeIn 0.4s ease both;
    }
    .res-empty-icon {
      width: 56px; height: 56px; border-radius: 14px;
      background: #EBF2FD; border: 1px solid #C2D6FA;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }

    /* ── Stats bar ── */
    .res-stats {
      display: flex; gap: 20px; flex-wrap: wrap;
      margin-bottom: 28px;
      animation: resSlideUp 0.5s 0.05s ease both;
    }
    .res-stat {
      background: #fff; border: 1px solid #E2E4E9;
      border-radius: 12px; padding: 14px 20px;
      display: flex; align-items: center; gap: 12px;
    }
    .res-stat-icon {
      width: 36px; height: 36px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .res-stat-val {
      font-size: 20px; font-weight: 800; color: #0D1C33;
      letter-spacing: -0.5px; line-height: 1;
    }
    .res-stat-lbl {
      font-size: 11px; color: #7A8599; font-weight: 500; margin-top: 2px;
    }
  `;
  document.head.appendChild(s);
}

/* ─────────────────────────────
   Professional SVG Icon Library
───────────────────────────── */

// Calculator — Aptitude
const IcoCalculator = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/>
  </svg>
);

// Code / Terminal — DSA & Programming
const IcoCode = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

// Settings/Gear — Mechanical
const IcoGear = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// Building/Structure — Civil
const IcoConstruct = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2"/>
    <line x1="2" y1="9" x2="22" y2="9"/>
    <line x1="2" y1="15" x2="22" y2="15"/>
    <line x1="8" y1="3" x2="8" y2="21"/>
    <line x1="16" y1="3" x2="16" y2="21"/>
  </svg>
);

// Zap — Electrical
const IcoZap = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// Radio/Signal — ENTC
const IcoSignal = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="6" x2="1" y2="18"/>
    <line x1="6" y1="3" x2="6" y2="21"/>
    <line x1="11" y1="6" x2="11" y2="18"/>
    <line x1="16" y1="3" x2="16" y2="21"/>
    <line x1="21" y1="6" x2="21" y2="18"/>
  </svg>
);

// File text — Resume & Interview
const IcoFileText = ({ size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// Layers — Departments stat
const IcoLayers = ({ size = 18, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

// Link — Study Links stat
const IcoLink = ({ size = 18, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

// Play circle — Video Lectures stat
const IcoPlayCircle = ({ size = 18, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8"/>
  </svg>
);

// Book open — Study Links tab
const IcoBook = ({ size = 13, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// Play — Video tab
const IcoPlay = ({ size = 13, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

/* ── Data ── */
const SECTIONS = [
  {
    id: "aptitude",
    title: "Aptitude Preparation",
    tag: "All Departments",
    Icon: IcoCalculator,
    color: "#3B7DED",
    bar: "linear-gradient(90deg,#3B7DED,#60A5FA)",
    bg: "#EBF2FD", border: "#C2D6FA",
    links: [
      { label: "IndiaBix Aptitude",  url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
      { label: "PrepInsta Aptitude", url: "https://prepinsta.com/aptitude/" },
    ],
    videos: [
      { src: "https://www.youtube.com/embed/AFh1-fqdaf4", label: "Aptitude Full Course" },
      { src: "https://www.youtube.com/embed/aQ92w2D_2GU", label: "Speed Math Tricks" },
    ],
  },
  {
    id: "dsa",
    title: "Programming & DSA",
    tag: "IT / CS Students",
    Icon: IcoCode,
    color: "#7C3AED",
    bar: "linear-gradient(90deg,#7C3AED,#A78BFA)",
    bg: "#F5F3FF", border: "#DDD6FE",
    links: [
      { label: "LeetCode",            url: "https://leetcode.com" },
      { label: "GeeksforGeeks DSA",   url: "https://www.geeksforgeeks.org/data-structures/" },
      { label: "NeetCode Roadmap",    url: "https://neetcode.io/roadmap" },
    ],
    videos: [
      { src: "https://youtube.com/embed/rZ41y93P2Qo", label: "DSA Full Course" },
      { src: "https://www.youtube.com/embed/AVFU8mqqcLQ", label: "DSA for Beginners" },
    ],
  },
  {
    id: "mechanical",
    title: "Mechanical Engineering",
    tag: "Mechanical",
    Icon: IcoGear,
    color: "#D97706",
    bar: "linear-gradient(90deg,#D97706,#FBBF24)",
    bg: "#FEF3C7", border: "#FDE68A",
    links: [
      { label: "Mechanical Interview Qs", url: "https://in.indeed.com/career-advice/interviewing/mechanical-engineering-interview-questions" },
      { label: "Thermodynamics Notes",    url: "https://www.physics.ox.ac.uk/system/files/file_attachments/all_thermo_notes.pdf" },
    ],
    videos: [
      { src: "https://www.youtube.com/embed/rpWT0MskXhA", label: "Mechanical Concepts" },
      { src: "https://www.youtube.com/embed/_RgdIl5sBcY", label: "Thermodynamics" },
    ],
  },
  {
    id: "civil",
    title: "Civil Engineering",
    tag: "Civil",
    Icon: IcoConstruct,
    color: "#0D9A8A",
    bar: "linear-gradient(90deg,#0D9A8A,#34D399)",
    bg: "#ECFDF5", border: "#A7F3D0",
    links: [
      { label: "Civil Interview Qs",     url: "https://www.geeksforgeeks.org/civil-engineering-interview-questions/" },
      { label: "About Civil (Notes)",    url: "https://www.aboutcivil.org" },
    ],
    videos: [
      { src: "https://youtube.com/embed/c92eSsqHjU8", label: "Civil Engineering" },
      { src: "https://www.youtube.com/embed/2DgEnEuPPKo", label: "Structural Analysis" },
    ],
  },
  {
    id: "electrical",
    title: "Electrical Engineering",
    tag: "Electrical",
    Icon: IcoZap,
    color: "#DC2626",
    bar: "linear-gradient(90deg,#DC2626,#F87171)",
    bg: "#FEF2F2", border: "#FECACA",
    links: [
      { label: "Electrical Interview Qs", url: "https://www.indiabix.com/electrical-engineering/questions-and-answers/" },
      { label: "Electrical4U Notes",      url: "https://www.electrical4u.com" },
    ],
    videos: [
      { src: "https://www.youtube.com/embed/6Maq5IyHSuc", label: "Electrical Machines" },
      { src: "https://www.youtube.com/embed/MWrlT72nS-s", label: "Circuit Theory" },
    ],
  },
  {
    id: "entc",
    title: "ENTC / Electronics",
    tag: "ENTC",
    Icon: IcoSignal,
    color: "#0284C7",
    bar: "linear-gradient(90deg,#0284C7,#38BDF8)",
    bg: "#F0F9FF", border: "#BAE6FD",
    links: [
      { label: "Electronics Interview Qs", url: "https://www.indiabix.com/electronics-and-communication-engineering/questions-and-answers/" },
      { label: "Digital Electronics Notes",url: "https://www.geeksforgeeks.org/digital-logic/digital-electronics-logic-design-tutorials/" },
    ],
    videos: [
      { src: "https://www.youtube.com/embed/M0mx8S05v60", label: "Digital Electronics" },
      { src: "https://www.youtube.com/embed/7jaa1rlW7Ak", label: "Analog Circuits" },
    ],
  },
  {
    id: "resume",
    title: "Resume & Interview Prep",
    tag: "All Students",
    Icon: IcoFileText,
    color: "#16A34A",
    bar: "linear-gradient(90deg,#16A34A,#4ADE80)",
    bg: "#F0FDF4", border: "#BBF7D0",
    links: [
      { label: "Resume Building Guide",   url: "https://www.youtube.com/watch?v=7jaa1rlW7Ak&list=PLBlnK6fEyqRiw-GZRqfnlVIBz9dxrqHJS" },
      { label: "HR Interview Questions",  url: "https://www.indiabix.com/hr-interview/questions-and-answers/" },
    ],
    videos: [
      { src: "https://www.youtube.com/embed/H8BIFwfcBxs", label: "Resume Writing Tips" },
      { src: "https://www.youtube.com/embed/zIm_k9j0C50", label: "HR Interview Prep" },
    ],
  },
];

const FILTERS = [
  { id: "all",        label: "All Resources" },
  { id: "aptitude",   label: "Aptitude" },
  { id: "dsa",        label: "Programming" },
  { id: "mechanical", label: "Mechanical" },
  { id: "civil",      label: "Civil" },
  { id: "electrical", label: "Electrical" },
  { id: "entc",       label: "ENTC" },
  { id: "resume",     label: "Resume & HR" },
];

/* ── Card component ── */
function ResourceCard({ section, delay }) {
  const [tab, setTab] = useState("links");
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="res-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ${delay}ms ease, transform 0.5s ${delay}ms cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      {/* accent bar */}
      <div className="res-card-bar" style={{ background: section.bar }} />

      {/* header — SVG icon replacing emoji */}
      <div className="res-card-head">
        <div
          className="res-card-badge"
          style={{ background: section.bg, border: `1px solid ${section.border}` }}
        >
          <section.Icon size={20} color={section.color} sw={1.8} />
        </div>
        <div>
          <div className="res-card-title">{section.title}</div>
          <div className="res-card-tag" style={{ color: section.color }}>{section.tag}</div>
        </div>
      </div>

      {/* tabs — SVG icons replacing 📚 and 🎬 */}
      <div className="res-tabs">
        <div
          className={`res-tab${tab === "links" ? " active" : ""}`}
          onClick={() => setTab("links")}
          style={{
            borderBottomColor: tab === "links" ? section.color : "transparent",
            color: tab === "links" ? section.color : undefined,
          }}
        >
          <IcoBook size={13} color={tab === "links" ? section.color : "#B0BAC8"} sw={2} />
          Study Links
        </div>
        <div
          className={`res-tab${tab === "videos" ? " active" : ""}`}
          onClick={() => setTab("videos")}
          style={{
            borderBottomColor: tab === "videos" ? section.color : "transparent",
            color: tab === "videos" ? section.color : undefined,
          }}
        >
          <IcoPlay size={13} color={tab === "videos" ? section.color : "#B0BAC8"} sw={2} />
          Video Lectures
        </div>
      </div>

      {/* links panel */}
      {tab === "links" && (
        <div className="res-links">
          {section.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="res-link-row"
            >
              <div
                className="res-link-icon"
                style={{ background: section.bg, border: `1px solid ${section.border}` }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={section.color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
              {link.label}
              <svg className="res-link-arrow" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          ))}
        </div>
      )}

      {/* videos panel */}
      {tab === "videos" && (
        <div className="res-videos">
          {section.videos.map((v, i) => (
            <div key={i} className="res-video-wrap">
              <iframe
                src={v.src}
                title={v.label}
                allowFullScreen
                loading="lazy"
              />
              <div className="res-video-label">
                {/* Play triangle — replaces the inline SVG that was already professional */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#7A8599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {v.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
function Resources() {
  const [active, setActive] = useState("all");

  const filtered = active === "all"
    ? SECTIONS
    : SECTIONS.filter(s => s.id === active);

  const totalLinks  = SECTIONS.reduce((a, s) => a + s.links.length, 0);
  const totalVideos = SECTIONS.reduce((a, s) => a + s.videos.length, 0);

  /* Stat card definitions — SVG icons replacing emojis */
  const statCards = [
    { Icon: IcoLayers,     val: SECTIONS.length, lbl: "Departments",    bg:"#EBF2FD", bc:"#C2D6FA", ic:"#3B7DED" },
    { Icon: IcoLink,       val: totalLinks,       lbl: "Study Links",   bg:"#F0FDF4", bc:"#BBF7D0", ic:"#16A34A" },
    { Icon: IcoPlayCircle, val: totalVideos,      lbl: "Video Lectures", bg:"#FEF3C7", bc:"#FDE68A", ic:"#D97706" },
  ];

  return (
    <div className="res-root">
      <Sidebar />
      <div className="res-main">
        <Navbar />
        <div className="res-body">

          {/* ── Header ── */}
          <div className="res-header">
            <div className="res-eyebrow">Learning Hub</div>
            <h1 className="res-title">Placement Preparation Resources</h1>
            <p className="res-subtitle">
              Department-wise curated study materials, video lectures, and interview prep guides to help you land your dream placement.
            </p>
          </div>

          {/* ── Stats — SVG icons replacing emojis ── */}
          <div className="res-stats">
            {statCards.map((st, i) => (
              <div className="res-stat" key={i}>
                <div
                  className="res-stat-icon"
                  style={{ background: st.bg, border: `1px solid ${st.bc}` }}
                >
                  <st.Icon size={18} color={st.ic} sw={2} />
                </div>
                <div>
                  <div className="res-stat-val">{st.val}</div>
                  <div className="res-stat-lbl">{st.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="res-filters">
            {FILTERS.map(f => (
              <div
                key={f.id}
                className={`res-chip${active === f.id ? " active" : ""}`}
                onClick={() => setActive(f.id)}
              >
                {active === f.id && <div className="res-chip-dot" />}
                {f.label}
              </div>
            ))}
          </div>

          {/* ── Grid ── */}
          <div className="res-grid">
            {filtered.length === 0 ? (
              <div className="res-empty">
                <div className="res-empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#3B7DED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0D1C33" }}>No resources found</p>
              </div>
            ) : (
              filtered.map((section, i) => (
                <ResourceCard key={section.id} section={section} delay={i * 60} />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Resources;