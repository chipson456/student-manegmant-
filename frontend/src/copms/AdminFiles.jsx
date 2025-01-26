import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // בדיקה האם השמות בעברית צריכים המרה
        const updatedFiles = response.data.map((file) => ({
          ...file,
          fileName: decodeURIComponent(file.fileName), // המרה לשמות קבצים ברורים
        }));
        setFiles(updatedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("שגיאה בטעינת הקבצים");
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (fileUrl, fileName) => {
    try {
        const response = await axios.get(`http://localhost:5000${fileUrl}`, {
            responseType: "blob", // להבטיח הורדה כקובץ
        });

        // שימוש ב-Blob להורדה
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", decodeURIComponent(fileName)); // קידוד השם כראוי
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error downloading file:", error);
        alert("שגיאה בהורדת הקובץ");
    }
};


  return (
    <div className="container mt-5">
      <h2>ניהול קבצים</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/admin")}>
        חזרה לניהול משתמשים
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>שם סטודנט</th>
            <th>שם קובץ</th>
            <th>קישור לקובץ</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                אין קבצים להצגה
              </td>
            </tr>
          ) : (
            files.map((file, index) => (
              <tr key={index}>
                <td>{file.studentName || "לא ידוע"}</td>
                <td>{decodeURIComponent(file.fileName)}</td>
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() => handleDownload(file.fileUrl, file.fileName)}
                  >
                    הורד קובץ
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileManagement;
