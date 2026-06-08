import React, { useState } from "react";

/**
 * HostPortal - A sleek, unified Host Portal UI containing Login, Signup, and API Key panels.
 * Features:
 * - Rounded-2xl cards with modern styling (sleek dark accents, indigo/violet focus states)
 * - Transitions between views purely using client-side state.
 * - Props handlers for parent state/action integration.
 * 
 * Props:
 * @param {function} onLogin - Called as onLogin(email, password) on login submit.
 * @param {function} onSignup - Called as onSignup(name, email, password) on signup submit.
 * @param {function} onGenerate - Called as onGenerate() when "Generate new key" is clicked.
 * @param {string} apiKey - The current active API key (if any). If provided, it is shown in the API Key panel.
 */
export default function HostPortal({ onLogin, onSignup, onGenerate, apiKey = "" }) {
  const [view, setView] = useState("login"); // 'login' | 'signup' | 'dashboard'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  // Client-side handlers that trigger the props and transition view state
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(email, password);
    }
    // Transition to dashboard upon successful trigger for demo purposes
    setView("dashboard");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (onSignup) {
      onSignup(name, email, password);
    }
    // Switch to login so the user can sign in
    setView("login");
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <span className="text-white text-2xl font-black tracking-tighter">H</span>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Huddle Developer
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your API access & developer portal
          </p>
        </div>

        {/* Dynamic Card Container */}
        <div className="bg-slate-900 border border-slate-800/80 shadow-2xl shadow-black/40 rounded-2xl p-8 relative overflow-hidden transition-all duration-300">
          
          {/* Decorative subtle ambient light */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* VIEW 1: LOGIN */}
          {view === "login" && (
            <div className="animate-fade-in space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-xs text-slate-400">Sign in to access your developer settings</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <span className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                      Forgot?
                    </span>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  New to Huddle?{" "}
                  <button
                    onClick={() => setView("signup")}
                    className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW 2: SIGNUP */}
          {view === "signup" && (
            <div className="animate-fade-in space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">Create your account</h2>
                <p className="text-xs text-slate-400">Get started by creating a developer profile</p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => setView("login")}
                    className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW 3: API KEY PANEL (DASHBOARD) */}
          {view === "dashboard" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-white tracking-tight">API Settings</h2>
                  <p className="text-[10px] text-slate-500">Workspace credentials</p>
                </div>
                <button
                  onClick={() => setView("login")}
                  className="text-[10px] bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 font-bold transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>

              {/* Show key container */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your HUDDLE_API_KEY</label>
                  {apiKey ? (
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-xs font-mono text-indigo-400 select-all overflow-x-auto whitespace-nowrap scrollbar-thin">
                        {apiKey}
                      </div>
                      <button
                        onClick={handleCopy}
                        className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl px-4 text-xs font-bold transition-all shrink-0 cursor-pointer"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-950 border border-dashed border-slate-850 rounded-xl p-4 text-center">
                      <span className="text-xs italic text-slate-500">No active API key generated yet.</span>
                    </div>
                  )}
                </div>

                {/* Warning Text */}
                <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 text-xs text-amber-500 leading-relaxed flex gap-3">
                  <svg className="h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>
                    <strong>Warning:</strong> Keep this API key confidential. Never check it into public repositories or expose it in client-side client applications.
                  </span>
                </div>

                {/* Action button */}
                <button
                  onClick={onGenerate}
                  className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-100 rounded-xl py-3.5 text-xs font-bold tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer shadow-inner"
                >
                  Generate new key
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
