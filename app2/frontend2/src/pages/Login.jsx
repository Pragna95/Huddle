import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginHost = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/company/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.token) {
        // Store JWT token
        localStorage.setItem("token", data.token);
        localStorage.setItem("company", data.company.name || "Huddle");
        localStorage.setItem("company_id", data.company.id || "");

        // Fetch API key using JWT token
        try {
          const apiKeyResponse = await fetch(
            "http://localhost:8000/company/api-key/",
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${data.token}`,
                "Content-Type": "application/json"
              }
            }
          );

          if (apiKeyResponse.ok) {
            const apiKeyData = await apiKeyResponse.json();
            if (apiKeyData.api_key) {
              localStorage.setItem("api_key", apiKeyData.api_key);
            }
          }
        } catch (apiErr) {
          console.warn("Could not fetch API key:", apiErr);
        }

        // Clear old auth data
        localStorage.removeItem("user_id");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("name");

        navigate("/company/dashboard");
      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Could not connect to Company Login service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          width: "380px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#222" }}>Company Login</h2>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#444" }}>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#444" }}>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              outline: "none"
            }}
          />
        </div>

        <button
          onClick={loginHost}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#ccc" : "#6d28d9",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{ textAlign: "center", marginTop: "15px", fontSize: "13px" }}>
          <a href="http://localhost:8000/company/signup/" style={{ color: "#6d28d9", textDecoration: "none" }}>
            New company? Register here
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;