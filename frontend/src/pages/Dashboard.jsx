function Dashboard() {

  const apiKey = localStorage.getItem(
    "admin_api_key"
  );

  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial"
      }}
    >

      <h1>Super Admin Dashboard</h1>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f4f4f4",
          borderRadius: "10px"
        }}
      >

        <h3>Generated API Key</h3>

        <p>{apiKey}</p>

      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f4f4f4",
          borderRadius: "10px"
        }}
      >

        <h2>Application Access Granted</h2>

        <p>
          Super Admin successfully logged in.
        </p>

      </div>

    </div>
  );
}

export default Dashboard;
