import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import NavBar from "./copms/Navbar";
import Login from "./copms/Login";
import ForgotPassword from "./copms/ForgotPassword";
import StudentProjects from "./copms/StudentProjects";
import HomePage from "./copms/HomePage";
import AdminDashboard from './copms/AdminDashboard';
import AdminFiles from './copms/AdminFiles';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/student-projects" element={<StudentProjects />} />
        <Route
          path="/admin"
          element={
            localStorage.getItem('token')
              && jwtDecode(localStorage.getItem('token'))?.role === 'admin'
              ? <AdminDashboard />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/files"
          element={
            localStorage.getItem('token')
              && jwtDecode(localStorage.getItem('token'))?.role === 'admin'
              ? <AdminFiles />
              : <Navigate to="/" />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
