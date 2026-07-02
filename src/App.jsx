import { useState, useEffect } from "react";
import heroImage from "./assets/hero.jpeg";

// Corrected asset imports matching your exact file paths
import bgImage1 from "./assets/back1.jpeg";
import bgImage2 from "./assets/back2.jpeg";
import introBg1 from "./assets/b1.jpg"; // First strike bodybuilder image
import introBg2 from "./assets/b2.jpg"; // Second strike blast bodybuilder image
import Login from "./Login"; 

const watermarkImages = [bgImage1, bgImage2];

function App() {
  // 1. TOP LEVEL STATE DECLARATIONS
  const [view, setView] = useState("landing"); 
  const [user, setUser] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // CINEMATIC SHATTERING TIMELINE STATES
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState("idle"); // 'idle' | 'hit-1' | 'hit-2'

  // Active Sub-Tab Toggle for Owner Console
  const [ownerSubTab, setOwnerSubTab] = useState("active-members");

  // Gym Owner Live Member Database
  const [members, setMembers] = useState([
    { id: 1, name: "Rahul Jarali", admissionDate: "2025-12-01", planDaysLeft: 14, feesDue: 0, status: "Present" },
    { id: 2, name: "Sameer K.", admissionDate: "2026-02-15", planDaysLeft: 45, feesDue: 1500, status: "Absent" },
    { id: 3, name: "Priya M.", admissionDate: "2026-04-01", planDaysLeft: 3, feesDue: 0, status: "Present" }
  ]);

  // Automated Inbound Lead Pipeline
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 101, name: "Amit Shah", planTier: "Regular (3 Months)", phone: "9845012345", email: "amit@gmail.com", dateSubmitted: "2026-07-01" }
  ]);

  // DEDICATED PUBLIC REGISTRATION MODAL STATES
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [selectedModalTier, setSelectedModalTier] = useState("New Membership (3 Months)");

  // Backend Desk Roster Management input tracking states
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState(""); 
  const [formDue, setFormDue] = useState("");
  const [formStatus, setFormStatus] = useState("Absent");

  const [editingId, setEditingId] = useState(null);

  // BMI Calculator State
  const [unitSystem, setUnitSystem] = useState('metric'); 
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState(''); 
  const [weightLbs, setWeightLbs] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  
  const [bmi, setBmi] = useState(null);
  const [bmiMessage, setBmiMessage] = useState('');
  const [bmiColor, setBmiColor] = useState('');
  const [bmiAdvice, setBmiAdvice] = useState('');

  // Background Watermark Slideshow Timer Loop
  useEffect(() => {
    if (watermarkImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % watermarkImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fixed execution handler loop with rapid smooth timings
  const startCinematicSequence = () => {
    if (introPhase !== "idle") return;
    
    // First bodybuilder hits screen (b1.jpg + cracks load)
    setIntroPhase("hit-1");

    // Second bodybuilder slams screen (b2.jpg + full inversion flash blast)
    setTimeout(() => {
      setIntroPhase("hit-2");
    }, 800);

    // Shatter screen doors completely and launch landing layout safely
    setTimeout(() => {
      setShowIntro(false);
    }, 1800);
  };

  // Operations handlers
  const handleLoginSuccess = (userData) => {
    setView("dashboard");
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  const handlePublicRegistrationSubmit = (e) => {
    e.preventDefault();
    if (!joinName.trim() || !joinPhone.trim()) return;
    const newApplication = {
      id: Date.now(),
      name: joinName.trim(),
      planTier: selectedModalTier,
      phone: joinPhone.trim(),
      email: "Web Portal Lead",
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    setPendingApprovals([...pendingApprovals, newApplication]);
    setShowModal(false);
  };

  const triggerModalOpen = (tierName) => {
    setSelectedModalTier(tierName);
    setShowModal(true);
  };

  // Injection of custom realistic physics-based glass animations
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @keyframes neonPulse {
        0%, 100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
        50% { box-shadow: 0 0 35px rgba(239, 68, 68, 0.6); border-color: #ef4444; }
      }
      @keyframes dynamicAura {
        0%, 100% { filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.3)); }
        50% { filter: drop-shadow(0 0 40px rgba(239, 68, 68, 0.7)); }
      }
      @keyframes realShake {
        0%, 100% { transform: translate(0, 0); }
        20% { transform: translate(-5px, 4px) rotate(-0.5deg); }
        40% { transform: translate(4px, -4px) scale(1.01); }
        60% { transform: translate(-4px, -2px) rotate(0.5deg); }
        80% { transform: translate(4px, 3px); }
      }
      @keyframes realisticCrack {
        0% { stroke-dashoffset: 1500; opacity: 0; filter: drop-shadow(0 0 0px #fff); }
        5% { opacity: 1; }
        100% { stroke-dashoffset: 0; opacity: 1; filter: drop-shadow(0 0 4px rgba(255,255,255,0.6)); }
      }
      @keyframes completeShatterBlast {
        0% { transform: scale(1); filter: brightness(1) blur(0px); opacity: 1; }
        20% { transform: scale(1.03); filter: brightness(3) contrast(1.5); }
        100% { transform: scale(1.3) rotate(2deg); opacity: 0; filter: brightness(10) blur(30px); }
      }
      @keyframes pieceDriftOut {
        0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)) scale(0.8) rotate(var(--dr)); opacity: 0; filter: blur(5px); }
      }
      .animate-neon-pulse { animation: neonPulse 2s infinite ease-in-out; }
      .animate-real-shake { animation: realShake 0.1s infinite linear; }
      .animate-real-crack { stroke-dasharray: 1500; animation: realisticCrack 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
      .animate-final-blast { animation: completeShatterBlast 1s forwards cubic-bezier(0.25, 1, 0.5, 1); }
      .glass-shard-drift { animation: pieceDriftOut 0.9s cubic-bezier(0.1, 0.8, 0.2, 1) forwards; transform-origin: center; }
    `;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  if (view === "login") {
    return <Login onLoginSuccess={handleLoginSuccess} onBackToHome={() => setView("landing")} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white antialiased relative overflow-x-hidden">
      
      {/* 🎬 HYPER-REALISTIC INTRO GATE */}
      {showIntro && view === "landing" && (
        <div className={`fixed inset-0 bg-black flex flex-col justify-center items-center z-[999999] overflow-hidden select-none transition-all ${
          introPhase === "hit-1" ? "animate-real-shake" : introPhase === "hit-2" ? "animate-final-blast animate-real-shake" : ""
        }`}>
          
          {/* LAYER 1: First strike image display (b1.jpg) */}
          <div 
            style={{ backgroundImage: `url(${introBg1})` }}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
              introPhase === "hit-1" ? "opacity-70 scale-105 contrast-125 filter saturate-150 animate-dynamic-aura" : introPhase === "idle" ? "opacity-25 filter grayscale blur-[1px]" : "opacity-0"
            }`}
          />

          {/* LAYER 2: Second strike blast image display (b2.jpg) */}
          <div 
            style={{ backgroundImage: `url(${introBg2})` }}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
              introPhase === "hit-2" ? "opacity-95 scale-110 contrast-200 filter hue-rotate-15" : "opacity-0"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90 z-10" />

          {/* ⚡ DETAILED MULTI-POINT SVG GLASS CRACK MATRIX OVERLAY */}
          {introPhase !== "idle" && (
            <svg className="absolute inset-0 w-full h-full z-50 pointer-events-none stroke-white/90 stroke-[2.5] fill-none mix-blend-screen" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Core Radial Sharp Fractures radiating outward from central blast impact point (50,50) */}
              <path className="animate-real-crack" d="M50,50 L5,5 M50,50 L95,8 M50,50 L100,48 M50,50 L82,95 M50,50 L48,100 M50,50 L0,62 M50,50 L3,22 M50,50 L50,0 M50,50 L100,100 M50,50 L0,100" />
              
              {/* Web Extensions (Spiderweb branches) */}
              <path className="animate-real-crack" d="M25,25 L10,45 M75,22 L100,5 M90,49 L100,80 M64,70 L85,100 M20,55 L0,90 M30,12 L0,0" />
              
              {/* Concentric Shatter Rings (Impact Stress Webbing Circles) */}
              <path className="animate-real-crack" d="M50,38 C57,38 62,43 62,50 C62,57 57,62 50,62 C43,62 38,57 38,50 C38,43 43,38 50,38 Z" />
              <path className="animate-real-crack" d="M50,25 C64,25 75,36 75,50 C75,64 64,75 50,75 C36,75 25,36 25,50 C25,36 36,25 50,25 Z" />
              <path className="animate-real-crack" d="M50,10 C72,10 90,28 90,50 C90,72 72,90 50,90 C28,90 10,72 10,50 C10,28 28,10 50,10 Z" />

              {/* Glowing Impact Center Point */}
              <circle cx="50" cy="50" r="1.5" className="fill-white animate-ping" />
            </svg>
          )}

          {/* 💎 HIGH-REALISM GEOMETRIC SHARD BLACKOUT DRIFT PANELS (Flashes during Hit-2 Blast) */}
          {introPhase === "hit-2" && (
            <div className="absolute inset-0 z-40 pointer-events-none mix-blend-screen">
              <svg className="w-full h-full stroke-white/40 stroke-[0.5] fill-black/40" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Individual geometric polygons breaking away with randomized directional CSS physics drift metrics */}
                <polygon points="50,50 25,25 50,38" className="glass-shard-drift" style={{ "--dx": "-30px", "--dy": "-40px", "--dr": "-45deg" }} />
                <polygon points="50,50 50,38 75,25" className="glass-shard-drift" style={{ "--dx": "40px", "--dy": "-20px", "--dr": "60deg" }} />
                <polygon points="50,50 75,25 90,50" className="glass-shard-drift" style={{ "--dx": "50px", "--dy": "10px", "--dr": "30deg" }} />
                <polygon points="50,50 90,50 75,75" className="glass-shard-drift" style={{ "--dx": "30px", "--dy": "50px", "--dr": "90deg" }} />
                <polygon points="50,50 75,75 50,90" className="glass-shard-drift" style={{ "--dx": "-10px", "--dy": "60px", "--dr": "-20deg" }} />
                <polygon points="50,50 50,90 25,75" className="glass-shard-drift" style={{ "--dx": "-40px", "--dy": "45px", "--dr": "-80deg" }} />
                <polygon points="50,50 25,75 10,50" className="glass-shard-drift" style={{ "--dx": "-60px", "--dy": "-10px", "--dr": "15deg" }} />
              </svg>
            </div>
          )}

          {/* Welcome Text Content Block */}
          <div className={`relative z-20 text-center px-4 transition-all duration-300 ${
            introPhase !== "idle" ? "scale-90 blur-xl opacity-0 pointer-events-none" : "scale-100 opacity-100"
          }`}>
            <span className="text-xs md:text-sm font-mono text-red-500 font-black tracking-[0.5em] uppercase block mb-4 animate-pulse">
              ⚡ UNLEASH YOUR DEMON BACK ⚡
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
              VARADH<br />
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                HARDCORE
              </span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm tracking-widest uppercase font-bold mt-4 mb-12 opacity-60">
              YAMAKANAMARADI • EST. 2026
            </p>
            <button 
              onClick={startCinematicSequence}
              className="px-12 py-5 bg-black/40 text-white font-black text-sm md:text-base rounded-2xl tracking-[0.25em] uppercase border border-neutral-800 hover:border-red-500 hover:text-red-500 transition-all duration-300 animate-neon-pulse shadow-lg shadow-black/80"
            >
              ENTER THE ARENA 🔥
            </button>
          </div>

          <div className="absolute bottom-6 text-[10px] text-gray-700 font-mono tracking-widest z-20 uppercase">
            BESIDE DUGANI COMPLEX • DAIRY ROAD
          </div>
        </div>
      )}

      {/* BACKGROUND WATERMARK SLIDESHOW */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {watermarkImages.map((imgSrc, index) => (
          <div key={index} style={{ backgroundImage: `url(${imgSrc})` }} className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? "opacity-[0.30]" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black opacity-90" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-900">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Prop/Trainer: Vinayak Jinarali</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Varadh <span className="text-red-500">Hardcore Fitness</span>
            </h1>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase items-center">
            <a href="#home" className="hover:text-red-500 transition text-gray-300">Home</a>
            <a href="#about" className="hover:text-red-500 transition text-gray-300">About</a>
            <a href="#plans" className="hover:text-red-500 transition text-gray-300">Pricelist</a>
            <a href="#bmi" className="hover:text-red-500 transition text-gray-300">BMI Quiz</a>
            <a href="#rules" className="hover:text-red-500 transition text-gray-300">Rules</a>
            <button onClick={() => setView("login")} className="text-white hover:text-red-500 transition border border-neutral-800 hover:border-red-500/50 px-5 py-2 rounded-xl text-xs font-extrabold bg-neutral-900/40">Portal Login</button>
          </div>
          <button onClick={() => triggerModalOpen("New Membership (3 Months)")} className="bg-red-500 px-8 py-3 rounded-xl hover:bg-red-600 transition font-extrabold text-base tracking-wide">Join Now</button>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-16 gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <p className="text-red-500 font-black text-sm md:text-base tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="animate-pulse">🔥</span> INCREASE YOUR MUSCLE POWER
            </p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter uppercase">
              Varadh<br />
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Hardcore Fitness</span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl mt-8 leading-relaxed max-w-2xl">
              Get the challenge for your strong body. Join Yamakanamaradi's elite bodybuilding hub equipped with structural parameters and specialized trainers.
            </p>
            <div className="flex flex-wrap gap-5 mt-10">
              <button onClick={() => triggerModalOpen("New Membership (3 Months)")} className="bg-red-500 px-10 py-5 rounded-xl text-lg font-black hover:scale-105 hover:bg-red-600 transition">Get Started Today</button>
              <a href="#plans" className="border border-gray-800 text-gray-300 px-10 py-5 rounded-xl text-lg font-black hover:bg-white hover:text-black transition text-center">View Pricelist</a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center w-full">
            <img src={heroImage} alt="Varadh Hardcore Fitness" className="w-full max-w-md lg:max-w-xl rounded-3xl border border-gray-900 object-cover aspect-[4/5]" />
          </div>
        </section>

        {/* Why Choose Varadh Hardcore Fitness Content Cards */}
        <section id="about" className="py-24 px-6 md:px-12 lg:px-20 bg-neutral-950/40 backdrop-blur-sm border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight">Why Choose <span className="text-red-500">Varadh Hardcore Fitness?</span></h2>
              <p className="text-gray-400 mt-5 text-lg md:text-xl font-normal">We provide everything you need to break barriers, smash PRs, and sustain long-term peak physical conditioning.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
              {[
                { icon: "🏋️", title: "Modern Equipment", desc: "Latest biomechanically optimized fitness machines and premium free weights." },
                { icon: "👨‍🏫", title: "Expert Personalities", desc: "Certified elite trainers to map out your form, safety, and routine structures." },
                { icon: "🕒", title: "Flexible Timings", desc: "Fully operational slots running smoothly through early mornings and late nights." },
                { icon: "🥗", title: "Nutrition Guidance", desc: "Personalized macro targets, meal planning support, and nutrition advice." }
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-900/60 rounded-2xl p-8 hover:-translate-y-2 transition duration-300 border border-neutral-900 hover:border-red-500/40 group backdrop-blur-md">
                  <div className="text-5xl bg-neutral-900 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition">{item.icon}</div>
                  <h3 className="text-2xl font-extrabold mt-6 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-base mt-3 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Matrix Price List Table Dashboard */}
        <section id="plans" className="py-24 px-6 md:px-12 lg:px-20 bg-black/40 backdrop-blur-sm border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-5xl md:text-6xl font-black mt-3">Gym <span className="text-red-500">Pricelist</span></h2>
            </div>
            <div className="bg-black/60 border border-neutral-900 rounded-3xl p-8 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-800 text-gray-500 text-xs font-bold uppercase">
                    <th className="pb-4">Membership Tiers</th>
                    <th className="pb-4 text-center">3 Months</th>
                    <th className="pb-4 text-center">6 Months</th>
                    <th className="pb-4 text-center">1 Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-medium">
                  <tr className="hover:bg-neutral-900/20 transition">
                    <td className="py-5 text-white font-extrabold text-base">New Membership</td>
                    <td className="py-5 text-center"><button onClick={() => triggerModalOpen("New Membership (3 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl">₹2500</button></td>
                    <td className="py-5 text-center"><button onClick={() => triggerModalOpen("New Membership (6 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl">₹4000</button></td>
                    <td className="py-5 text-center"><button onClick={() => triggerModalOpen("New Membership (1 Year)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl">₹6500</button></td>
                  </tr>
                  <tr className="hover:bg-neutral-900/20 transition">
                    <td className="py-5 text-white font-extrabold text-base">Regular Membership</td>
                    <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Regular Membership (3 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl">₹2000</button></td>
                    <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Regular Membership (6 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl">₹3500</button></td>
                    <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Regular Membership (1 Year)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl">₹6000</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FULL MULTI-COLUMN FOOTER SYSTEM */}
        <footer className="bg-black/90 border-t border-neutral-900 pt-16 pb-8 px-6 md:px-12 lg:px-20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-base text-gray-400">
            <div>
              <h3 className="text-white text-xl font-black">Varadh Hardcore Fitness</h3>
              <p className="text-sm font-light mt-2">Providing high-grade structural setups, elite fitness education, and pristine equipment tracking frameworks.</p>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase mb-4">Operational Slots</h4>
              <p className="text-sm">Monday – Saturday:<br />5:00 AM – 10:00 AM<br />5:00 PM – 10:00 PM</p>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase mb-4">Location Support</h4>
              <p className="text-xs">Main Fitness Avenue Hub,<br />Beside Dugani Complex, Dairy Road,<br />Yamakanmaradi</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;