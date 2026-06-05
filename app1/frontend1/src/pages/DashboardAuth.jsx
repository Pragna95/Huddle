import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashboardAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const apiKey = localStorage.getItem("api_key");
      if (!apiKey) {
        navigate("/login");
        return;
      }

      try {
        const authURL = import.meta.env.VITE_AUTH_URL || "http://localhost:8001";
        // API Key and User Id are handled globally by Axios request interceptors.
        const response = await axios.get(`${authURL}/api/auth/user/`);
        setUser(response.data);
      } catch (err) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("api_key");
        localStorage.removeItem("user_id");
        localStorage.removeItem("email");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("api_key");
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="text-lg font-semibold text-slate-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation bar */}
      <nav className="bg-white shadow-sm border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-indigo-600">Huddle</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">
                Welcome, {user ? (user.name || user.username) : "User"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-900 transition duration-150 ease-in-out"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          {error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-800">
              <p>{error}</p>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow-xl shadow-slate-100 border border-slate-100 sm:rounded-2xl p-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">User Profile Dashboard</h1>
              
              <div className="border-t border-slate-100 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-slate-100">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-slate-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">
                      {user && user.name ? user.name : "Not specified"}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt class="text-sm font-medium text-slate-500">Username</dt>
                    <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">
                      {user && user.username}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-slate-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">
                      {user && user.email}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-slate-500">Member Since</dt>
                    <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">
                      {user && user.date_joined ? user.date_joined.slice(0, 10) : "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardAuth;
