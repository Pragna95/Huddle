import { useState } from "react";
import axios from "axios";
import "./App.css";

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
        localStorage.setItem("token",response.data.access);
        setAdminApiKey(response.data.api_key);
}
} catch (error) {
  setErrorMessage("Invalid Email or Password");
}
};

  // CREATE HOST

  const createHost = async () => {
    
  
    try {
      const token=localStorage.getItem("token");
      console.log(token);

      const response = await axios.post(
  "http://127.0.0.1:8000/api/hosts/create/",
  {
    name: hostName,
    email: hostEmail,
    company_name: companyName
    
  },
  
);
console.log(response.data);
alert(`Host created successfully
  Role :${response.data.role}
  API Key: ${response.data.api_key}
`);
 } catch (error) {
  console.log(error);
  console.log(error.response);
      console.log(error.response?.data);
      alert("Failed To Create Host");

    }

  };

  // LOGIN PAGE

  if (!loggedIn) {

    return (

      <div className="main">

        <div className="card">

          <h1 className="logo">
            Admin Login
          </h1>

          

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

          {
            errorMessage && (
              <p className="error-text">
                {errorMessage}
              </p>
            )
          }

          <button
            className="login-btn"
            onClick={handleLogin}
          >
            Login
          </button>

        </div>

      </div>

    );

  }

  // DASHBOARD

  return (

    <div className="dashboard">

      <div className="sidebar">

        

        

      </div>

      <div className="content">

        <div className="topbar">

          <h1>
             Admin Dashboard
          </h1>

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

            <button
              className="login-btn"
              onClick={createHost}
            >
              Create Host
            </button>

          </div>

          {
            hostApiKey && (

              <div className="dashboard-card">

                <h3>Generated Host API Key</h3>

                <div className="api-box">
                  {hostApiKey}
                </div>

              </div>

            )
          }
          {
  createdHost && (

    <div className="dashboard-card">

      <h3>Created Host</h3>

      <p><strong>Name:</strong> {createdHost.name}</p>

      <br />

      <p><strong>Email:</strong> {createdHost.email}</p>

      <br />

      <p><strong>Company:</strong> {createdHost.company}</p>

    </div>

  )
}

        </div>

      </div>

    </div>

  );

}

export default App;