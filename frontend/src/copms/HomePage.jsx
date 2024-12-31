import React from "react";
import { Container, Navbar, Button, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const HomePage = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f9fc" }}>
      

      {/* Main Section */}
      <Container className="text-center mt-5">
        <h1 className="display-4 fw-bold text-primary">ברוכים הבאים!</h1>
        <p className="mt-4 fs-5 text-secondary">
          הפלטפורמה המושלמת לפרויקטים, קהילה, ולמידה.
        </p>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <img
              src="/collegeImg.webp"
              alt="Welcome Illustration"
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer
        className="text-center py-4 mt-5"
        style={{ backgroundColor: "#343a40", color: "#ffffff" }}
      >
        <Container>
          <Row>
            <Col>
              <p className="mb-2">אתר המכללה © 2024</p>
              <div className="d-flex justify-content-center">
                <FaFacebook size={24} className="mx-2" />
                <FaTwitter size={24} className="mx-2" />
                <FaInstagram size={24} className="mx-2" />
              </div>
              <p className="mt-2">
                <a href="#" className="text-decoration-none text-light mx-2">
                  עלינו
                </a>
                |
                <a href="#" className="text-decoration-none text-light mx-2">
                  יצירת קשר
                </a>
                |
                <a href="#" className="text-decoration-none text-light mx-2">
                  פרטיות
                </a>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
