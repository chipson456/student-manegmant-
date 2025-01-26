import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { updateUserInfo } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        updateUserInfo(token); // עדכון ה-Context עם הטוקן החדש
        setSuccess("Login successful!");

        setTimeout(() => {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          if (decoded.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/student-projects");
          }
        }, 1000);

        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setError("Login failed: Invalid username or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "300px" }}>
        <h2 className="text-center mb-4">התחברות</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="שם משתמש"
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="סיסמה"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-dark w-100">
            התחבר
          </button>
          {error && <div className="text-danger mt-2">{error}</div>}
          {success && <div className="text-success mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
