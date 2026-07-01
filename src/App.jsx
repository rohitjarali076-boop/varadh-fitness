import { useState, useEffect } from "react";
import heroImage from "./assets/hero.jpeg";

// Clean paths after renaming your background files
import bgImage1 from "./assets/back1.jpeg";
import bgImage2 from "./assets/back2.jpeg";
import Login from "./Login"; // Make sure Login.jsx is in the same folder

const watermarkImages = [bgImage1, bgImage2];

function App() {
  // 1. TOP LEVEL STATE DECLARATIONS
  const [view, setView] = useState("landing"); 
  const [user, setUser] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

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
    { id: 101, name: "Amit Shah", planTier: "Premium Plan", phone: "9845012345", email: "amit@gmail.com", dateSubmitted: "2026-07-01" }
  ]);

  // CORRECTED DEDICATED PUBLIC REGISTRATION MODAL STATES
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [selectedModalTier, setSelectedModalTier] = useState("Premium");

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

  // Operations handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  // Process a public join form request submission
  const handlePublicRegistrationSubmit = (e) => {
    e.preventDefault();
    if (!joinName.trim() || !joinPhone.trim()) {
      alert("Please fill in your Name and Contact Number to submit your request.");
      return;
    }

    const newApplication = {
      id: Date.now(),
      name: joinName.trim(),
      planTier: `${selectedModalTier} Plan`,
      phone: joinPhone.trim(),
      email: "Web Portal Lead",
      dateSubmitted: new Date().toISOString().split('T')[0]
    };

    setPendingApprovals([...pendingApprovals, newApplication]);
    alert("Application successfully transmitted! Please wait until management approves your entry from the dashboard desk.");
    
    // Clear registration fields completely
    setJoinName("");
    setJoinPhone("");
    setShowModal(false);
  };

  // Pipeline Logic: Owner accepts a pending request
  const acceptApplication = (app) => {
    const newlyApprovedMember = {
      id: Date.now(),
      name: app.name,
      admissionDate: app.dateSubmitted,
      planDaysLeft: 30, 
      feesDue: 0, 
      status: "Absent"
    };

    setMembers([...members, newlyApprovedMember]);
    setPendingApprovals(pendingApprovals.filter(p => p.id !== app.id));
  };

  // Pipeline Logic: Owner rejects a pending request
  const rejectApplication = (id) => {
    if (confirm("Are you sure you want to dismiss this enrollment request?")) {
      setPendingApprovals(pendingApprovals.filter(p => p.id !== id));
    }
  };

  // Safe reset routine for all forms
  const clearManagementForms = () => {
    setEditingId(null);
    setFormName("");
    setFormDate("");
    setFormDue("");
    setFormStatus("Absent");
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    
    if (!formName.trim()) {
      alert("Please enter a valid athlete name.");
      return;
    }

    if (!formDate) {
      alert("Please select a valid Admission Date.");
      return;
    }

    const selectedDate = new Date(formDate);
    const today = new Date();
    selectedDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (selectedDate > today) {
      alert("Error: Admission Date cannot be set in the future!");
      return;
    }

    const parsedDue = parseFloat(formDue) || 0;
    if (parsedDue < 0) {
      alert("Fees balance cannot be a negative number.");
      return;
    }

    const defaultPlanDays = editingId ? (members.find(m => m.id === editingId)?.planDaysLeft || 30) : 30;

    if (editingId) {
      setMembers(members.map(m => m.id === editingId ? {
        ...m,
        name: formName.trim(),
        admissionDate: formDate,
        planDaysLeft: defaultPlanDays,
        feesDue: parsedDue,
        status: formStatus
      } : m));
    } else {
      const newMember = {
        id: Date.now(),
        name: formName.trim(),
        admissionDate: formDate,
        planDaysLeft: defaultPlanDays,
        feesDue: parsedDue,
        status: formStatus
      };
      setMembers([...members, newMember]);
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
      if (!weight || !height || weight <= 0 || height <= 0) {
        alert('Please enter valid positive values.');
        return;
      }
      const heightInMeters = height / 100;
      bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    } else {
      if (!weightLbs || !heightFt || weightLbs <= 0 || heightFt <= 0) {
        alert('Please enter valid positive values.');
        return;
      }
      const totalHeightInInches = (parseFloat(heightFt) * 12) + (parseFloat(heightIn) || 0);
      bmiValue = ((weightLbs / (totalHeightInInches * totalHeightInInches)) * 703).toFixed(1);
    }

    setBmi(bmiValue);

    if (bmiValue < 18.5) {
      setBmiMessage('Underweight 🟡');
      setBmiColor('text-yellow-400 border-yellow-500/30 bg-yellow-500/10');
      setBmiAdvice('Recommendation: Focus on a clean caloric surplus paired with heavy strength training at Varada Gym to build solid lean muscle safely.');
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setBmiMessage('Normal Weight 🎉');
      setBmiColor('text-green-400 border-green-500/30 bg-green-500/10');
      setBmiAdvice('Recommendation: Great job! Maintain your body composition with a balanced nutrition profile and a mix of progressive overload lifting and steady cardio.');
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setBmiMessage('Overweight 🟠');
      setBmiColor('text-orange-400 border-orange-500/30 bg-orange-500/10');
      setBmiAdvice('Recommendation: Consider a slight caloric deficit. Combine high-intensity functional training or heavy weight sessions with optimized cardio to retain muscle while leaning out.');
    } else {
      setBmiMessage('Obese 🔴');
      setBmiColor('text-red-400 border-red-500/30 bg-red-500/10');
      setBmiAdvice('Recommendation: Prioritize steady fat-loss conditioning alongside structured resistance training. Connect with a Varada trainer to create a safe, customized progression plan.');
    }
  };

  const resetBmiForm = () => {
    setWeight(''); setHeight(''); setWeightLbs(''); setHeightFt(''); setHeightIn('');
    setBmi(null); setBmiMessage(''); setBmiColor(''); setBmiAdvice('');
  };

  // Metrics counters computed safely
  const activeInGym = members.filter(m => m.status === "Present").length;
  const totalDueCount = members.filter(m => m.feesDue > 0).length;

  const todayString = new Date().toISOString().split('T')[0];

  // Open modal with specific selection presets
  const triggerModalOpen = (tierName) => {
    setSelectedModalTier(tierName);
    setShowModal(true);
  };

  // ==========================================
  // VIEW TERMINATION POINTS (ROUTING INTERFACES)
  // ==========================================
  if (view === "login") {
    return <Login onLoginSuccess={handleLoginSuccess} onBackToHome={() => setView("landing")} />;
  }

  if (view === "dashboard" && user) {
    if (user.role === "owner") {
      return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
          
          {/* Dashboard Operations Control Header */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-900 pb-6 mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Varadh Operations Control</h2>
              <p className="text-gray-500 text-sm mt-1">Logged in as: <span className="text-red-500 font-bold">{user.name}</span></p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-red-600 border border-neutral-800 text-sm font-bold uppercase rounded-xl transition tracking-wider"
            >
              Exit Console Securely
            </button>
          </div>

          {/* Module Sub-tab Router Switches */}
          <div className="max-w-7xl mx-auto flex gap-4 mb-8 border-b border-neutral-900 pb-4">
            <button 
              onClick={() => setOwnerSubTab("active-members")}
              className={`px-5 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition ${
                ownerSubTab === "active-members" ? "bg-red-500 text-white" : "bg-neutral-950 border border-neutral-900 text-gray-400 hover:text-white"
              }`}
            >
              🏃‍♂️ Active Roster ({members.length})
            </button>
            <button 
              onClick={() => setOwnerSubTab("pending-approvals")}
              className={`px-5 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition flex items-center gap-2 ${
                ownerSubTab === "pending-approvals" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse" : "bg-neutral-950 border border-neutral-900 text-gray-400 hover:text-white"
              }`}
            >
              📥 Inbound Leads ({pendingApprovals.length})
            </button>
          </div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
            
            {/* LEFT SIDEBAR: Metrics & Form Controllers */}
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

              {/* REGISTER ATHLETE FORM MODULE */}
              <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-900 shadow-xl">
                <h3 className="text-xl font-extrabold mb-4 text-white">
                  {editingId ? "✏️ Edit Member Profile" : "➕ Register New Athlete"}
                </h3>
                <form onSubmit={handleSaveMember} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Athlete Full Name</label>
                    <input 
                      type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Rahul J."
                      className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Admission Date</label>
                    <input 
                      type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} max={todayString}
                      className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white text-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Fees Balance (₹)</label>
                      <input 
                        type="number" value={formDue} onChange={(e) => setFormDue(e.target.value)} placeholder="0" min="0"
                        className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500">Presence Status</label>
                      <select 
                        value={formStatus} onChange={(e) => setFormStatus(e.target.value)}
                        className="w-full p-3 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-sm outline-none text-white"
                      >
                        <option value="Absent">Absent</option>
                        <option value="Present">Present</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition">
                      {editingId ? "Update Data Sheet" : "Commit Record"}
                    </button>
                  </div>
                </form>

                {editingId && (
                  <button 
                    type="button" 
                    onClick={clearManagementForms} 
                    className="w-full mt-2 py-2 bg-neutral-900 border border-neutral-800 text-xs font-medium rounded-xl hover:bg-neutral-800 text-gray-400"
                  >
                    Cancel Operations Setup
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT SIDE VIEW PANELS */}
            <div className="lg:col-span-2 bg-neutral-950 rounded-3xl border border-neutral-900 p-6 shadow-xl overflow-hidden h-fit">
              
              {ownerSubTab === "active-members" ? (
                /* VIEW 1: ACTIVE MEMBERS GRID SHEET */
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
                            <td className="py-4">
                              {member.planDaysLeft === 0 ? (
                                <span className="text-red-500 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md text-xs">Expired Plan</span>
                              ) : (
                                <span className="text-gray-300 font-medium">{member.planDaysLeft} Days Remaining</span>
                              )}
                            </td>
                            <td className="py-4">
                              {member.feesDue > 0 ? (
                                <span className="text-orange-400 font-extrabold bg-orange-500/10 px-2 py-0.5 rounded-md text-xs border border-orange-500/20">₹{member.feesDue} Unpaid</span>
                              ) : (
                                <span className="text-green-400 font-bold text-xs bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">Settled Paid</span>
                              )}
                            </td>
                            <td className="py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                                member.status === "Present" ? "bg-green-500/10 text-green-400 border border-green-500/10" : "bg-neutral-900 text-gray-500 border border-neutral-800"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${member.status === "Present" ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
                                {member.status}
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
                /* VIEW 2: DYNAMIC INBOUND ADMISSION PIPELINE MODERATION MODULE */
                <>
                  <h3 className="text-xl font-extrabold mb-2 text-white">Pending Registrations Gate</h3>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">Incoming athlete profiles originating from the landing website forms are cataloged here. Review their plan choices to grant or deny system admission.</p>
                  
                  {pendingApprovals.length === 0 ? (
                    <div className="text-center py-12 bg-black/40 rounded-2xl border border-neutral-900/50">
                      <p className="text-gray-500 text-sm font-medium">No pending registration workflows found inside the pipe right now.</p>
                    </div>
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
                                <span className="text-[10px] text-gray-600 font-mono block mt-0.5">Applied: {app.dateSubmitted}</span>
                              </td>
                              <td className="py-4 font-bold text-orange-400 text-xs tracking-wide uppercase">{app.planTier}</td>
                              <td className="py-4 text-xs font-light text-gray-400">
                                <span className="block font-medium text-gray-300">{app.phone}</span>
                                <span className="block opacity-60">{app.email}</span>
                              </td>
                              <td className="py-4 text-right space-x-2">
                                <button 
                                  onClick={() => acceptApplication(app)}
                                  className="text-xs bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg transition tracking-wide uppercase"
                                >
                                  ✅ Accept Athlete
                                </button>
                                <button 
                                  onClick={() => rejectApplication(app.id)}
                                  className="text-xs bg-neutral-900 border border-neutral-800 text-gray-500 hover:text-red-400 hover:border-red-500/20 px-3 py-1.5 rounded-lg transition"
                                >
                                  Deny
                                </button>
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

    // Standard Customer Portal
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-8 text-center">
        <div className="max-w-md w-full bg-neutral-950 p-8 rounded-3xl border border-neutral-900 shadow-2xl space-y-5">
          <div className="text-5xl">💪</div>
          <h2 className="text-3xl font-black">Welcome back, {user.name}!</h2>
          <span className="inline-block px-4 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest rounded-full">
            Role Auth: Customer Portal
          </span>
          <p className="text-gray-400 text-base font-light leading-relaxed">
            Athlete Dashboard Active. Accessing personalized workout schedules, nutrition plans, and membership history.
          </p>
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-sm uppercase tracking-wider transition shadow-lg shadow-red-500/10"
          >
            Log Out Securely
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white antialiased relative overflow-x-hidden">
      
      {/* BACKGROUND WATERMARK SLIDESHOW MODULE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {watermarkImages.map((imgSrc, index) => (
          <div
            key={index}
            style={{ backgroundImage: `url(${imgSrc})` }}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentBgIndex ? "opacity-[0.30]" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black opacity-90" />
      </div>

      {/* FOREGROUND CONTENT SECTION */}
      <div className="relative z-10">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-900">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Prop. Vinayak D. Jinarali</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white hover:opacity-90 transition">
              Varadh <span className="text-red-500">Hardcore Fitness</span>
            </h1>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase items-center">
            <a href="#home" className="hover:text-red-500 transition text-gray-300">Home</a>
            <a href="#about" className="hover:text-red-500 transition text-gray-300">About</a>
            <a href="#plans" className="hover:text-red-500 transition text-gray-300">Plans</a>
            <a href="#bmi" className="hover:text-red-500 transition text-gray-300">BMI Quiz</a>
            <a href="#contact" className="hover:text-red-500 transition text-gray-300">Contact</a>
            
            {/* INSTAGRAM HEADER INTERLAY BRAND STRING LINK */}
            <a 
              href="https://instagram.com/vinayakjinarali" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-white border border-orange-500/20 bg-orange-500/5 px-2.5 py-1.5 rounded-xl transition lowercase"
            >
              <span>📸</span> @vinayakjinarali
            </a>

            <button 
              onClick={() => setView("login")} 
              className="text-white hover:text-red-500 transition border border-neutral-800 hover:border-red-500/50 px-5 py-2 rounded-xl text-xs font-extrabold bg-neutral-900/40"
            >
              Portal Login
            </button>
          </div>

          <button
            onClick={() => triggerModalOpen("Premium")}
            className="bg-red-500 px-8 py-3 rounded-xl hover:bg-red-600 transition font-extrabold text-base tracking-wide shadow-lg shadow-red-500/20 active:scale-95"
          >
            Join Now
          </button>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-16 gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <p className="text-red-500 font-black text-sm md:text-base tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="animate-pulse">🔷</span> UNISEX GYM
            </p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter uppercase">
              Varadh<br />
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Hardcore Fitness
              </span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl mt-8 leading-relaxed font-normal max-w-2xl">
              Join Varadh Hardcore Fitness Gym and achieve your lifestyle transformations with elite equipment tracking, premium bodybuilding parameters, and an absolute raw power community.
            </p>
            <div className="flex flex-wrap gap-5 mt-10">
              <button onClick={() => triggerModalOpen("Premium")} className="bg-red-500 px-10 py-5 rounded-xl text-lg font-black hover:scale-105 hover:bg-red-600 transition shadow-xl shadow-red-500/20">
                Get Started Today
              </button>
              <a href="#plans" className="border border-gray-800 text-gray-300 px-10 py-5 rounded-xl text-lg font-black hover:bg-white hover:text-black transition text-center">
                View Plans
              </a>
            </div>
            
            {/* GYM PILLARS FEATURE BADGES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 border-t border-neutral-900 pt-10">
              <div className="bg-neutral-950/50 backdrop-blur-sm border border-neutral-900 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-red-500 text-lg font-black tracking-wider uppercase">⚡ Hardcore</span>
                <p className="text-gray-500 text-xs mt-1 font-medium uppercase tracking-wide">Premium Environment</p>
              </div>
              <div className="bg-neutral-950/50 backdrop-blur-sm border border-neutral-900 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-white text-lg font-black tracking-wider uppercase">👥 Unisex</span>
                <p className="text-gray-500 text-xs mt-1 font-medium uppercase tracking-wide">Inclusive Training Hub</p>
              </div>
              <div className="bg-neutral-950/50 backdrop-blur-sm border border-neutral-900 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-red-500 text-lg font-black tracking-wider uppercase">🔥 Results</span>
                <p className="text-gray-500 text-xs mt-1 font-medium uppercase tracking-wide">Elite Level Coaching</p>
              </div>
            </div>

          </div>
          <div className="lg:w-1/2 flex justify-center w-full">
            <img src={heroImage} alt="Varadh Hardcore Fitness" className="w-full max-w-md lg:max-w-xl rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-gray-900 hover:scale-[1.02] transition duration-500 object-cover aspect-[4/5]" />
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="about" className="py-28 px-6 md:px-12 lg:px-20 bg-neutral-950/40 backdrop-blur-sm">
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

        {/* Membership Plans Section */}
        <section id="plans" className="py-28 px-6 md:px-12 lg:px-20 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-5xl md:text-6xl font-black">Our <span className="text-red-500">Membership Plans</span></h2>
              <p className="text-gray-400 mt-5 text-lg md:text-xl">Select the ideal access tier for your current commitment levels.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-10 items-center">
              {/* Basic */}
              <div className="bg-neutral-900/80 rounded-3xl p-8 md:p-10 border border-neutral-800 hover:border-red-500/50 hover:-translate-y-2 transition duration-300 backdrop-blur-md">
                <h3 className="text-3xl font-extrabold text-center">Basic</h3>
                <h1 className="text-6xl font-black text-red-500 text-center mt-5">₹999</h1>
                <p className="text-center text-gray-500 text-base mt-2 font-medium">per month</p>
                <ul className="mt-8 space-y-4 text-gray-300 text-base border-t border-neutral-800 pt-6">
                  <li className="flex items-center gap-3"><span>✅</span> Gym Access Only</li>
                  <li className="flex items-center gap-3"><span>✅</span> Modern Cardio Area</li>
                  <li className="flex items-center gap-3 text-gray-600"><span>❌</span> Personal Trainer</li>
                </ul>
                <button onClick={() => triggerModalOpen("Basic")} className="w-full mt-8 bg-neutral-800 hover:bg-red-500 py-4 rounded-xl font-black transition text-base tracking-wider uppercase">Choose Plan</button>
              </div>
              {/* Premium */}
              <div className="bg-gradient-to-b from-red-600/90 to-red-800/90 rounded-3xl p-8 md:p-10 scale-105 shadow-2xl shadow-red-600/10 border border-red-500 relative backdrop-blur-md">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-red-700 px-5 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-md">MOST POPULAR</div>
                <h3 className="text-3xl font-extrabold text-center mt-2">Premium</h3>
                <h1 className="text-6xl font-black text-center mt-5">₹1999</h1>
                <p className="text-center text-red-200 text-base mt-2 font-medium">per month</p>
                <ul className="mt-8 space-y-4 text-base border-t border-red-500/30 pt-6">
                  <li className="flex items-center gap-3"><span>✅</span> Unlimited Gym & Strength Access</li>
                  <li className="flex items-center gap-3"><span>✅</span> Cardio Conditioning Access</li>
                  <li className="flex items-center gap-3"><span>✅</span> All Dynamic Group Classes</li>
                  <li className="flex items-center gap-3"><span>✅</span> Standard Diet Guidance</li>
                </ul>
                <button onClick={() => triggerModalOpen("Premium")} className="w-full mt-8 bg-white text-red-700 py-4 rounded-xl font-black hover:bg-neutral-950 hover:text-white transition text-base tracking-wider uppercase shadow-lg">Choose Plan</button>
              </div>
              {/* Personal */}
              <div className="bg-neutral-900/80 rounded-3xl p-8 md:p-10 border border-neutral-800 hover:border-red-500/50 hover:-translate-y-2 transition duration-300 backdrop-blur-md">
                <h3 className="text-3xl font-extrabold text-center">Personal Coaching</h3>
                <h1 className="text-6xl font-black text-red-500 text-center mt-5">₹3999</h1>
                <p className="text-center text-gray-500 text-base mt-2 font-medium">per month</p>
                <ul className="mt-8 space-y-4 text-gray-300 text-base border-t border-neutral-800 pt-6">
                  <li className="flex items-center gap-3"><span>✅</span> 1-on-1 Dedicated Trainer</li>
                  <li className="flex items-center gap-3"><span>✅</span> Customized Progressive Workout Plan</li>
                  <li className="flex items-center gap-3"><span>✅</span> Personalized Diet & Macronutrients</li>
                  <li className="flex items-center gap-3"><span>✅</span> Weekly Body Composition Analysis</li>
                </ul>
                <button onClick={() => triggerModalOpen("Personal")} className="w-full mt-8 bg-neutral-800 hover:bg-red-500 py-4 rounded-xl font-black transition text-base tracking-wider uppercase">Choose Plan</button>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced BMI Calculator Section */}
        <section id="bmi" className="py-28 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-3">📊 Metric Optimization</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-5">Check Your <span className="text-red-500">BMI Composition</span></h2>
              <p className="text-gray-400 leading-relaxed mb-8 text-lg font-light">Body Mass Index (BMI) computes basic healthy weight proportions. Input your dimensions using our toggle to discover instant, custom advice matching our gym frameworks.</p>
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
                <div className={`mt-6 p-6 rounded-2xl border text-center ${bmiColor} transition duration-300`}>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Calculated BMI Score</p>
                  <h3 className="text-5xl font-black my-2">{bmi}</h3>
                  <p className="font-black tracking-wide text-base uppercase">{bmiMessage}</p>
                  <p className="text-sm text-gray-300 mt-4 text-left leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5 font-light">{bmiAdvice}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-28 px-6 md:px-12 lg:px-20 bg-neutral-950/60 border-t border-neutral-900 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-3">⭐ Success Stories</p>
              <h2 className="text-5xl md:text-6xl font-black">Real Results, Real People</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Rahul J.", change: "Lost 14kg", text: "The variety of high-end conditioning machines and guidance completely changed how I look at lifestyle transformations.", label: "Premium Tier Member" },
                { name: "Sameer K.", change: "Gained Lean Muscle", text: "Exceptional environment. Progressive lifting setup here is superior to anything in the region.", label: "Strength Athlete" },
                { name: "Priya M.", change: "Improved Stamina", text: "The trainers actually fix your biomechanics and nutrition tracking. Worth every single rupee.", label: "Group Circuit regular" }
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-900/60 p-8 rounded-2xl border border-neutral-900 space-y-4 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-white">{item.name}</span>
                    <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-black border border-red-500/10">{item.change}</span>
                  </div>
                  <p className="text-gray-400 text-base font-light leading-relaxed italic">"{item.text}"</p>
                  <p className="text-xs uppercase text-gray-500 tracking-wider font-bold pt-3">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-28 px-6 md:px-12 lg:px-20 bg-black/40 backdrop-blur-sm border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-3">📍 Info Board</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight">Connect With <span className="text-red-500">Varadh HQ</span></h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 flex items-start gap-4 shadow-xl">
                <div className="text-3xl bg-neutral-900 p-3 rounded-xl">📞</div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-wider mb-1">Phone / Mob</h4>
                  <p className="text-gray-400 text-sm font-medium hover:text-red-500 transition cursor-pointer">+91 99729 99733</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 flex items-start gap-4 shadow-xl">
                <div className="text-3xl bg-neutral-900 p-3 rounded-xl">📸</div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-wider mb-1">Instagram</h4>
                  <a href="https://instagram.com/vinayakjinarali" target="_blank" rel="noopener noreferrer" className="text-orange-400 text-sm font-bold block hover:underline mt-0.5">@vinayakjinarali</a>
                </div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 flex items-start gap-4 shadow-xl">
                <div className="text-3xl bg-neutral-900 p-3 rounded-xl">🕒</div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-wider mb-1">Shift Hours</h4>
                  <p className="text-gray-400 text-sm font-medium">Mon – Sat: 5 AM – 10 AM | 5 PM – 10 PM</p>
                  <p className="text-red-500 text-xs font-black uppercase mt-1">Sunday: Holiday (Closed)</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 flex items-start gap-4 shadow-xl">
                <div className="text-3xl bg-neutral-900 p-3 rounded-xl">🏢</div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-wider mb-1">HQ Address</h4>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">Beside Dugani Complex, Dairy Road, Yamakanmaradi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/90 border-t border-neutral-900 py-16 px-6 md:px-12 lg:px-20 backdrop-blur-sm">
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

        {/* RE-ARCHITECTED BUG-FREE INTERACTIVE WORKFLOW MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-[2px] shadow-2xl">
              <div className="bg-neutral-950 rounded-3xl p-6 md:p-8">
                
                {/* Close Button */}
                <button 
                  onClick={() => setShowModal(false)} 
                  className="absolute top-5 right-5 text-gray-500 hover:text-white text-2xl transition"
                >
                  &times;
                </button>
                
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🏋️‍♂️</div>
                  <h2 className="text-3xl font-black tracking-tight text-white">Join <span className="text-red-500">Varadh Fitness</span></h2>
                  <p className="text-gray-400 text-xs mt-1 font-light">Submit details to request tier admission clearance.</p>
                </div>

                {/* Main Interaction Form */}
                <form className="space-y-4" onSubmit={handlePublicRegistrationSubmit}>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-500">Full Name</label>
                    <input 
                      type="text" placeholder="Enter full name" required
                      value={joinName} onChange={(e) => setJoinName(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-black border border-neutral-900 focus:border-red-500 outline-none text-sm text-white transition" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-500">Phone Number</label>
                    <input 
                      type="tel" placeholder="Enter contact number" required
                      value={joinPhone} onChange={(e) => setJoinPhone(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-black border border-neutral-900 focus:border-red-500 outline-none text-sm text-white transition" 
                    />
                  </div>

                  {/* Clean, fully responsive tier picker grid */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-gray-500">Selected Membership Tier</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Basic", "Premium", "Personal"].map((tier) => (
                        <button
                          key={tier} type="button" onClick={() => setSelectedModalTier(tier)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center ${
                            selectedModalTier === tier 
                              ? "bg-red-500/10 border-red-500 text-red-400" 
                              : "bg-black/40 border-neutral-900 text-gray-400 hover:text-white"
                          }`}
                        >
                          <span>{tier}</span>
                          <span className="text-[10px] opacity-60 font-mono mt-0.5">
                            {tier === "Basic" ? "₹999" : tier === "Premium" ? "₹1999" : "₹3999"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-black uppercase tracking-widest hover:opacity-95 transition shadow-lg shadow-red-500/10"
                    >
                      Request Admission 🚀
                    </button>
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