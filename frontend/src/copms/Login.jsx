import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // Handle successful login (e.g., store token, redirect)
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ width: "300px", borderRadius: "10px" }}
      >
        <h2 className="text-center mb-4">התחברות</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="שם משתמש :"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="סיסמה :"
          />
        </div>
        <button type="button" className="btn btn-dark w-100">
          התחבר
        </button>
      </div>
    </div>
  );
};

export default Login;
