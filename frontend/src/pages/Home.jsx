import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

/* ── inject styles once ── */
if (!document.getElementById("ph-home-styles")) {
  const s = document.createElement("style");
  s.id = "ph-home-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    :root {
      --ink:      #0A0F1E;
      --ink2:     #1E2A3A;
      --ink3:     #4A5568;
      --ink4:     #8896A8;
      --navy:     #0D1B3E;
      --navy2:    #152347;
      --blue:     #2563EB;
      --blue-lt:  #EBF2FD;
      --gold:     #C9A84C;
      --gold-lt:  #FBF3DC;
      --teal:     #0A9080;
      --teal-lt:  #E0F5F2;
      --white:    #FFFFFF;
      --off:      #F7F8FA;
      --border:   #E4E7ED;
      --ff-head:  'DM Serif Display', Georgia, serif;
      --ff-body:  'DM Sans', system-ui, sans-serif;
    }

    @keyframes ph-navIn    { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ph-heroIn   { from{opacity:0;transform:translateY(32px)}  to{opacity:1;transform:translateY(0)} }
    @keyframes ph-pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
    @keyframes ph-float1   { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(20px,14px) rotate(1.5deg)} }
    @keyframes ph-float2   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-18px,-12px)} }
    @keyframes ph-gridDrift{ 0%{background-position:0 0} 100%{background-position:60px 60px} }
    @keyframes ph-shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
    @keyframes ph-scaleIn  { from{opacity:0;transform:scale(0.92) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes ph-spinRing { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--off); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

    .ph-root {
      font-family: var(--ff-body);
      background: var(--off);
      color: var(--ink);
      overflow-x: hidden;
      min-height: 100vh;
    }

    /* ══ NAV ══ */
    .ph-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 200;
      height: 62px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 48px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(228,231,237,0.9);
      box-shadow: 0 1px 0 rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.04);
      animation: ph-navIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
    }
    .ph-nav-brand {
      display: flex; align-items: center; gap: 11px;
      text-decoration: none; flex-shrink: 0;
    }
    .ph-nav-logo {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(145deg, #0D1B3E 0%, #2563EB 100%);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 10px rgba(13,27,62,0.32), inset 0 1px 0 rgba(255,255,255,0.15);
      flex-shrink: 0;
    }
    .ph-nav-name {
      font-family: var(--ff-head); font-size: 15px;
      color: var(--ink); letter-spacing: -0.3px; line-height: 1;
    }
    .ph-nav-sub {
      font-size: 8.5px; font-weight: 600; color: var(--ink4);
      letter-spacing: 2px; text-transform: uppercase; margin-top: 2px;
    }
    .ph-nav-links {
      display: flex; align-items: center;
      background: #F0F2F7; border: 1px solid var(--border);
      border-radius: 10px; padding: 3px; gap: 1px;
    }
    .ph-nav-link {
      text-decoration: none; font-size: 12px; font-weight: 500;
      color: var(--ink3); padding: 5px 15px; border-radius: 7px;
      transition: all 0.15s; white-space: nowrap; font-family: var(--ff-body);
    }
    .ph-nav-link:hover { background: rgba(255,255,255,0.8); color: var(--ink); }
    .ph-nav-link.nla {
      background: var(--white); color: var(--navy); font-weight: 700;
      box-shadow: 0 1px 4px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.9);
    }
    .ph-nav-badge {
      display: flex; align-items: center; gap: 7px;
      background: var(--navy); border-radius: 20px;
      padding: 5px 14px 5px 10px;
      font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.9);
      font-family: var(--ff-body); flex-shrink: 0;
    }
    .ph-nav-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #4ADE80;
      box-shadow: 0 0 0 2px rgba(74,222,128,0.25);
      animation: ph-pulse 2s ease infinite; flex-shrink: 0;
    }

    /* ══ HERO ══ */
    .ph-hero {
      min-height: 100vh;
      background: var(--navy);
      display: flex; flex-direction: column;
      padding-top: 62px;
      position: relative; overflow: hidden;
    }
    .ph-hero-grid {
      position: absolute; inset: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: ph-gridDrift 14s linear infinite;
    }
    .ph-hero-glow1 {
      position: absolute; width: 640px; height: 640px;
      border-radius: 50%; pointer-events: none;
      top: -240px; right: -120px;
      background: radial-gradient(circle, rgba(37,99,235,0.20) 0%, transparent 65%);
      animation: ph-float1 14s ease-in-out infinite;
    }
    .ph-hero-glow2 {
      position: absolute; width: 480px; height: 480px;
      border-radius: 50%; pointer-events: none;
      bottom: 60px; left: -100px;
      background: radial-gradient(circle, rgba(10,144,128,0.15) 0%, transparent 65%);
      animation: ph-float2 11s ease-in-out infinite;
    }
    .ph-hero-ring {
      position: absolute; width: 560px; height: 560px;
      border-radius: 50%; pointer-events: none;
      top: 50%; left: 50%; transform: translate(-50%,-50%);
      border: 1px solid rgba(255,255,255,0.04);
    }
    .ph-hero-ring2 {
      position: absolute; width: 840px; height: 840px;
      border-radius: 50%; pointer-events: none;
      top: 50%; left: 50%; transform: translate(-50%,-50%);
      border: 1px solid rgba(255,255,255,0.025);
    }
    .ph-hero-ring-spin {
      position: absolute; width: 320px; height: 320px;
      border-radius: 50%; pointer-events: none;
      top: 50%; left: 50%;
      border: 1px dashed rgba(201,168,76,0.12);
      animation: ph-spinRing 40s linear infinite;
    }
    .ph-hero-content {
      position: relative; z-index: 3;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 0; align-items: center;
      padding: 72px 64px 0;
      max-width: 1200px; margin: 0 auto; width: 100%;
      flex: 1;
    }
    .ph-hero-left { padding-bottom: 80px; }
    .ph-hero-eyebrow {
      display: inline-flex; align-items: center; gap: 10px;
      font-size: 10px; font-weight: 600; color: var(--gold);
      letter-spacing: 3px; text-transform: uppercase;
      margin-bottom: 24px; font-family: var(--ff-body);
      animation: ph-heroIn 0.7s 0.1s ease both;
    }
    .ph-eyebrow-line { width: 24px; height: 1px; background: var(--gold); opacity: 0.6; }
    .ph-hero-h1 {
      font-family: var(--ff-head);
      font-size: 70px; line-height: 1.0;
      letter-spacing: -2px; color: var(--white);
      margin-bottom: 28px;
      animation: ph-heroIn 0.7s 0.22s ease both;
    }
    .ph-hero-h1 em { font-style: italic; color: var(--gold); }
    .ph-hero-sub {
      font-size: 15px; line-height: 1.8; color: rgba(255,255,255,0.50);
      max-width: 400px; margin-bottom: 44px;
      font-weight: 400; font-family: var(--ff-body);
      animation: ph-heroIn 0.7s 0.34s ease both;
    }
    .ph-hero-btns {
      display: flex; gap: 12px; flex-wrap: wrap;
      animation: ph-heroIn 0.7s 0.46s ease both;
    }
    .ph-btn-primary {
      display: inline-flex; align-items: center; gap: 9px;
      background: var(--white); color: var(--navy);
      font-size: 13px; font-weight: 700; padding: 13px 26px;
      border-radius: 8px; text-decoration: none; font-family: var(--ff-body);
      box-shadow: 0 4px 20px rgba(0,0,0,0.22);
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    }
    .ph-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.32); }
    .ph-btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
      color: rgba(255,255,255,0.82); font-size: 13px; font-weight: 500;
      padding: 13px 22px; border-radius: 8px; text-decoration: none;
      font-family: var(--ff-body); backdrop-filter: blur(6px);
      transition: all 0.2s;
    }
    .ph-btn-ghost:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }

    .ph-hero-right {
      display: flex; flex-direction: column; gap: 14px;
      padding-bottom: 80px;
      animation: ph-scaleIn 0.85s 0.35s ease both;
    }
    .ph-float-card {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.11);
      border-radius: 14px; backdrop-filter: blur(18px);
      padding: 18px 22px;
    }
    .ph-float-label {
      font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.35);
      letter-spacing: 2.5px; text-transform: uppercase;
      margin-bottom: 12px; font-family: var(--ff-body);
    }

    /* ══ STATS BAND ══ */
    .ph-stats {
      background: var(--white);
      border-top: 3px solid var(--navy);
      border-bottom: 1px solid var(--border);
    }
    .ph-stats-inner {
      max-width: 1100px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(4,1fr);
    }
    .ph-stat-cell {
      padding: 36px 32px; border-right: 1px solid var(--border);
      position: relative; cursor: default; transition: background 0.2s;
    }
    .ph-stat-cell:last-child { border-right: none; }
    .ph-stat-cell:hover { background: var(--off); }
    .ph-stat-num {
      font-family: var(--ff-head); font-size: 44px;
      line-height: 1; letter-spacing: -1.5px; color: var(--ink);
      margin-bottom: 7px; transition: color 0.2s;
    }
    .ph-stat-sfx { font-size: 24px; }
    .ph-stat-label {
      font-size: 10px; font-weight: 700; color: var(--ink4);
      letter-spacing: 1.8px; text-transform: uppercase; font-family: var(--ff-body);
    }
    .ph-stat-bar {
      position: absolute; top: 0; left: 0; width: 3px; height: 100%;
      transition: background 0.2s;
    }

    /* ══ PORTALS ══ */
    .ph-portals {
      max-width: 1100px; margin: 0 auto;
      padding: 80px 48px 100px;
    }
    .ph-section-tag {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 9.5px; font-weight: 700; letter-spacing: 3px;
      text-transform: uppercase; color: var(--blue);
      font-family: var(--ff-body); margin-bottom: 14px;
    }
    .ph-tag-line { width: 22px; height: 1.5px; background: var(--blue); }
    .ph-section-h2 {
      font-family: var(--ff-head); font-size: 46px;
      color: var(--ink); letter-spacing: -1px; line-height: 1.1; margin-bottom: 12px;
    }
    .ph-section-sub {
      font-size: 14px; color: var(--ink3); line-height: 1.75;
      max-width: 380px; font-family: var(--ff-body);
    }
    .ph-portal-grid {
      display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; margin-top: 44px;
    }
    .ph-portal-card {
      display: flex; flex-direction: column;
      background: var(--white); border: 1px solid var(--border);
      border-radius: 16px; overflow: hidden; text-decoration: none;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
      position: relative;
    }
    .ph-portal-card:hover { transform: translateY(-7px); }
    .ph-portal-card-top {
      padding: 32px 32px 0;
      display: flex; align-items: flex-start; justify-content: space-between;
    }
    .ph-portal-icon {
      width: 52px; height: 52px; border-radius: 13px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .ph-portal-num {
      font-family: var(--ff-head); font-size: 68px; line-height: 1;
      letter-spacing: -2px; opacity: 0.05; color: var(--ink); user-select: none;
    }
    .ph-portal-body { padding: 22px 32px 28px; flex: 1; }
    .ph-portal-title {
      font-family: var(--ff-head); font-size: 26px; color: var(--ink);
      letter-spacing: -0.5px; margin-bottom: 10px;
    }
    .ph-portal-desc {
      font-size: 13.5px; color: var(--ink3); line-height: 1.78;
      font-family: var(--ff-body); margin-bottom: 22px;
    }
    .ph-portal-feats { display: flex; flex-direction: column; gap: 7px; margin-bottom: 26px; }
    .ph-portal-feat {
      display: flex; align-items: center; gap: 9px;
      font-size: 12px; color: var(--ink3); font-family: var(--ff-body);
    }
    .ph-feat-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
    .ph-portal-cta {
      display: inline-flex; align-items: center; gap: 7px;
      font-size: 12.5px; font-weight: 700; font-family: var(--ff-body);
      transition: gap 0.2s;
    }
    .ph-portal-card:hover .ph-portal-cta { gap: 12px; }
    .ph-portal-bar {
      height: 3px; transform: scaleX(0); transform-origin: left;
      transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
    }
    .ph-portal-card:hover .ph-portal-bar { transform: scaleX(1); }
    .ph-shimmer-line {
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      backgroundSize: 200% 100%;
      opacity: 0; transform: scaleX(0); transform-origin: left;
      transition: opacity 0.25s, transform 0.38s cubic-bezier(0.22,1,0.36,1);
      border-radius: 16px 16px 0 0;
    }
    .ph-portal-card:hover .ph-shimmer-line {
      opacity: 1; transform: scaleX(1);
      animation: ph-shimmer 2.2s linear infinite;
    }
    .ph-card-glow {
      position: absolute; inset: 0; pointer-events: none; border-radius: 16px;
      opacity: 0; transition: opacity 0.3s;
    }
    .ph-portal-card:hover .ph-card-glow { opacity: 1; }

    /* ══ HIGHLIGHTS ══ */
    .ph-hi {
      background: var(--navy); padding: 72px 0;
      position: relative; overflow: hidden;
    }
    .ph-hi::before {
      content: ''; position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .ph-hi-inner {
      max-width: 1100px; margin: 0 auto; padding: 0 48px;
      display: grid; grid-template-columns: 280px 1fr;
      gap: 64px; align-items: start; position: relative; z-index: 1;
    }
    .ph-hi-head {
      font-family: var(--ff-head); font-size: 42px;
      color: var(--white); line-height: 1.12; letter-spacing: -1px;
      position: sticky; top: 80px;
    }
    .ph-hi-head em { font-style: italic; color: var(--gold); }
    .ph-hi-grid {
      display: grid; grid-template-columns: repeat(3,1fr); gap: 14px;
    }
    .ph-hi-item {
      background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.09);
      border-radius: 12px; padding: 22px 18px;
      transition: background 0.2s, transform 0.25s;
    }
    .ph-hi-item:hover { background: rgba(255,255,255,0.1); transform: translateY(-3px); }
    .ph-hi-icon {
      width: 36px; height: 36px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
    }
    .ph-hi-title {
      font-size: 12.5px; font-weight: 700; color: var(--white);
      margin-bottom: 5px; font-family: var(--ff-body);
    }
    .ph-hi-sub {
      font-size: 11.5px; color: rgba(255,255,255,0.42);
      line-height: 1.6; font-family: var(--ff-body);
    }

    /* ══ FOOTER ══ */
    .ph-footer {
      background: var(--white); border-top: 1px solid var(--border);
      padding: 26px 48px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .ph-footer-brand { display: flex; align-items: center; gap: 10px; }
    .ph-footer-logo {
      width: 28px; height: 28px; border-radius: 7px;
      background: linear-gradient(145deg, #0D1B3E, #2563EB);
      display: flex; align-items: center; justify-content: center;
    }
    .ph-footer-name { font-family: var(--ff-head); font-size: 16px; color: var(--ink); }
    .ph-footer-links { display: flex; gap: 24px; }
    .ph-footer-link {
      font-size: 12px; color: var(--ink4); text-decoration: none;
      font-family: var(--ff-body); transition: color 0.15s;
    }
    .ph-footer-link:hover { color: var(--ink); }
    .ph-footer-copy { font-size: 12px; color: var(--ink4); font-family: var(--ff-body); }

    /* ══════════════════════════════════════
       MOBILE RESPONSIVE — Android screens
       Target: 360px–430px wide
    ══════════════════════════════════════ */

    @media (max-width: 768px) {

      /* NAV */
      .ph-nav {
        height: 56px;
        padding: 0 16px;
      }
      .ph-nav-logo { width: 30px; height: 30px; border-radius: 8px; }
      .ph-nav-name { font-size: 13px; }
      .ph-nav-sub { font-size: 7.5px; letter-spacing: 1.5px; }
      .ph-nav-links { display: none; }
      .ph-nav-badge {
        padding: 4px 10px 4px 8px;
        font-size: 9.5px; gap: 5px;
      }
      .ph-nav-dot { width: 5px; height: 5px; }

      /* HERO */
      .ph-hero { padding-top: 56px; min-height: auto; }
      .ph-hero-content {
        grid-template-columns: 1fr;
        padding: 36px 20px 0;
        gap: 0;
      }
      .ph-hero-left { padding-bottom: 32px; }
      .ph-hero-eyebrow {
        font-size: 8.5px; letter-spacing: 2.5px; margin-bottom: 16px;
      }
      .ph-hero-h1 {
        font-size: 44px; letter-spacing: -1.5px; margin-bottom: 18px;
        line-height: 1.0;
      }
      .ph-hero-sub {
        font-size: 13px; margin-bottom: 28px; max-width: 100%;
        line-height: 1.7;
      }
      .ph-hero-btns { gap: 10px; }
      .ph-btn-primary {
        font-size: 12px; padding: 11px 20px;
        flex: 1; justify-content: center;
      }
      .ph-btn-ghost {
        font-size: 12px; padding: 11px 18px;
        flex: 1; justify-content: center;
      }

      /* Hero right — stack cards vertically, full width */
      .ph-hero-right {
        padding-bottom: 0; gap: 12px;
        animation: ph-scaleIn 0.85s 0.35s ease both;
      }
      .ph-float-card {
        padding: 14px 16px; border-radius: 12px;
        margin-left: 0 !important; max-width: 100% !important;
      }
      .ph-float-label { font-size: 8px; margin-bottom: 10px; }

      /* Hero bottom fade */
      .ph-hero-fade { height: 60px !important; }

      /* STATS — 2×2 grid */
      .ph-stats-inner {
        grid-template-columns: repeat(2, 1fr);
      }
      .ph-stat-cell {
        padding: 22px 18px;
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
      }
      .ph-stat-cell:nth-child(2n) { border-right: none; }
      .ph-stat-cell:nth-child(3),
      .ph-stat-cell:nth-child(4) { border-bottom: none; }
      .ph-stat-num { font-size: 32px; }
      .ph-stat-sfx { font-size: 18px; }
      .ph-stat-label { font-size: 8.5px; letter-spacing: 1.2px; }

      /* PORTALS */
      .ph-portals { padding: 48px 20px 60px; }
      .ph-section-h2 { font-size: 34px; }
      .ph-section-sub { font-size: 13px; max-width: 100%; }
      .ph-portal-grid {
        grid-template-columns: 1fr;
        gap: 16px; margin-top: 28px;
      }
      .ph-portal-card-top { padding: 22px 22px 0; }
      .ph-portal-icon { width: 44px; height: 44px; border-radius: 11px; }
      .ph-portal-num { font-size: 52px; }
      .ph-portal-body { padding: 16px 22px 22px; }
      .ph-portal-title { font-size: 22px; }
      .ph-portal-desc { font-size: 12.5px; margin-bottom: 16px; }
      .ph-portal-feat { font-size: 11.5px; }
      .ph-portal-cta { font-size: 12px; }

      /* HIGHLIGHTS — single column */
      .ph-hi { padding: 48px 0; }
      .ph-hi-inner {
        grid-template-columns: 1fr;
        gap: 28px; padding: 0 20px;
      }
      .ph-hi-head {
        font-size: 32px; position: static;
        letter-spacing: -0.8px;
      }
      .ph-hi-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .ph-hi-item { padding: 16px 14px; border-radius: 10px; }
      .ph-hi-icon { width: 30px; height: 30px; border-radius: 7px; margin-bottom: 10px; }
      .ph-hi-title { font-size: 11.5px; }
      .ph-hi-sub { font-size: 10.5px; }

      /* FOOTER */
      .ph-footer {
        flex-direction: column; gap: 12px; text-align: center;
        padding: 20px 20px;
      }
      .ph-footer-name { font-size: 14px; }
      .ph-footer-copy { font-size: 11px; }
    }

    /* Extra-small: 360px */
    @media (max-width: 400px) {
      .ph-hero-h1 { font-size: 38px; }
      .ph-nav-badge { display: none; }
      .ph-hi-grid { grid-template-columns: 1fr; }
      .ph-stat-num { font-size: 28px; }
      .ph-stat-sfx { font-size: 16px; }
    }
  `;
  document.head.appendChild(s);
}

/* ── hooks ── */
function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}
function useCounter(target, dur = 1800, go = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!go) return;
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [go, target, dur]);
  return v;
}
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView(0.08);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

/* ── StatCell ── */
function StatCell({ target, suffix, label, color, delay }) {
  const [ref, v] = useInView(0.2);
  const count = useCounter(target, 1700, v);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="ph-stat-cell"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(14px)", transition: `opacity 0.55s ${delay}s, transform 0.55s ${delay}s` }}
    >
      <div className="ph-stat-bar" style={{ background: hov ? color : "transparent" }} />
      <div className="ph-stat-num" style={{ color: hov ? color : "var(--ink)" }}>
        {count}<span className="ph-stat-sfx" style={{ color }}>{suffix}</span>
      </div>
      <div className="ph-stat-label">{label}</div>
    </div>
  );
}

/* ── PortalCard ── */
function PortalCard({ to, number, title, desc, features, accent, accentLt, delay, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <Link to={to} className="ph-portal-card"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          borderColor: hov ? `${accent}35` : "var(--border)",
          boxShadow: hov ? `0 24px 56px rgba(0,0,0,0.11), 0 0 0 1px ${accent}20` : "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div className="ph-shimmer-line"
          style={{ background: `linear-gradient(90deg,${accent},${accentLt}80,${accent})`, backgroundSize: "200% 100%" }} />
        <div className="ph-card-glow"
          style={{ background: `radial-gradient(ellipse 80% 55% at 50% -5%, ${accent}09 0%, transparent 60%)` }} />

        <div className="ph-portal-card-top">
          <div className="ph-portal-icon"
            style={{
              background: hov ? accent : accentLt, color: hov ? "#fff" : accent,
              transform: hov ? "scale(1.1) rotate(-5deg)" : "scale(1)",
              boxShadow: hov ? `0 8px 22px ${accent}45` : "none",
            }}
          >{icon}</div>
          <div className="ph-portal-num">{number}</div>
        </div>

        <div className="ph-portal-body">
          <div className="ph-portal-title">{title}</div>
          <div className="ph-portal-desc">{desc}</div>
          <div className="ph-portal-feats">
            {features.map((f, i) => (
              <div className="ph-portal-feat" key={i}>
                <div className="ph-feat-dot" style={{ background: accent }} />
                {f}
              </div>
            ))}
          </div>
          <div className="ph-portal-cta" style={{ color: accent }}>
            Access Portal
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: hov ? "translateX(4px)" : "none", transition: "transform 0.2s" }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>

        <div className="ph-portal-bar"
          style={{ background: `linear-gradient(90deg,${accent},${accentLt})` }} />
      </Link>
    </Reveal>
  );
}

/* ════ Main ════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="ph-root">

      {/* ── NAV ── */}
      <nav className="ph-nav" style={{
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06),0 4px 24px rgba(0,0,0,0.07)" : "0 1px 0 rgba(0,0,0,0.03)",
      }}>
        <Link to="/" className="ph-nav-brand">
          <div className="ph-nav-logo">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div className="ph-nav-name">PlacementHub</div>
            <div className="ph-nav-sub">Campus Portal</div>
          </div>
        </Link>

        <div className="ph-nav-links">
          {[
            { to: "/",            label: "Home",    a: true  },
            { to: "/login",       label: "Student", a: false },
            { to: "/admin-login", label: "Admin",   a: false },
          ].map(({ to, label, a }) => (
            <Link key={to} to={to} className={`ph-nav-link${a ? " nla" : ""}`}>{label}</Link>
          ))}
        </div>

        <div className="ph-nav-badge">
          <span className="ph-nav-dot" />
          Season 2025-26 — Live
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ph-hero">
        <div className="ph-hero-grid" />
        <div className="ph-hero-glow1" />
        <div className="ph-hero-glow2" />
        <div className="ph-hero-ring" />
        <div className="ph-hero-ring2" />
        <div className="ph-hero-ring-spin" />

        <div className="ph-hero-content">
          {/* Left */}
          <div className="ph-hero-left">
            <div className="ph-hero-eyebrow">
              <span className="ph-eyebrow-line" />
              Placement Season 2025-26
            </div>
            <h1 className="ph-hero-h1">
              Your gateway<br/>to <em>career</em><br/>excellence.
            </h1>
            <p className="ph-hero-sub">
              Access resources, track applications and connect with top
              companies — all from one centralised platform built for College students.
            </p>
            <div className="ph-hero-btns">
              <Link to="/login" className="ph-btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Student Portal
              </Link>
              <Link to="/admin-login" className="ph-btn-ghost">
                Admin Portal
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="ph-hero-right" style={{ paddingLeft: 24 }}>

            {/* Companies */}
            <div className="ph-float-card" style={{ marginLeft: "auto", maxWidth: 260, animation: "ph-heroIn 0.8s 0.5s ease both" }}>
              <div className="ph-float-label">Partner Companies</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {["TCS","Infosys","Wipro","HCL","Accenture"].map(c => (
                  <div key={c} style={{
                    background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 5, padding: "3px 8px",
                    fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.72)", fontFamily: "var(--ff-body)",
                  }}>{c}</div>
                ))}
                <div style={{
                  background: "rgba(37,99,235,0.22)", border: "1px solid rgba(37,99,235,0.35)",
                  borderRadius: 5, padding: "3px 8px",
                  fontSize: 10, fontWeight: 600, color: "#93C5FD", fontFamily: "var(--ff-body)",
                }}>+83 more</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", flexShrink: 0, animation: "ph-pulse 2s ease infinite" }} />
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", fontFamily: "var(--ff-body)" }}>Actively recruiting · Season 2025-26</div>
              </div>
            </div>

            {/* Stats mini */}
            <div className="ph-float-card" style={{ maxWidth: 220, animation: "ph-heroIn 0.8s 0.65s ease both" }}>
              <div className="ph-float-label">Live Stats</div>
              {[
                { label: "Placed This Year", value: "406+",  color: "#60A5FA" },
                { label: "Placement Rate",   value: "85%",   color: "#34D399" },
                { label: "Highest Package",  value: "43 LPA",color: "#FBBF24" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "var(--ff-body)" }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "var(--ff-body)" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Next drive */}
            <div className="ph-float-card" style={{ marginLeft: "auto", maxWidth: 272, animation: "ph-heroIn 0.8s 0.80s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.82)", fontFamily: "var(--ff-body)" }}>Upcoming Drive</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.36)", fontFamily: "var(--ff-body)" }}>Applications now open</div>
                </div>
              </div>
              <div style={{
                background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 8, padding: "8px 12px",
                fontSize: 11.5, color: "#C9A84C", fontWeight: 600, fontFamily: "var(--ff-body)",
              }}>
                Infosys Campus Drive — Apr 2025
              </div>
            </div>

          </div>
        </div>

        {/* hero bottom fade */}
        <div className="ph-hero-fade" style={{
          height: 100, flexShrink: 0,
          background: "linear-gradient(to bottom, transparent, #F7F8FA)",
          position: "relative", zIndex: 4,
        }} />
      </section>

      {/* ── STATS ── */}
      <div className="ph-stats">
        <div className="ph-stats-inner">
          <StatCell delay={0}   target={406} suffix="+"    label="Students Placed"   color="#2563EB" />
          <StatCell delay={0.1} target={88}  suffix="+"    label="Partner Companies" color="#0A9080" />
          <StatCell delay={0.2} target={85}  suffix="%"    label="Placement Rate"    color="#B45309" />
          <StatCell delay={0.3} target={43}  suffix=" LPA" label="Highest Package"   color="#2563EB" />
        </div>
      </div>

      {/* ── PORTALS ── */}
      <div className="ph-portals">
        <Reveal>
          <div className="ph-section-tag"><span className="ph-tag-line" />Quick Access</div>
          <h2 className="ph-section-h2">Choose your portal</h2>
          <p className="ph-section-sub">Navigate to your dedicated space and get everything done in one place.</p>
        </Reveal>

        <div className="ph-portal-grid">
          <PortalCard
            to="/login" number="01" title="Student Portal"
            desc="Your personal hub for placement activities. Browse companies, apply for drives and track your entire journey."
            features={[
              "Browse & apply to placement drives",
              "Track application status in real-time",
              "Upload and manage your resume",
              "View company details & job descriptions",
            ]}
            accent="#2563EB" accentLt="#EBF2FD" delay={0.05}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
          />
          <PortalCard
            to="/admin-login" number="02" title="Admin Portal"
            desc="Full control over placement operations. Manage students, companies, drives and generate comprehensive reports."
            features={[
              "Manage student records & CGPA filters",
              "Post and manage company drives",
              "Review & shortlist applications",
              "Mark placed students & view analytics",
            ]}
            accent="#0A9080" accentLt="#E0F5F2" delay={0.15}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
          />
        </div>
      </div>

      {/* ── HIGHLIGHTS ── */}
      <div className="ph-hi">
        <div className="ph-hi-inner">
          <Reveal>
            <h2 className="ph-hi-head">
              Everything<br/>you need,<br/><em>all in one</em><br/>place.
            </h2>
          </Reveal>
          <div className="ph-hi-grid">
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, bg:"rgba(37,99,235,0.15)",   title:"Drive Applications",   sub:"Apply to multiple companies in one click with your saved profile" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, bg:"rgba(10,144,128,0.15)",  title:"Live Status Tracking",  sub:"Know exactly where you stand — shortlisted, selected or offered" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, bg:"rgba(201,168,76,0.15)", title:"Student Management",     sub:"TPO can manage all records, filter by CGPA and department" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, bg:"rgba(244,114,182,0.15)", title:"Announcements",           sub:"Instant notifications for new drives and placement updates" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, bg:"rgba(167,139,250,0.15)", title:"Company Profiles",        sub:"Detailed JDs, salary, role info and eligibility at a glance" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 4 12 14.01 9 11.01"/><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/></svg>, bg:"rgba(251,146,60,0.15)",  title:"Mark as Placed",        sub:"TPO marks placed students and generates final placement stats" },
            ].map(({ icon, bg, title, sub }, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="ph-hi-item">
                  <div className="ph-hi-icon" style={{ background: bg }}>{icon}</div>
                  <div className="ph-hi-title">{title}</div>
                  <div className="ph-hi-sub">{sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="ph-footer">
        <div className="ph-footer-brand">
          <div className="ph-footer-logo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span className="ph-footer-name">PlacementHub</span>
        </div>
        <div className="ph-footer-copy">© {new Date().getFullYear()} PlacementHub ·  Campus Placement Portal</div>
      </footer>

    </div>
  );
}