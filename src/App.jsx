import { useState, useEffect } from "react";
import heroImage from "./assets/hero.jpeg";

// Corrected asset imports matching your exact file paths
import bgImage1 from "./assets/back1.jpeg";
import bgImage2 from "./assets/back2.jpeg";
import introBg1 from "./assets/b1.jpg"; // First strike bodybuilder image
import introBg2 from "./assets/b2.jpg"; // Second strike blast bodybuilder image
import Login from "./Login"; // Make sure Login.jsx is in the same folder

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

  // Active Sub-Tab Toggle for Owner Console ('active-members' or 'pending-approvals')
  const [ownerSubTab, setOwnerSubTab] = useState("active-members");

  // Gym Owner Live Member Database
  const [members, setMembers] = useState([
    { id: 1, name: "Rahul Jarali", admissionDate: "2025-12-01", planDaysLeft: 14, feesDue: 0, status: "Present" },
    { id: 2, name: "Sameer K.", admissionDate: "2026-02-15", planDaysLeft: 45, feesDue: 1500, status: "Absent" },
    { id: 3, name: "Priya M.", admissionDate: "2026-04-01", planDaysLeft: 3, feesDue: 0, status: "Present" }
  ]);

  // Automated Inbound Lead Pipeline (Stores registrations arriving from the front page)
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
    if (!joinName.trim() || !joinPhone.trim()) {
      alert("Please fill in your Name and Contact Number.");
      return;
    }

    const newApplication = {
      id: Date.now(),
      name: joinName.trim(),
      planTier: selectedModalTier,
      phone: joinPhone.trim(),
      email: "Web Portal Lead",
      dateSubmitted: new Date().toISOString().split('T')[0]
    };

    setPendingApprovals([...pendingApprovals, newApplication]);
    alert("Application successfully transmitted! Please wait until management approves your entry.");
    setJoinName("");
    setJoinPhone("");
    setShowModal(false);
  };

  const acceptApplication = (app) => {
    const newlyApprovedMember = {
      id: Date.now(),
      name: app.name,
      admissionDate: app.dateSubmitted,
      planDaysLeft: app.planTier.includes("3 Months") ? 90 : app.planTier.includes("6 Months") ? 180 : 365, 
      feesDue: 0, 
      status: "Absent"
    };

    setMembers([...members, newlyApprovedMember]);
    setPendingApprovals(pendingApprovals.filter(p => p.id !== app.id));
  };

  const rejectApplication = (id) => {
    if (confirm("Are you sure you want to dismiss this enrollment request?")) {
      setPendingApprovals(pendingApprovals.filter(p => p.id !== id));
    }
  };

  const clearManagementForms = () => {
    setEditingId(null);
    setFormName("");
    setFormDate("");
    setFormDue("");
    setFormStatus("Absent");
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formDate) return;
    const parsedDue = parseFloat(formDue) || 0;
    const defaultPlanDays = editingId ? (members.find(m => m.id === editingId)?.planDaysLeft || 90) : 90;

    if (editingId) {
      setMembers(members.map(m => m.id === editingId ? { ...m, name: formName.trim(), admissionDate: formDate, planDaysLeft: defaultPlanDays, feesDue: parsedDue, status: formStatus } : m));
    } else {
      setMembers([...members, { id: Date.now(), name: formName.trim(), admissionDate: formDate, planDaysLeft: defaultPlanDays, feesDue: parsedDue, status: formStatus }]);
    }
    clearManagementForms();
  };

  const startEditMember = (member) => {
    setEditingId(member.id);
    setFormName(member.name);
    setFormDate(member.admissionDate);
    setFormDue(member.feesDue);
    setFormStatus(member.status);
  };

  const deleteMember = (id) => {
    if (confirm("Are you sure you want to remove this member record?")) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    let bmiValue = 0;
    if (unitSystem === 'metric') {
      if (!weight || !height || weight <= 0 || height <= 0) return;
      bmiValue = (weight / ((height / 100) * (height / 100))).toFixed(1);
    } else {
      if (!weightLbs || !heightFt || weightLbs <= 0 || heightFt <= 0) return;
      const totalInches = (parseFloat(heightFt) * 12) + (parseFloat(heightIn) || 0);
      bmiValue = ((weightLbs / (totalInches * totalInches)) * 703).toFixed(1);
    }
    setBmi(bmiValue);
    if (bmiValue < 18.5) {
      setBmiMessage('Underweight 🟡');
      setBmiColor('text-yellow-400 border-yellow-500/30 bg-yellow-500/10');
      setBmiAdvice('Recommendation: Focus on a clean caloric surplus paired with heavy strength training at Varadh Gym to build solid lean muscle safely.');
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setBmiMessage('Normal Weight 🎉');
      setBmiColor('text-green-400 border-green-500/30 bg-green-500/10');
      setBmiAdvice('Recommendation: Great job! Maintain your body composition with a balanced nutrition profile and steady training cycles.');
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setBmiMessage('Overweight 🟠');
      setBmiColor('text-orange-400 border-orange-500/30 bg-orange-500/10');
      setBmiAdvice('Recommendation: Consider a slight caloric deficit. Combine high-intensity functional circuits or resistance lifting to protect mass metrics.');
    } else {
      setBmiMessage('Obese 🔴');
      setBmiColor('text-red-400 border-red-500/30 bg-red-500/10');
      setBmiAdvice('Recommendation: Prioritize steady fat-loss conditioning alongside structured resistance loading parameters under structural Varadh coaches.');
    }
  };

  const resetBmiForm = () => {
    setWeight(''); setHeight(''); setWeightLbs(''); setHeightFt(''); setHeightIn('');
    setBmi(null); setBmiMessage(''); setBmiColor(''); setBmiAdvice('');
  };

  const activeInGym = members.filter(m => m.status === "Present").length;
  const totalDueCount = members.filter(m => m.feesDue > 0).length;

  const triggerModalOpen = (tierName) => {
    setSelectedModalTier(tierName);
    setShowModal(true);
  };

  // Injection of custom animation styles
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

  if (view === "dashboard" && user) {
    if (user.role === "owner") {
      return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-900 pb-6 mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Varadh Operations Control</h2>
              <p className="text-gray-500 text-sm mt-1">Logged in as: <span className="text-red-500 font-bold">{user.name}</span></p>
            </div>
            <button onClick={handleLogout} className="px-6 py-2.5 bg-neutral-900 hover:bg-red-600 border border-neutral-800 text-sm font-bold uppercase rounded-xl transition tracking-wider">Exit Console Securely</button>
          </div>

          <div className="max-w-7xl mx-auto flex gap-4 mb-8 border-b border-neutral-900 pb-4">
            <button onClick={() => setOwnerSubTab("active-members")} className={`px-5 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition ${ownerSubTab === "active-members" ? "bg-red-500 text-white" : "bg-neutral-950 border border-neutral-900 text-gray-400 hover:text-white"}`}>🏃‍♂️ Active Roster ({members.length})</button>
            <button onClick={() => setOwnerSubTab("pending-approvals")} className={`px-5 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition flex items-center gap-2 ${ownerSubTab === "pending-approvals" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse" : "bg-neutral-950 border border-neutral-900 text-gray-400 hover:text-white"}`}>📥 Inbound Leads ({pendingApprovals.length})</button>
          </div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
            <div className="space-y-6 lg:col-span-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 text-center">
                  <span className="text-2xl">🟢</span>
                  <h3 className="text-3xl font-black mt-2 text-white">{activeInGym}</h3>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mt-1">Live Inside Gym</p>
                </div>
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 text-center">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-3xl font-black mt-2 text-red-500">{totalDueCount}</h3>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mt-1">Pending Fees Due</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-900 shadow-xl">
                <h3 className="text-xl font-extrabold mb-4 text-white">{editingId ? "✏️ Edit Member Profile" : "➕ Register New Athlete"}</h3>
                <form onSubmit={handleSaveMember} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Athlete Full Name</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Rahul J." className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Admission Date</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Fees Balance (₹)</label>
                      <input type="number" value={formDue} onChange={(e) => setFormDue(e.target.value)} placeholder="0" className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Presence Status</label>
                      <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white">
                        <option value="Absent">Absent</option>
                        <option value="Present">Present</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition">{editingId ? "Update Data Sheet" : "Commit Record"}</button>
                  </div>
                </form>
                {editingId && <button type="button" onClick={clearManagementForms} className="w-full mt-2 py-2 bg-neutral-900 border border-neutral-800 text-xs font-medium rounded-xl hover:bg-neutral-800 text-gray-400">Cancel Operations Setup</button>}
              </div>
            </div>

            <div className="lg:col-span-2 bg-neutral-950 rounded-3xl border border-neutral-900 p-6 shadow-xl overflow-hidden h-fit">
              {ownerSubTab === "active-members" ? (
                <>
                  <h3 className="text-xl font-extrabold mb-5 text-white">Live Active Member Data Sheet</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-neutral-900 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="pb-4">Name</th>
                          <th className="pb-4">Admission Date</th>
                          <th className="pb-4">Plan Status</th>
                          <th className="pb-4">Fees Tracking</th>
                          <th className="pb-4">Live Check-In</th>
                          <th className="pb-4 text-right">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900/50">
                        {members.map((member) => (
                          <tr key={member.id} className="group hover:bg-neutral-900/20 transition">
                            <td className="py-4 font-bold text-white text-base">{member.name}</td>
                            <td className="py-4 text-gray-400 font-medium">{member.admissionDate || "N/A"}</td>
                            <td className="py-4">{member.planDaysLeft === 0 ? <span className="text-red-500 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md text-xs">Expired Plan</span> : <span className="text-gray-300 font-medium">{member.planDaysLeft} Days Remaining</span>}</td>
                            <td className="py-4">{member.feesDue > 0 ? <span className="text-orange-400 font-extrabold bg-orange-500/10 px-2 py-0.5 rounded-md text-xs border border-orange-500/20">₹{member.feesDue} Unpaid</span> : <span className="text-green-400 font-bold text-xs bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">Settled Paid</span>}</td>
                            <td className="py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${member.status === "Present" ? "bg-green-500/10 text-green-400 border border-green-500/10" : "bg-neutral-900 text-gray-500 border border-neutral-800"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${member.status === "Present" ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />{member.status}
                              </span>
                            </td>
                            <td className="py-4 text-right space-x-2">
                              <button onClick={() => startEditMember(member)} className="text-xs bg-neutral-900 border border-neutral-800 hover:border-red-500/50 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white font-medium transition">Edit</button>
                              <button onClick={() => deleteMember(member.id)} className="text-xs bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-lg font-medium transition">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-extrabold mb-2 text-white">Pending Registrations Gate</h3>
                  {pendingApprovals.length === 0 ? (
                    <div className="text-center py-12 bg-black/40 rounded-2xl border border-neutral-900/50"><p className="text-gray-500 text-sm font-medium">No pending entries found.</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-neutral-900 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <th className="pb-4">Applicant</th>
                            <th className="pb-4">Selected Plan</th>
                            <th className="pb-4">Contact Info</th>
                            <th className="pb-4 text-right">Moderation Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900/50">
                          {pendingApprovals.map((app) => (
                            <tr key={app.id} className="group hover:bg-neutral-900/10 transition">
                              <td className="py-4">
                                <span className="font-extrabold text-white block text-base">{app.name}</span>
                              </td>
                              <td className="py-4 font-bold text-orange-400 text-xs tracking-wide uppercase">{app.planTier}</td>
                              <td className="py-4 text-xs font-light text-gray-400">
                                <span className="block font-medium text-gray-300">{app.phone}</span>
                              </td>
                              <td className="py-4 text-right space-x-2">
                                <button onClick={() => acceptApplication(app)} className="text-xs bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg transition tracking-wide uppercase">✅ Accept Athlete</button>
                                <button onClick={() => rejectApplication(app.id)} className="text-xs bg-neutral-900 border border-neutral-800 text-gray-500 hover:text-red-400 hover:border-red-500/20 px-3 py-1.5 rounded-lg transition">Deny</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      );
    }
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
              <path className="animate-real-crack" d="M50,50 L5,5 M50,50 L95,8 M50,50 L100,48 M50,50 L82,95 M50,50 L48,100 M50,50 L0,62 M50,50 L3,22 M50,50 L50,0 M50,50 L100,100 M50,50 L0,100" />
              <path className="animate-real-crack" d="M25,25 L10,45 M75,22 L100,5 M90,49 L100,80 M64,70 L85,100 M20,55 L0,90 M30,12 L0,0" />
              <path className="animate-real-crack" d="M50,38 C57,38 62,43 62,50 C62,57 57,62 50,62 C43,62 38,57 38,50 C38,43 43,38 50,38 Z" />
              <path className="animate-real-crack" d="M50,25 C64,25 75,36 75,50 C75,64 64,75 50,75 C36,75 25,36 25,50 C25,36 36,25 50,25 Z" />
              <path className="animate-real-crack" d="M50,10 C72,10 90,28 90,50 C90,72 72,90 50,90 C28,90 10,72 10,50 C10,28 28,10 50,10 Z" />
              <circle cx="50" cy="50" r="1.5" className="fill-white animate-ping" />
            </svg>
          )}

          {/* 💎 GEOMETRIC SHARD DRIFT OVERLAY PANELS */}
          {introPhase === "hit-2" && (
            <div className="absolute inset-0 z-40 pointer-events-none mix-blend-screen">
              <svg className="w-full h-full stroke-white/40 stroke-[0.5] fill-black/40" viewBox="0 0 100 100" preserveAspectRatio="none">
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
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white hover:opacity-90 transition">
              Varadh <span className="text-red-500">Hardcore Fitness</span>
            </h1>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase items-center">
            <a href="#home" className="hover:text-red-500 transition text-gray-300">Home</a>
            <a href="#about" className="hover:text-red-500 transition text-gray-300">About</a>
            <a href="#plans" className="hover:text-red-500 transition text-gray-300">Pricelist</a>
            <a href="#bmi" className="hover:text-red-500 transition text-gray-300">BMI Quiz</a>
            <a href="#rules" className="hover:text-red-500 transition text-gray-300">Rules</a>
            
            <a href="https://instagram.com/vinayakjinarali" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-white border border-orange-500/20 bg-orange-500/5 px-2.5 py-1.5 rounded-xl transition lowercase">
              <span>📸</span> @vinayakjinarali
            </a>

            <button onClick={() => setView("login")} className="text-white hover:text-red-500 transition border border-neutral-800 hover:border-red-500/50 px-5 py-2 rounded-xl text-xs font-extrabold bg-neutral-900/40">Portal Login</button>
          </div>

          <button onClick={() => triggerModalOpen("New Membership (3 Months)")} className="bg-red-500 px-8 py-3 rounded-xl hover:bg-red-600 transition font-extrabold text-base tracking-wide shadow-lg shadow-red-500/20">Join Now</button>
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
            <p className="text-gray-400 text-xl md:text-2xl mt-8 leading-relaxed font-normal max-w-2xl">
              Get the challenge for your strong body. Join Yamakanamaradi's elite bodybuilding hub equipped with structural parameters and specialized trainers.
            </p>
            <div className="flex flex-wrap gap-5 mt-10">
              <button onClick={() => triggerModalOpen("New Membership (3 Months)")} className="bg-red-500 px-10 py-5 rounded-xl text-lg font-black hover:scale-105 hover:bg-red-600 transition shadow-xl shadow-red-500/20">Get Started Today</button>
              <a href="#plans" className="border border-gray-800 text-gray-300 px-10 py-5 rounded-xl text-lg font-black hover:bg-white hover:text-black transition text-center">View Pricelist</a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center w-full">
            <img src={heroImage} alt="Varadh Hardcore Fitness" className="w-full max-w-md lg:max-w-xl rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-gray-900 object-cover aspect-[4/5]" />
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

        {/* Dynamic Matrix Price List Table Dashboard (MATCHING POSTER SPECIFICS EXACTLY) */}
        <section id="plans" className="py-24 px-6 md:px-12 lg:px-20 bg-black/40 backdrop-blur-sm border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-red-500 font-mono font-bold uppercase tracking-widest text-xs bg-red-500/5 border border-red-500/10 px-3 py-1 rounded-full">Official Roster</span>
              <h2 className="text-5xl md:text-6xl font-black mt-3">Gym <span className="text-red-500">Pricelist</span></h2>
              <p className="text-gray-500 mt-3 text-sm font-light">Select your preferred duration tier parameters to initialize authorization.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* Main Matrix Table */}
              <div className="lg:col-span-2 bg-black/60 border border-neutral-900 rounded-3xl p-6 md:p-8 backdrop-blur-md overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-neutral-800 text-gray-500 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-4">Membership Tiers</th>
                      <th className="pb-4 text-center">3 Months</th>
                      <th className="pb-4 text-center">6 Months</th>
                      <th className="pb-4 text-center">1 Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-medium">
                    <tr className="hover:bg-neutral-900/20 transition">
                      <td className="py-5 text-white font-extrabold text-base">New Membership</td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("New Membership (3 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹2500</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("New Membership (6 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹4000</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("New Membership (1 Year)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹6500</button></td>
                    </tr>
                    <tr className="hover:bg-neutral-900/20 transition">
                      <td className="py-5 text-white font-extrabold text-base">Regular Membership</td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Regular Membership (3 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹2000</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Regular Membership (6 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹3500</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Regular Membership (1 Year)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹6000</button></td>
                    </tr>
                    <tr className="hover:bg-neutral-900/20 transition">
                      <td className="py-5 text-white font-extrabold text-base">With Treadmill</td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("With Treadmill (3 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹3000</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("With Treadmill (6 Months)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹5000</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("With Treadmill (1 Year)")} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 font-black rounded-xl hover:bg-red-500 hover:text-white transition">₹9000</button></td>
                    </tr>
                    <tr className="bg-red-500/5 hover:bg-red-500/10 transition border-t border-red-500/20">
                      <td className="py-5 text-yellow-500 font-black text-base pl-2">⭐ Personal Training</td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Personal Training (3 Months)")} className="px-4 py-2 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition">₹12000</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Personal Training (6 Months)")} className="px-4 py-2 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition">₹17000</button></td>
                      <td className="py-5 text-center"><button onClick={() => triggerModalOpen("Personal Training (1 Year)")} className="px-4 py-2 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition">₹29000</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Timing Schedule Parameters Block */}
              <div className="bg-neutral-950/90 border border-neutral-900 rounded-3xl p-6 shadow-xl space-y-6">
                <h3 className="text-xl font-black text-white tracking-tight border-b border-neutral-900 pb-3">⏱️ Gym Timing</h3>
                
                <div className="space-y-4">
                  <div className="bg-black p-4 rounded-2xl border border-neutral-900 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase block">Morning Shift</span>
                      <span className="text-xl font-black text-white mt-1 block">05:00 am - 10:00 am</span>
                    </div>
                    <span className="text-2xl">⏰</span>
                  </div>

                  <div className="bg-black p-4 rounded-2xl border border-neutral-900 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase block">Evening Shift</span>
                      <span className="text-xl font-black text-white mt-1 block">05:00 pm - 10:00 pm</span>
                    </div>
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center text-xs font-black uppercase tracking-wider">
                  ❌ Every Sunday is Holiday
                </div>

                <div className="pt-2 border-t border-neutral-900">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">PT Included Features:</span>
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-400 font-medium">
                    {["Fat Loss", "Muscle Gain", "Strength Building", "General Fitness", "Cardio", "Basic Diets"].map(f => (
                      <span key={f} className="bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800/60">*{f}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Advanced BMI Calculator Section */}
        <section id="bmi" className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-3">📊 Metric Optimization</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-5">Check Your <span className="text-red-500">BMI Composition</span></h2>
              <p className="text-gray-400 leading-relaxed mb-8 text-lg font-light">Input dimensions to check custom advice matching our gym frameworks.</p>
              <div className="space-y-3.5 text-base text-gray-400 max-w-md bg-neutral-950 p-6 rounded-2xl border border-neutral-900">
                <div className="flex justify-between border-b border-neutral-900 pb-2"><span>Underweight</span> <span className="text-yellow-400 font-bold">&lt; 18.5</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-2"><span>Normal Weight</span> <span className="text-green-400 font-bold">18.5 – 24.9</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-2"><span>Overweight</span> <span className="text-orange-400 font-bold">25.0 – 29.9</span></div>
                <div className="flex justify-between pb-1"><span>Obese</span> <span className="text-red-400 font-bold">30.0+</span></div>
              </div>
            </div>
            <div className="bg-neutral-950/90 border border-neutral-900 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
              <div className="flex bg-black p-1.5 rounded-xl mb-6 border border-neutral-900">
                <button type="button" onClick={() => { setUnitSystem('metric'); resetBmiForm(); }} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${unitSystem === 'metric' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>Metric (kg/cm)</button>
                <button type="button" onClick={() => { setUnitSystem('imperial'); resetBmiForm(); }} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${unitSystem === 'imperial' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>Imperial (lbs/ft)</button>
              </div>
              <form onSubmit={calculateBMI} className="space-y-5">
                {unitSystem === 'metric' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Weight (kg)</label>
                      <input type="number" step="any" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="w-full p-4 rounded-xl bg-black border border-neutral-800 focus:border-red-500 outline-none text-base text-white transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Height (cm)</label>
                      <input type="number" step="any" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="w-full p-4 rounded-xl bg-black border border-neutral-800 focus:border-red-500 outline-none text-base text-white transition" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Weight (lbs)</label>
                      <input type="number" step="any" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} placeholder="155" className="w-full p-4 rounded-xl bg-black border border-neutral-800 focus:border-red-500 outline-none text-base text-white transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Height Measurements</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="Feet (ft)" className="w-full p-4 rounded-xl bg-black border border-neutral-800 focus:border-red-500 outline-none text-base text-white transition" />
                        <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="Inches (in)" className="w-full p-4 rounded-xl bg-black border border-neutral-800 focus:border-red-500 outline-none text-base text-white transition" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black p-4 rounded-xl hover:opacity-95 transition text-base uppercase tracking-wider">Calculate</button>
                  <button type="button" onClick={resetBmiForm} className="px-6 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-base font-bold rounded-xl transition">Reset</button>
                </div>
              </form>
              {bmi && (
                <div className={`mt-6 p-6 rounded-2xl border text-center ${bmiColor} transition`}>
                  <h3 className="text-5xl font-black my-2">{bmi}</h3>
                  <p className="font-black text-base uppercase">{bmiMessage}</p>
                  <p className="text-sm text-gray-300 mt-4 text-left leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5 font-light">{bmiAdvice}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* OFFICIAL GYM RULES AND REGULATIONS SECTION */}
        <section id="rules" className="py-24 px-6 md:px-12 lg:px-20 bg-neutral-950/60 border-t border-neutral-900 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-3">📋 Operational Mandates</p>
              <h2 className="text-5xl md:text-6xl font-black">Gym Rules & Regulations</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Return Weights to Rack",
                "Never Slam or Drop Weights",
                "Use a Supporter when Lifting",
                "Follow The gym Dress-code",
                "Always Bring a Towel and Water",
                "Don't Bring Outside Foods",
                "Children Not Allowed"
              ].map((rule, idx) => (
                <div key={idx} className="bg-black/40 border border-neutral-900 rounded-2xl p-5 flex items-center gap-4 transition duration-300 hover:border-red-500/30">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0 shadow-[0_0_8px_#ef4444]" />
                  <span className="text-gray-200 text-sm font-extrabold uppercase tracking-wide text-xs">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RE-ALIGNED CONTACT BLOCKS */}
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-black/40 backdrop-blur-sm border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 flex items-start gap-4">
                <div className="text-3xl bg-neutral-900 p-3 rounded-xl">📞</div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-wider mb-1">Phone Contact</h4>
                  <p className="text-gray-400 text-sm font-medium">+91 99729 99733</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 flex items-start gap-4">
                <div className="text-3xl bg-neutral-900 p-3 rounded-xl">📸</div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-wider mb-1">Instagram handle</h4>
                  <a href="https://instagram.com/vinayakjinarali" target="_blank" rel="noopener noreferrer" className="text-orange-400 text-sm font-bold block hover:underline mt-0.5">@vinayakjinarali</a>
                </div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
                <div className="text-3xl bg-neutral-900 p-3 rounded-xl">🏢</div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-wider mb-1">Location Support</h4>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">Main Fitness Avenue Hub, Beside Dugani Complex, Dairy Road, Yamakanmaradi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FULL MULTI-COLUMN FOOTER SYSTEM WITH MAIN LINKS AND BOTTOM COPYRIGHT CLOSURE LINE */}
        <footer className="bg-black/90 border-t border-neutral-900 pt-16 pb-8 px-6 md:px-12 lg:px-20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-base text-gray-400">
            <div className="space-y-4">
              <h3 className="text-white text-xl font-black tracking-tight">Varadh Hardcore Fitness</h3>
              <p className="text-sm font-light leading-relaxed">Providing high-grade structural setups, elite fitness education, and pristine equipment tracking frameworks.</p>
              <p className="text-[11px] text-gray-600 font-mono">GSTIN: 29AUDPJ4934B1ZT</p>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#home" className="hover:text-red-500 transition">Overview</a></li>
                <li><a href="#about" className="hover:text-red-500 transition">Amenities</a></li>
                <li><a href="#plans" className="hover:text-red-500 transition">Access Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4">Operational Slots</h4>
              <p className="text-sm font-light">Monday – Saturday:<br />5:00 AM – 10:00 AM<br />5:00 PM – 10:00 PM</p>
              <p className="text-sm font-bold text-red-500 mt-3">Sunday:<br />HOLIDAY (Closed)</p>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4">Location Support</h4>
              <p className="text-xs font-light">Main Fitness Avenue Hub,<br />Beside Dugani Complex, Dairy Road,<br />Yamakanmaradi</p>
              <p className="text-xs text-red-500 font-bold mt-2">Mob: +91 99729 99733</p>
              <a href="https://instagram.com/vinayakjinarali" target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:underline block mt-1">📸 @vinayakjinarali</a>
            </div>
          </div>

          <div className="max-w-7xl mx-auto text-center border-t border-neutral-900 mt-12 pt-8 text-xs text-gray-600 font-bold tracking-wide">
            &copy; 2026 Varadh Fitness Gym Corporation. All rights reserved. Built for Elite Human Performance.
          </div>
        </footer>

        {/* DYNAMIC WORKFLOW MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-[2px] shadow-2xl">
              <div className="bg-neutral-950 rounded-3xl p-6 md:p-8">
                
                <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white text-2xl transition">&times;</button>
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🏋️‍♂️</div>
                  <h2 className="text-3xl font-black tracking-tight text-white">Join <span className="text-red-500">Varadh Fitness</span></h2>
                  <p className="text-gray-400 text-xs mt-1 font-light">Submit details to request tier admission clearance.</p>
                </div>

                <form className="space-y-4" onSubmit={handlePublicRegistrationSubmit}>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-500">Full Name</label>
                    <input type="text" placeholder="Enter full name" required value={joinName} onChange={(e) => setJoinName(e.target.value)} className="w-full p-3.5 rounded-xl bg-black border border-neutral-900 focus:border-red-500 outline-none text-sm text-white" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-500">Phone Number</label>
                    <input type="tel" placeholder="Enter contact number" required value={joinPhone} onChange={(e) => setJoinPhone(e.target.value)} className="w-full p-3.5 rounded-xl bg-black border border-neutral-900 focus:border-red-500 outline-none text-sm text-white" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-gray-500">Membership Package Parameters</label>
                    <select value={selectedModalTier} onChange={(e) => setSelectedModalTier(e.target.value)} className="w-full p-3.5 rounded-xl bg-black border border-neutral-900 focus:border-red-500 outline-none text-sm text-white text-gray-300 font-bold">
                      <optgroup label="New Membership">
                        <option value="New Membership (3 Months) - ₹2500">New Membership (3 Mos) - ₹2500</option>
                        <option value="New Membership (6 Months) - ₹4000">New Membership (6 Mos) - ₹4000</option>
                        <option value="New Membership (1 Year) - ₹6500">New Membership (1 Yr) - ₹6500</option>
                      </optgroup>
                      <optgroup label="Regular Membership">
                        <option value="Regular Membership (3 Months) - ₹2000">Regular Membership (3 Mos) - ₹2000</option>
                        <option value="Regular Membership (6 Months) - ₹3500">Regular Membership (6 Mos) - ₹3500</option>
                        <option value="Regular Membership (1 Year) - ₹6000">Regular Membership (1 Yr) - ₹6000</option>
                      </optgroup>
                      <optgroup label="With Treadmill">
                        <option value="With Treadmill (3 Months) - ₹3000">With Treadmill (3 Mos) - ₹3000</option>
                        <option value="With Treadmill (6 Months) - ₹5000">With Treadmill (6 Mos) - ₹5000</option>
                        <option value="With Treadmill (1 Year) - ₹9000">With Treadmill (1 Yr) - ₹9000</option>
                      </optgroup>
                      <optgroup label="Personal Training">
                        <option value="Personal Training (3 Months) - ₹12000">Personal Training (3 Mos) - ₹12000</option>
                        <option value="Personal Training (6 Months) - ₹17000">Personal Training (6 Mos) - ₹17000</option>
                        <option value="Personal Training (1 Year) - ₹29000">Personal Training (1 Yr) - ₹29000</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-black uppercase tracking-widest transition shadow-lg">Request Admission 🚀</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;