import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Dropdown, Button } from "react-bootstrap";
import { FaFolder, FaFileAlt, FaPlus } from "react-icons/fa";
import axios from "axios";

const StudentProjects = () => {
  const [projectFiles, setProjectFiles] = useState(() => {
    // טוען את מצב הכרטיסיות מה-localStorage או מאתחל עם ערכים ריקים
    const savedFiles = localStorage.getItem("projectFiles");
    return savedFiles ? JSON.parse(savedFiles) : [null, null, null];
  });
  const [isEditable, setIsEditable] = useState([true, false, false]); // שליטה באפשרות ללחוץ על הריבועים
  const [selectedFiles, setSelectedFiles] = useState([null, null, null]); // שמירת אובייקטי הקבצים

  // פונקציה לפענוח הטוקן ולשליפת פרטי הסטודנט
  const getStudentNameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // פענוח חלק ה-Payload של הטוקן
      return payload.username; // נניח שהשם נמצא תחת המפתח 'username'
    } catch (error) {
      console.error("שגיאה בפענוח הטוקן:", error);
      return null;
    }
  };

  // שמירת הנתונים ב-localStorage בכל שינוי
  useEffect(() => {
    localStorage.setItem("projectFiles", JSON.stringify(projectFiles));
  }, [projectFiles]);

  const handleFileSelect = (index, event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileName = files[0].name; // שם הקובץ

      setProjectFiles((prev) => {
        const updatedFiles = [...prev];
        updatedFiles[index] = fileName;
        return updatedFiles;
      });

      setSelectedFiles((prev) => {
        const updatedSelectedFiles = [...prev];
        updatedSelectedFiles[index] = files[0]; // שמירת אובייקט הקובץ
        return updatedSelectedFiles;
      });
    }
  };

  const handleSubmission = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const studentName = getStudentNameFromToken(); // קבלת שם הסטודנט מהטוקן
      if (!studentName) {
        alert("לא ניתן למצוא את שם הסטודנט. אנא התחבר מחדש.");
        return;
      }

      const file = selectedFiles[index];
      if (!file) {
        alert("אנא בחר קובץ לפני הגשה.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "project",
        index === 0 ? "הצעת פרויקט" : index === 1 ? "ספר פרויקט" : "פרויקט גמר"
      );
      formData.append("studentName", studentName); // הוספת שם הסטודנט

      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("הקובץ נשמר בהצלחה!");
      } else {
        alert("שגיאה בהעלאת הקובץ.");
      }
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      alert("שגיאה בהעלאת הקובץ. אנא נסה שוב.");
    }
  };

  const handleCancelSubmission = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const fileName = projectFiles[index];

      if (!fileName) {
        alert("לא נמצא קובץ למחיקה.");
        return;
      }

      const response = await axios({
        method: "delete",
        url: "http://localhost:5000/api/delete",
        data: { fileName },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("הקובץ נמחק בהצלחה!");
        setProjectFiles((prev) => {
          const updatedFiles = [...prev];
          updatedFiles[index] = null;
          return updatedFiles;
        });
        setSelectedFiles((prev) => {
          const updatedSelectedFiles = [...prev];
          updatedSelectedFiles[index] = null;
          return updatedSelectedFiles;
        });
      } else {
        alert("שגיאה במחיקת הקובץ.");
      }
    } catch (error) {
      console.error("שגיאה במחיקת הקובץ:", error.response?.data || error.message);
      alert("שגיאה במחיקת הקובץ. אנא נסה שוב.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-5 display-4">הפרויקטים שלי</h2>
      <Row className="gy-4">
        {["הצעת פרויקט", "ספר פרויקט", "פרויקט גמר"].map((title, index) => (
          <Col md={4} key={index}>
            <Card
              className={`shadow-lg ${isEditable[index] ? "clickable" : "disabled"}`}
              style={{
                borderRadius: "15px",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                backgroundColor: isEditable[index] ? "#f8f9fa" : "#e9ecef",
                border: "1px solid #ddd",
                transition: "transform 0.2s",
                cursor: isEditable[index] ? "pointer" : "not-allowed",
              }}
            >
              <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
                {projectFiles[index] === null ? (
                  <h4 className="text-secondary">{title}</h4>
                ) : (
                  <div>
                    {projectFiles[index].includes(".") ? (
                      <FaFileAlt size={50} color="#007bff" />
                    ) : (
                      <FaFolder size={50} color="#ffc107" />
                    )}
                    <p style={{ fontSize: "1em", color: "#555" }}>
                      {projectFiles[index]}
                    </p>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSubmission(index)}
                      className="me-2"
                    >
                      הגש
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelSubmission(index)}
                    >
                      בטל הגשה
                    </Button>
                  </div>
                )}
                {projectFiles[index] === null && (
                  <>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      id={`fileInput-${index}`}
                      onChange={(event) => handleFileSelect(index, event)}
                    />
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="dark"
                        size="lg"
                        style={{ borderRadius: "10px" }}
                        onClick={() => document.getElementById(`fileInput-${index}`).click()}
                      >
                        <FaPlus /> בחר קובץ
                      </Dropdown.Toggle>
                    </Dropdown>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StudentProjects;
