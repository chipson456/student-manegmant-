import React, { useState } from "react";
import { Card, Row, Col, Container, Dropdown, Button } from "react-bootstrap";
import { FaFolder, FaFileAlt, FaPlus } from "react-icons/fa";

const StudentProjects = () => {
  const [projectFiles, setProjectFiles] = useState([null, null, null]);
  const [isEditable, setIsEditable] = useState([true, false, false]); // שליטה באפשרות ללחוץ על הריבועים

  const handleFileSelect = (index, event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].webkitRelativePath
        ? files[0].webkitRelativePath.split("/")[0] // שם התיקייה
        : files[0].name; // שם הקובץ
      setProjectFiles((prev) => {
        const updatedFiles = [...prev];
        updatedFiles[index] = fileName;
        return updatedFiles;
      });

      // עדכון הריבועים הבאים לזמינים ללחיצה
      setIsEditable((prev) => {
        const updatedEditable = [...prev];
        if (index === 0) updatedEditable[1] = true; // מאפשר את הריבוע האמצעי
        if (index === 1) updatedEditable[2] = true; // מאפשר את הריבוע האחרון
        return updatedEditable;
      });
    }
  };

  const handleCardClick = (index) => {
    setProjectFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles[index] = ""; // מפנה את תוכן הריבוע ומאפשר הוספת קובץ/תיקייה
      return updatedFiles;
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-5 display-4">הפרויקטים שלי</h2>
      <Row className="gy-4">
        {["פרויקט ראשון", "פרויקט שני", "פרויקט גמר"].map((title, index) => (
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
              onClick={() => isEditable[index] && handleCardClick(index)}
            >
              <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
                {projectFiles[index] === null ? (
                  <h4 className="text-secondary">{title}</h4>
                ) : projectFiles[index] === "" ? (
                  <>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      id={`fileInput-${index}`}
                      onChange={(event) => handleFileSelect(index, event)}
                    />
                    <input
                      type="file"
                      webkitdirectory="true"
                      style={{ display: "none" }}
                      id={`folderInput-${index}`}
                      onChange={(event) => handleFileSelect(index, event)}
                    />
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="dark"
                        size="lg"
                        style={{ borderRadius: "10px" }}
                      >
                        <FaPlus /> בחר קובץ/תיקייה
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            document.getElementById(`fileInput-${index}`).click()
                          }
                        >
                          <FaFileAlt /> בחר קובץ
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            document.getElementById(`folderInput-${index}`).click()
                          }
                        >
                          <FaFolder /> בחר תיקייה
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <p className="mt-3 text-secondary">או גרור לכאן</p>
                  </>
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
                  </div>
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
