import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";

if (!document.getElementById("sug-styles")) {
  const s = document.createElement("style");
  s.id = "sug-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes sUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes sIn    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes sShim  { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes sPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:0.5} }
    @keyframes sBadge { from{opacity:0;transform:scale(0.5) rotate(-12deg)} to{opacity:1;transform:scale(1) rotate(0)} }
    @keyframes sCount { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fShimBtn  { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes fPulseRing{ 0%{box-shadow:0 0 0 0 rgba(37,99,235,.3)} 70%{box-shadow:0 0 0 6px rgba(37,99,235,0)} 100%{box-shadow:0 0 0 0 rgba(37,99,235,0)} }
    @keyframes fLogoIn   { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
    @keyframes fSlideR   { from{transform:translateX(-6px);opacity:0} to{transform:translateX(0);opacity:1} }

    .sug-root { display:flex; min-height:100vh; background:#F8FAFB; font-family:'Plus Jakarta Sans',sans-serif; }
    .sug-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .sug-body { flex:1; padding:32px 44px 80px; overflow-y:auto; }

    /* ── Page heading ── */
    .sug-head { margin-bottom:24px; animation:sUp .45s ease both; }
    .sug-ey   { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#3B7DED; margin-bottom:6px; display:flex; align-items:center; gap:8px; }
    .sug-ey::before { content:''; width:20px; height:2px; background:#3B7DED; border-radius:2px; }
    .sug-h1   { font-size:27px; font-weight:800; color:#0C1A2E; letter-spacing:-.6px; }
    .sug-sub  { font-size:13.5px; color:#7A8A9A; margin-top:5px; }

    /* ── Profile card ── */
    .sug-pf-card {
      display:flex; align-items:center; gap:20px;
      background:#fff; border:1px solid #E6ECF4; border-radius:18px;
      padding:22px 28px; margin-bottom:22px;
      box-shadow:0 2px 8px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.04);
      animation:sUp .45s .05s ease both; position:relative; overflow:hidden;
    }
    .sug-pf-card::after {
      content:''; position:absolute; right:-30px; top:-30px;
      width:180px; height:180px; border-radius:50%;
      background:radial-gradient(circle,rgba(59,125,237,.07) 0%,transparent 70%);
      pointer-events:none;
    }
    .sug-pf-av {
      width:56px; height:56px; border-radius:14px; flex-shrink:0; position:relative; z-index:1;
      background:linear-gradient(140deg,#1B3A6B,#3B7DED);
      display:flex; align-items:center; justify-content:center;
      font-size:19px; font-weight:800; color:#fff;
      box-shadow:0 4px 14px rgba(27,58,107,.24);
    }
    .sug-pf-info  { flex:1; min-width:0; position:relative; z-index:1; }
    .sug-pf-name  { font-size:16.5px; font-weight:800; color:#0C1A2E; margin-bottom:2px; letter-spacing:-.2px; }
    .sug-pf-email { font-size:12px; color:#9AAABB; margin-bottom:10px; }
    .sug-pf-chips { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }

    /* chips */
    .sug-chip     { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:7px; font-size:11px; font-weight:600; border:1px solid; }
    .sug-chip svg { flex-shrink:0; }
    .sug-chip-live{ display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; background:#F0FDF4; border:1px solid #BBF7D0; color:#16A34A; }
    .sug-live-dot { width:5px; height:5px; border-radius:50%; background:#22C55E; animation:sPulse 2s ease infinite; flex-shrink:0; }

    /* right stats */
    .sug-pf-stats   { display:flex; gap:22px; flex-shrink:0; position:relative; z-index:1; padding-left:22px; border-left:1px solid #EEF2F8; }
    .sug-pf-stat    { display:flex; flex-direction:column; align-items:center; min-width:52px; }
    .sug-pf-val     { font-size:23px; font-weight:800; letter-spacing:-.8px; line-height:1; animation:sCount .6s ease both; }
    .sug-pf-lbl     { font-size:9.5px; color:#9AAABB; margin-top:4px; font-weight:700; text-transform:uppercase; letter-spacing:.7px; }
    .sug-pf-divider { width:1px; background:#EEF2F8; align-self:stretch; }

    /* ── Stat strip ── */
    .sug-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; animation:sUp .45s .09s ease both; }
    .sug-sc    { background:#fff; border:1px solid #E6ECF4; border-radius:14px; padding:15px 18px; display:flex; align-items:center; gap:13px; box-shadow:0 1px 4px rgba(0,0,0,.04); transition:box-shadow .2s,transform .2s; }
    .sug-sc:hover { box-shadow:0 8px 24px rgba(0,0,0,.08); transform:translateY(-2px); }
    .sug-sc-ico { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sug-sc-val { font-size:21px; font-weight:800; color:#0C1A2E; letter-spacing:-.5px; line-height:1; }
    .sug-sc-lbl { font-size:11px; color:#7A8A9A; margin-top:2px; font-weight:500; }

    /* ── Toolbar ── */
    .sug-toolbar    { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:22px; animation:sUp .45s .11s ease both; }
    .sug-search-wrap{ position:relative; flex:1; min-width:200px; max-width:310px; }
    .sug-search-ico { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#BCC8D6; pointer-events:none; }
    .sug-search     { width:100%; height:42px; padding:0 14px 0 40px; border:1.5px solid #E6ECF4; border-radius:10px; background:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#0C1A2E; outline:none; transition:border-color .18s,box-shadow .18s; }
    .sug-search:focus { border-color:#3B7DED; box-shadow:0 0 0 3px rgba(59,125,237,.1); }
    .sug-search::placeholder { color:#BCC8D6; }
    .sug-pill       { height:42px; padding:0 18px; border-radius:10px; border:1.5px solid #E6ECF4; background:#fff; color:#637180; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:7px; transition:all .15s cubic-bezier(.34,1.56,.64,1); }
    .sug-pill:hover { border-color:#3B7DED; color:#1B3A6B; background:#EBF2FD; }
    .sug-pill.on    { background:#1B3A6B; border-color:#1B3A6B; color:#fff; box-shadow:0 3px 10px rgba(27,58,107,.22); }
    .sug-pill-n     { padding:2px 8px; border-radius:20px; font-size:10px; font-weight:800; background:rgba(255,255,255,.2); }
    .sug-pill:not(.on) .sug-pill-n { background:#EEF3FA; color:#8A9AAA; }
    .sug-count-txt  { margin-left:auto; font-size:12px; color:#9AAABB; font-weight:600; }

    /* ── Section label ── */
    .sug-section      { display:flex; align-items:center; gap:12px; margin-bottom:18px; animation:sUp .45s .13s ease both; }
    .sug-section-line { flex:1; height:1px; background:#EEF2F8; }
    .sug-section-text { font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#BBC8D6; white-space:nowrap; }

    /* ── Card grid ── */
    .sug-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }

    /* ── Match badge ── */
    .sug-badge {
      position:absolute; top:10px; right:10px; z-index:20;
      width:50px; height:50px; border-radius:50%;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      font-size:13px; font-weight:800; line-height:1;
      box-shadow:0 4px 14px rgba(0,0,0,.18);
      animation:sBadge .4s cubic-bezier(.34,1.56,.64,1) both;
      pointer-events:none;
    }
    .sug-badge-sub { font-size:8px; font-weight:700; margin-top:2px; opacity:.9; letter-spacing:.3px; }

    /* ── Skeleton ── */
    .sk { background:linear-gradient(90deg,#ECF0F4 25%,#F8FAFB 50%,#ECF0F4 75%); background-size:200% 100%; animation:sShim 1.5s ease infinite; border-radius:4px; }

    /* ── Empty ── */
    .sug-empty     { display:flex; flex-direction:column; align-items:center; padding:80px 24px; text-align:center; grid-column:1/-1; }
    .sug-empty-ico { width:60px; height:60px; border-radius:16px; background:#EBF2FD; border:1px solid #C2D6FA; display:flex; align-items:center; justify-content:center; margin-bottom:16px; color:#3B7DED; }
  `;
  document.head.appendChild(s);
}

/* ── Helpers ── */
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
const IC = ["#2563EB","#0891B2","#059669","#7C3AED","#DB2777","#D97706"];
const logoUrl   = n => { const nl=n.toLowerCase(); for(const[k,d] of Object.entries(LOGO_MAP)) if(nl.includes(k)) return `https://logo.clearbit.com/${d}`; return `https://logo.clearbit.com/${nl.replace(/\s+/g,"").replace(/[^a-z0-9]/g,"")}.com`; };
const initColor = n => IC[n.charCodeAt(0)%IC.length];
const initials  = n => n.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();

const T = { ff:"'Plus Jakarta Sans',sans-serif", ink:"#0C1A2E", ink2:"#637180", ink3:"#3D4E5C", border:"#E6ECF4", blue:"#2563EB" };
const API_URL = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL + "/api"
    : "http://localhost:5000/api",
});
const tk = () => ({ headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` } });

/* ── Chip SVG icons ── */
const ChipIcon = {
  Dept: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  Cal:  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Star: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Code: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Dot:  <svg width="5" height="5" viewBox="0 0 5 5"><circle cx="2.5" cy="2.5" r="2.5" fill="currentColor"/></svg>,
};

/* ── Stat strip SVG icons ── */
const StripIcon = {
  Great:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Good:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><rect x="2" y="9" width="20" height="13" rx="2"/><circle cx="12" cy="15" r="1" fill="currentColor"/></svg>,
  Partial: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Avg:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6"  y1="20" x2="6"  y2="14"/></svg>,
};

function matchScore(co, stu) {
  let s=0;
  const cg=Number(stu.cgpa)||0, mn=Number(co.minimumCGPA||co.minCGPA)||0;
  const ss=(stu.skills||[]).map(x=>x.toLowerCase());
  const cs=(co.skills||co.requiredSkills||[]).map(x=>x.toLowerCase());
  if(!mn||cg>=mn) s+=40; else if(cg>=mn-.5) s+=20;
  if(cs.length>0){ const m=cs.filter(k=>ss.some(x=>x.includes(k)||k.includes(x))); s+=Math.round(m.length/cs.length*60); } else s+=60;
  return Math.min(s,100);
}

function badgeStyle(score) {
  if(score>=80) return { bg:"linear-gradient(135deg,#059669,#10B981)", text:"#fff", label:"Great" };
  if(score>=55) return { bg:"linear-gradient(135deg,#D97706,#F59E0B)", text:"#fff", label:"Good"  };
  return              { bg:"linear-gradient(135deg,#DC2626,#EF4444)", text:"#fff", label:"Low"   };
}

/* ── SuggestionCard ── */
function SuggestionCard({ company, score, delay=0 }) {
  const nav = useNavigate();
  const [hov,setHov]=useState(false), [bHov,setBHov]=useState(false);
  const [press,setPress]=useState(false), [err,setErr]=useState(false), [loaded,setLoaded]=useState(false);
  const ref = useRef(null);
  const bs = badgeStyle(score);
  const logo = company.logo || logoUrl(company.companyName);
  const col  = initColor(company.companyName);
  const ini  = initials(company.companyName);

  const onMove = e => {
    if(!ref.current) return;
    const r=ref.current.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*4, y=((e.clientY-r.top)/r.height-.5)*-4;
    ref.current.style.transform=`translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
  };
  const onLeave=()=>{ setHov(false); setPress(false); if(ref.current) ref.current.style.transform="translateY(0) rotateX(0) rotateY(0)"; };

  return (
    <div style={{position:"relative",opacity:0,animation:`sIn .4s ease ${delay}s both`}}>
      {/* Match badge */}
      <div className="sug-badge" style={{background:bs.bg,color:bs.text,animationDelay:`${delay+.15}s`}}>
        <span>{score}%</span>
        <span className="sug-badge-sub">{bs.label}</span>
      </div>
      {/* Card */}
      <div
        ref={ref}
        onMouseEnter={()=>setHov(true)} onMouseLeave={onLeave} onMouseMove={onMove}
        onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}
        onClick={()=>nav(`/company/${company._id}`)}
        style={{
          fontFamily:T.ff, background:"#fff",
          border:`1.5px solid ${hov?"#93C5FD":T.border}`,
          borderRadius:14, width:"100%", overflow:"hidden",
          display:"flex", flexDirection:"row", position:"relative",
          boxShadow: press?"0 2px 6px rgba(0,0,0,.06)":hov?"0 16px 40px rgba(37,99,235,.12),0 2px 8px rgba(0,0,0,.05)":"0 1px 3px rgba(0,0,0,.04),0 4px 14px rgba(0,0,0,.04)",
          transition:"box-shadow .25s,border-color .25s,transform .25s cubic-bezier(.23,1,.32,1)",
          cursor:"pointer", transformStyle:"preserve-3d", willChange:"transform",
        }}
      >
        {/* shimmer accent */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:"linear-gradient(90deg,#1D4ED8,#3B82F6,#60A5FA)",backgroundSize:"200% 100%",opacity:hov?1:0,transform:hov?"scaleX(1)":"scaleX(0)",transformOrigin:"left",transition:"opacity .3s,transform .4s cubic-bezier(.23,1,.32,1)",zIndex:2,borderRadius:"14px 14px 0 0",animation:hov?"fShimBtn 2s linear infinite":"none"}}/>
        {/* Logo panel */}
        <div style={{width:110,flexShrink:0,minHeight:100,background:hov?"#F0F7FF":"#FAFBFC",borderRight:`1px solid ${hov?"#DBEAFE":"#F0F2F6"}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative",transition:"background .3s,border-color .3s"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 80% 80% at 50% 50%,${col}18 0%,transparent 70%)`,opacity:hov?1:0,transition:"opacity .4s ease"}}/>
          {!err ? (
            <img src={logo} alt={company.companyName} onError={()=>setErr(true)} onLoad={()=>setLoaded(true)}
              style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",objectPosition:"center",padding:16,borderRadius:10,opacity:loaded?1:0,transform:hov?"scale(1.08)":loaded?"scale(1)":"scale(.88)",transition:loaded?"transform .35s cubic-bezier(.34,1.56,.64,1),opacity .3s":"transform .4s cubic-bezier(.34,1.56,.64,1),opacity .35s",animation:loaded?"none":"fLogoIn .4s ease both"}}/>
          ) : (
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:`${col}14`,animation:"fLogoIn .35s ease both"}}>
              <span style={{fontFamily:T.ff,fontSize:28,fontWeight:800,color:col,letterSpacing:-1,lineHeight:1,transform:hov?"scale(1.1)":"scale(1)",transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",display:"inline-block"}}>{ini}</span>
            </div>
          )}
        </div>
        {/* Info panel */}
        <div style={{flex:1,padding:"18px 16px",display:"flex",flexDirection:"column",justifyContent:"center",gap:7,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:700,color:hov?"#1D4ED8":T.ink,lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",paddingRight:58,transition:"color .2s ease",animation:"fSlideR .3s ease both"}}>
            {company.companyName}
          </div>
          <div style={{fontSize:13,color:T.ink2,animation:"fSlideR .3s .05s ease both"}}>
            Package:{" "}<span style={{fontWeight:700,color:hov?T.blue:"#16A34A",transition:"color .2s"}}>{company.salary?`${company.salary} LPA`:"—"}</span>
          </div>
          {(company.minimumCGPA||company.minCGPA) && (
            <div style={{fontSize:12,color:T.ink2,animation:"fSlideR .3s .08s ease both"}}>
              Min CGPA:{" "}<span style={{fontWeight:700,color:"#1B3A6B"}}>{company.minimumCGPA||company.minCGPA}</span>
            </div>
          )}
          <button
            onMouseEnter={()=>setBHov(true)} onMouseLeave={()=>setBHov(false)}
            onClick={e=>{e.stopPropagation();nav(`/company/${company._id}`);}}
            style={{display:"inline-flex",alignItems:"center",gap:bHov?8:5,alignSelf:"flex-start",border:`1px solid ${bHov?T.blue:"#D6DCE4"}`,background:bHov?"linear-gradient(135deg,#2563EB,#3B82F6)":"#fff",borderRadius:7,padding:"5px 13px",fontFamily:T.ff,fontSize:12.5,fontWeight:600,color:bHov?"#fff":T.ink3,cursor:"pointer",boxShadow:bHov?"0 4px 14px rgba(37,99,235,.35)":"0 1px 2px rgba(0,0,0,.05)",transform:bHov?"translateY(-1px)":"none",transition:"all .2s,gap .15s",marginTop:3,animation:bHov?"fPulseRing .6s ease":"none"}}
          >
            Explore More
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{transform:bHov?"translateX(2px) scale(1.1)":"none",transition:"transform .2s cubic-bezier(.34,1.56,.64,1)",flexShrink:0}}>
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton card ── */
function SkCard() {
  return (
    <div style={{background:"#fff",border:"1.5px solid #E6ECF4",borderRadius:14,overflow:"hidden",display:"flex",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div className="sk" style={{width:110,height:100,flexShrink:0}}/>
      <div style={{flex:1,padding:"20px 16px",display:"flex",flexDirection:"column",gap:10}}>
        <div className="sk" style={{height:14,width:"58%"}}/><div className="sk" style={{height:12,width:"38%"}}/>
        <div className="sk" style={{height:11,width:"28%"}}/><div className="sk" style={{height:30,width:"44%",borderRadius:7,marginTop:4}}/>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function StudentSuggestions() {
  const [companies,setCompanies]=useState([]);
  const [student,  setStudent]  =useState(null);
  const [loading,  setLoading]  =useState(true);
  const [search,   setSearch]   =useState("");
  const [filter,   setFilter]   =useState("all");
  const [gridKey,  setGridKey]  =useState(0);

  const user  = JSON.parse(localStorage.getItem("user")||"{}");
  const inits = (user.name||"S").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  useEffect(()=>{
    Promise.all([
      axios.get(`${API_URL}/company`,tk()),
      axios.get(`${API_URL}/user/profile`,tk()).catch(()=>({data:user})),
    ]).then(([c,s])=>{setCompanies(c.data);setStudent(s.data);}).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const stu    = student||user;
  const scored = companies.map(c=>({...c,_score:matchScore(c,stu)})).sort((a,b)=>b._score-a._score);
  const great  = scored.filter(c=>c._score>=80).length;
  const good   = scored.filter(c=>c._score>=55&&c._score<80).length;
  const partial= scored.filter(c=>c._score<55).length;
  const avg    = scored.length?Math.round(scored.reduce((a,c)=>a+c._score,0)/scored.length):0;

  const displayed = scored.filter(c=>{
    if(!(c.companyName||"").toLowerCase().includes(search.toLowerCase())) return false;
    if(filter==="great")   return c._score>=80;
    if(filter==="good")    return c._score>=55&&c._score<80;
    if(filter==="partial") return c._score<55;
    return true;
  });

  const doFilter = f=>{ setFilter(f); setGridKey(k=>k+1); };
  const doSearch = v=>{ setSearch(v); setGridKey(k=>k+1); };

  const sLabel = filter==="great"  ? "Great Matches — Fully Eligible"
               : filter==="good"   ? "Good Matches — Partially Eligible"
               : filter==="partial"? "Partial Matches — Skill Gap"
               : "All Recommended Companies";

  return (
    <div className="sug-root">
      <Sidebar/>
      <div className="sug-main">
        <Navbar/>
        <div className="sug-body">

          {/* ── Heading ── */}
          <div className="sug-head">
            <div className="sug-ey">Placement Cell</div>
            <h1 className="sug-h1">Job Suggestions</h1>
            <p className="sug-sub">Companies matched to your profile — ranked by eligibility score.</p>
          </div>

          {/* ── Profile card ── */}
          <div className="sug-pf-card">
            <div className="sug-pf-av">{inits}</div>
            <div className="sug-pf-info">
              <div className="sug-pf-name">{stu.name||"Student"}</div>
              <div className="sug-pf-email">{stu.email||"student@university.edu"}</div>
              <div className="sug-pf-chips">
                {/* Department — briefcase icon */}
                {stu.department && (
                  <span className="sug-chip" style={{background:"#EBF2FD",borderColor:"#C2D6FA",color:"#1B3A6B"}}>
                    {ChipIcon.Dept} {stu.department}
                  </span>
                )}
                {/* Semester — calendar icon */}
                {stu.semester && (
                  <span className="sug-chip" style={{background:"#F5F3FF",borderColor:"#DDD6FE",color:"#6D28D9"}}>
                    {ChipIcon.Cal} Sem {stu.semester}
                  </span>
                )}
                {/* CGPA — star icon */}
                {stu.cgpa && (
                  <span className="sug-chip" style={{background:"#FEF3C7",borderColor:"#FDE68A",color:"#92400E"}}>
                    {ChipIcon.Star} {Number(stu.cgpa).toFixed(2)} CGPA
                  </span>
                )}
                {/* Skills — code icon */}
                {(stu.skills||[]).slice(0,3).map((sk,i)=>(
                  <span key={i} className="sug-chip" style={{background:"#F0FDF4",borderColor:"#BBF7D0",color:"#15803D"}}>
                    {ChipIcon.Code} {sk}
                  </span>
                ))}
                {(stu.skills||[]).length>3 && (
                  <span className="sug-chip" style={{background:"#F8FAFC",borderColor:"#E6ECF4",color:"#94A3B8"}}>
                    +{(stu.skills||[]).length-3}
                  </span>
                )}
                {/* Active live indicator */}
                <span className="sug-chip-live">
                  <span className="sug-live-dot"/>
                  Active
                </span>
              </div>
            </div>
            <div className="sug-pf-stats">
              <div className="sug-pf-stat">
                <div className="sug-pf-val" style={{color:"#16A34A"}}>{loading?"—":great}</div>
                <div className="sug-pf-lbl">Great</div>
              </div>
              <div className="sug-pf-divider"/>
              <div className="sug-pf-stat">
                <div className="sug-pf-val" style={{color:"#0C1A2E"}}>{loading?"—":scored.length}</div>
                <div className="sug-pf-lbl">Total</div>
              </div>
              <div className="sug-pf-divider"/>
              <div className="sug-pf-stat">
                <div className="sug-pf-val" style={{color:"#3B7DED"}}>{loading?"—":`${avg}%`}</div>
                <div className="sug-pf-lbl">Avg</div>
              </div>
            </div>
          </div>

          {/* ── Stat strip — all SVG icons, no emojis ── */}
          <div className="sug-strip">
            {[
              { icon:StripIcon.Great,   val:great,   lbl:"Great Match",  bg:"#F0FDF4", bc:"#BBF7D0", ic:"#16A34A" },
              { icon:StripIcon.Good,    val:good,    lbl:"Good Match",   bg:"#FEF9EC", bc:"#FDE68A", ic:"#D97706" },
              { icon:StripIcon.Partial, val:partial, lbl:"Partial Match", bg:"#FEF2F2", bc:"#FECACA", ic:"#DC2626" },
              { icon:StripIcon.Avg,     val:loading?"—":`${avg}%`, lbl:"Avg Score", bg:"#EBF2FD", bc:"#C2D6FA", ic:"#3B7DED" },
            ].map((st,i)=>(
              <div className="sug-sc" key={i}>
                <div className="sug-sc-ico" style={{background:st.bg,border:`1px solid ${st.bc}`,color:st.ic}}>
                  {st.icon}
                </div>
                <div>
                  <div className="sug-sc-val">{loading&&i<3?"—":st.val}</div>
                  <div className="sug-sc-lbl">{st.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div className="sug-toolbar">
            <div className="sug-search-wrap">
              <svg className="sug-search-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="sug-search" placeholder="Search company name…" value={search} onChange={e=>doSearch(e.target.value)}/>
            </div>
            {[
              {id:"all",    label:"All",         n:scored.length},
              {id:"great",  label:"Great Match", n:great},
              {id:"good",   label:"Good Match",  n:good},
              {id:"partial",label:"Partial",     n:partial},
            ].map(f=>(
              <button key={f.id} className={`sug-pill${filter===f.id?" on":""}`} onClick={()=>doFilter(f.id)}>
                {f.label}<span className="sug-pill-n">{f.n}</span>
              </button>
            ))}
            {!loading && <span className="sug-count-txt">{displayed.length} result{displayed.length!==1?"s":""}</span>}
          </div>

          {/* ── Section label ── */}
          <div className="sug-section">
            <div className="sug-section-line"/>
            <span className="sug-section-text">{sLabel}</span>
            <div className="sug-section-line"/>
          </div>

          {/* ── Cards ── */}
          {loading ? (
            <div className="sug-grid">{Array.from({length:6}).map((_,i)=><SkCard key={i}/>)}</div>
          ) : displayed.length===0 ? (
            <div className="sug-grid">
              <div className="sug-empty">
                <div className="sug-empty-ico">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <div style={{fontSize:15,fontWeight:700,color:"#0C1A2E",marginBottom:6}}>No companies found</div>
                <div style={{fontSize:13,color:"#7A8A9A"}}>Add more skills to your profile to improve your match score.</div>
              </div>
            </div>
          ) : (
            <div key={gridKey} className="sug-grid">
              {displayed.map((company,i)=>(
                <SuggestionCard key={company._id} company={company} score={company._score} delay={Math.min(i*.06,.5)}/>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}