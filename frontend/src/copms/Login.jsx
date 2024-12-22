import React, { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, SetPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(`userName : ${userName},
      Password : ${password}`);

    /*  try {
      const response = await axios.post("http://localhost:5000/api/login", {
        userName,
        password,
      });
      alert(response.data.message); // הודעה במקרה של התחברות
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("שגיאה בחיבור לשרת");
      }
    }
 */
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ width: "300px", borderRadius: "10px" }}
      >
        <h2 className="text-center mb-4">התחברות</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="שם משתמש :"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="סיסמה :"
              onChange={(e) => SetPassword(e.target.value)}
            />
          </div>{" "}
          <button type="submit" className="btn btn-dark w-100">
            התחבר
          </button>{" "}
        </form>
      </div>
    </div>
  );
};

export default Login;
