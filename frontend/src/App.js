import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./copms/Navbar";
import Login from "./copms/Login";
import ForgotPassword from "./copms/ForgotPassword";
import StudentProjects from "./copms/StudentProjects";
import HomePage from "./copms/HomePage";
import AccessibilityModal from "./copms/AccessibilityModal"; 

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/student-projects" element={<StudentProjects />} />
      </Routes>
    </Router>
  );
}

export default App;

