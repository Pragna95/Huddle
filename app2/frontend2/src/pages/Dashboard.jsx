function Dashboard() {
  const apiKey = localStorage.getItem("api_key") || "No API Key Found";
  const company = localStorage.getItem("company") || "Huddle";

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "50px auto",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}
    >
      <h1 style={{ color: "#4f46e5", marginBottom: "20px" }}>Host Dashboard</h1>
      <h2>Welcome, {company}!</h2>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f3f4f6",
          borderRadius: "10px",
          border: "1px solid #e5e7eb"
        }}
      >
        <h3 style={{ color: "#374151", marginBottom: "10px" }}>Your Host API Key</h3>
        <p style={{
          fontFamily: "monospace",
          background: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          wordBreak: "break-all",
          color: "#4f46e5",
          fontWeight: "bold"
        }}>{apiKey}</p>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#ecfdf5",
          borderRadius: "10px",
          border: "1px solid #a7f3d0"
        }}
      >
        <h4 style={{ color: "#065f46", marginBottom: "5px" }}>Application Access Granted</h4>
        <p style={{ color: "#047857", fontSize: "14px" }}>
          You have successfully logged in statelessly. Use the API Key above in your request headers (`X-API-Key`) to schedule and manage meetings.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
