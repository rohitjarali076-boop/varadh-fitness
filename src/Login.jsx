import React, { useState } from "react";

function Login({ onLoginSuccess, onBackToHome }) {
  const [role, setRole] = useState("customer"); // 'customer' or 'owner'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simulated database of already registered customers
  const [existingCustomers] = useState(["rohit@gmail.com", "rahul@gmail.com"]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. OWNER AUTHENTICATION
      if (role === "owner") {
        await new Promise((resolve) => setTimeout(resolve, 800)); // UI smooth delay
        if (email === "owner@varada.com" && password === "owner123") {
          onLoginSuccess({ email, role: "owner", name: "Gym Admin" });
        } else {
          throw new Error("Invalid owner credentials.");
        }
      } 
      
      // 2. CUSTOMER AUTHENTICATION
      else if (role === "customer") {
        if (password === "password123") {
          
          // Check if this is a first-time log in
          const isFirstTime = !existingCustomers.includes(email.toLowerCase());

          if (isFirstTime) {
            // FIRE LIVE SMS EVENT TO THE BACKEND SERVER
            try {
              await fetch('http://localhost:5000/api/notify-owner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerEmail: email })
              });
              console.log("SMS instruction pushed to backend relay successfully.");
            } catch (smsErr) {
              console.error("Could not reach backend notification relay server:", smsErr);
            }
          }

          onLoginSuccess({ 
            email, 
            role: "customer", 
            name: email.split("@")[0] 
          });
        } else {
          throw new Error("Invalid customer credentials. Hint: use 'password123'");
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        <button 
          onClick={onBackToHome}
          className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-500 transition mb-6 block"
        >
          ← Back to Website
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white">
            Varada <span className="text-red-500">Portal</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">Access your secure fitness dashboard</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-black p-1 rounded-xl mb-6 border border-neutral-900">
          <button
            type="button"
            onClick={() => { setRole("customer"); setError(""); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
              role === "customer" ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            🏃‍♂️ Customer
          </button>
          <button
            type="button"
            onClick={() => { setRole("owner"); setError(""); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
              role === "owner" ? "bg-neutral-900 text-white border border-neutral-800" : "text-gray-400 hover:text-white"
            }`}
          >
            🛡️ Gym Owner
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-xs font-medium mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "owner" ? "owner@varada.com" : "customer@email.com"}
              className="w-full p-4 rounded-xl bg-black border border-neutral-800 focus:border-red-500 outline-none text-white transition text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
              <a href="#" className="text-xs text-red-500 hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-black border border-neutral-800 focus:border-red-500 outline-none text-white transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-black uppercase tracking-widest hover:opacity-95 transition mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Securing Session..." : "Secure Login 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;