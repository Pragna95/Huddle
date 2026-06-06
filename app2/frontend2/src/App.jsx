import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./Admin.css";
import Meeting from "./pages/Meeting";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import HuddlePage from "@/components/huddle/HuddlePage";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatList from "@/components/chat/ChatList";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LoginAuth from "./pages/LoginAuth";
import SignupAuth from "./pages/SignupAuth";
import DashboardAuth from "./pages/DashboardAuth";

function Profile() {
  return <div className="p-8">Profile Page (Placeholder)</div>;
}

function Settings() {
  return <div className="p-8">Settings Page (Placeholder)</div>;
}

function NotFound() {
  return <div className="p-8 text-center mt-20 text-xl font-semibold">404 - Page Not Found</div>;
}

function Messaging() {
  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex flex-1 w-full max-w-[1329px] h-full max-h-[824px] overflow-hidden p-4 gap-6 mx-auto animate-scale-in">
          <ChatList />
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("api_key");
  return (token || apiKey) ? children : <Navigate to="/company/login" replace />;
}

function DashboardUI() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-hidden">
          <HuddlePage />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/" element={<Navigate to="/company/login" replace />} />
          <Route path="/dashboard-ui" element={<ProtectedRoute><DashboardUI /></ProtectedRoute>} />
          <Route path="/message" element={<Messaging />} />
          <Route path="/company/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<LoginAuth />} />
          <Route path="/signup" element={<SignupAuth />} />
          <Route path="/dashboard" element={<DashboardAuth />} />
          <Route path="/company/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
