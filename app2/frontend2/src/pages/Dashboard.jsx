import React from "react";
import ApiKeyManager from "../components/ApiKeyManager";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const company = localStorage.getItem("company") || "Company";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("company");
    navigate("/company/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-900">Host Dashboard</h1>
            <p className="text-sm text-slate-500">
              Welcome back, <span className="font-semibold text-indigo-600">{company}</span>
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 px-4 h-10 rounded-lg"
          >
            Sign Out
          </Button>
        </div>

        <ApiKeyManager />
      </div>
    </div>
  );
}

export default Dashboard;
