import React, { useContext, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { userInfo, updateUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // פונקציית התנתקות
  const handleLogout = () => {
    updateUserInfo(null); // איפוס ה-Context של המשתמש והסרת הטוקן
    navigate("/"); // ניתוב לדף הבית
  };

  // מעקב אחר שינויים ב-userInfo לניווט במקרה של התנתקות
  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // ניתוב לנתיב ההתחברות אם המשתמש לא מחובר
    }
  }, [userInfo, navigate]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          אתר המכללה
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>בית</Nav.Link>
            {!userInfo && <Nav.Link onClick={() => navigate("/login")}>התחברות</Nav.Link>}
            {userInfo && userInfo.role === "admin" && (
              <Nav.Link onClick={() => navigate("/admin")}>ניהול משתמשים</Nav.Link>
            )}
            {userInfo && userInfo.role !== "admin" && (
              <Nav.Link onClick={() => navigate("/student-projects")}>דף הפרויקטים</Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            {userInfo ? (
              <>
                <span className="text-light me-3">
                  שלום {userInfo.role === "admin" ? "מנהל" : userInfo.username}
                </span>
                <Nav.Link onClick={handleLogout} className="text-light">
                  התנתק
                </Nav.Link>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
