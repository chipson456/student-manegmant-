import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const AccessibilityModal = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true); // פותח את המודל
  const handleClose = () => setShow(false); // סוגר את המודל

  return (
    <>
      {/* קישור לפתיחת המודל */}
      <a
        href="#"
        className="text-decoration-none text-light mx-2"
        onClick={(e) => {
          e.preventDefault(); // ביטול פעולת ברירת מחדל של הקישור
          handleShow(); // פתיחת המודל
        }}
      >
        הצהרת נגישות
      </a>

      {/* מודל הנגישות */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>הצהרת נגישות</Modal.Title>
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </Modal.Header>
        <Modal.Body>
          <p>
            אנו שואפים לספק חוויית גלישה נגישה לכל המשתמשים, כולל אנשים עם
            מוגבלויות. האתר עושה שימוש בכלי הנגישות של Enable, המאפשר התאמות
            אישיות למשתמשים, כולל:
          </p>
          <ul>
            <li>הגדלת והקטנת טקסטים.</li>
            <li>שינוי ניגודיות צבעים.</li>
            <li>ניווט באמצעות המקלדת בלבד.</li>
            <li>טקסטים חלופיים לתמונות.</li>
          </ul>
          <p>
            הכלי עומד בהנחיות הנגישות של WCAG 2.1 ברמה AA. אם נתקלתם בקושי
            בגלישה או שיש לכם הערות, אנא צרו קשר ב-
            <a href="mailto:contact@example.com">email@email.com</a>. נשמח
            לסייע!
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AccessibilityModal;
