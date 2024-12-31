import React from "react";
import { Form, Button, Card } from "react-bootstrap";

const ForgotPassword = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "300px", borderRadius: "10px" }} className="p-4 shadow">
        <h3 className="text-center mb-4">שכחתי סיסמא</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>אימייל:</Form.Label>
            <Form.Control type="email" placeholder="הזן את האימייל שלך" />
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100">
            שלח
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
