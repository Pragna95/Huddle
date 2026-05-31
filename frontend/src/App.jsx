import { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";
import "./Admin.css";
import Meeting from "./pages/Meeting";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import HuddlePage from "@/components/huddle/HuddlePage";
import Messaging from "@/components/chat/Messaging";

function DashboardUI() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <HuddlePage />
        </div>
      </div>
    </div>
  );
}

function App() {

  // LOGIN STATES

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [adminApiKey, setAdminApiKey] = useState("");
  const [createdHost, setCreatedHost] = useState(null);

  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [hostApiKey, setHostApiKey] = useState("");

  // LOGIN FUNCTION

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          email,
          password
        }
      );
      if (response.data.success) {
        setLoggedIn(true);
        localStorage.setItem("token", response.data.access);
        setAdminApiKey(response.data.api_key);
      }
    } catch (error) {
      setErrorMessage("Invalid Email or Password");
    }
  };

  // CREATE HOST

  const createHost = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/hosts/create/",
        {
          name: hostName,
          email: hostEmail,
          company_name: companyName
        }
      );
      alert(`Host created successfully
  Role :${response.data.role}
  API Key: ${response.data.api_key}
`);
    } catch (error) {
      alert("Failed To Create Host");
    }
  };

  return (
    <Router>
      <Routes>
        {/* NEW MEETING INTERFACE */}
        <Route path="/meeting" element={<Meeting />} />

        {/* DEFAULT LOGIN/DASHBOARD LOGIC */}
        <Route path="/" element={
          !loggedIn ? (
            <div className="main">
              <div className="card">
                <h1 className="logo">Admin Login</h1>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <button className="login-btn" onClick={handleLogin}>Login</button>
              </div>
            </div>
          ) : (
            <div className="dashboard">
              <div className="content">
                <div className="topbar">
                  <h1>Admin Dashboard</h1>
                </div>
                <div className="cards-container">
                  <div className="dashboard-card">
                    <h3>Create Host</h3>
                    <input
                      type="text"
                      placeholder="Host Name"
                      className="input"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Host Email"
                      className="input"
                      value={hostEmail}
                      onChange={(e) => setHostEmail(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      className="input"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <button className="login-btn" onClick={createHost}>Create Host</button>
                  </div>
                </div>
              </div>
            </div>
          )
        } />
        <Route path="/dashboard-ui" element={<DashboardUI />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;


