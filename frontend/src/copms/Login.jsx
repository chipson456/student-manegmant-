import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/student-projects"); // ניתוב לעמוד הפרויקטים
        }, 1000); // עיכוב קל להצגת הודעת הצלחה
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Login failed: Invalid username or password");
      } else {
        setError("An error occurred while connecting to the server");
      }
    }
  };
  console.log(aaa);
  
  return (
    
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ width: "300px", borderRadius: "10px" }}
      >
        <h2 className="text-center mb-4">התחברות</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="שם משתמש :"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="סיסמה :"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
              type="button"
              className="btn btn-link text-dark p-0 text-end"
              style={{
                fontSize: "0.7em",
                textDecoration: "none",
                marginTop: "10px",
              }}
              onClick={() => navigate("/forgot-password")}>
              שכחתי סיסמא
            </button>

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
