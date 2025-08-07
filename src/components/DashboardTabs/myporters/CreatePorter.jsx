import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Form,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Toast,
} from "react-bootstrap";
import {
  UserPlus,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Topbar from "../../AdminDashboard/Topbar";

const CreatePorter = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    assigned_route: "",
  });

  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirm Creation",
      text: "Are you sure you want to add this porter?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.post(
          "https://maziwasmart.onrender.com/api/porters",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setFormData({
          name: "",
          phone: "",
          email: "",
          assigned_route: "",
        });

        setToastVisible(true);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "Failed to create porter. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Topbar />
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-4">
            <UserPlus size={28} className="text-primary mb-1" />
            <h3 className="fw-bold">Create New Porter</h3>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>
                <UserPlus size={16} className="me-1" /> Full Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>
                <Phone size={16} className="me-1" /> Phone Number
              </Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>
                <Mail size={16} className="me-1" /> Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="assigned_route">
              <Form.Label>
                <MapPin size={16} className="me-1" /> Assigned Route
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter route"
                name="assigned_route"
                value={formData.assigned_route}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Saving...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="me-1" /> Create Porter
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Toast
        show={toastVisible}
        onClose={() => setToastVisible(false)}
        delay={3000}
        autohide
        bg="primary"
        className="position-fixed bottom-0 end-0 m-4"
      >
        <Toast.Header closeButton={false}>
          <CheckCircle className="me-2 text-primary" size={18} />
          <strong className="me-auto text-primary">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          Porter created successfully!
        </Toast.Body>
      </Toast>
    </Container>
     </div>
  );
};

export default CreatePorter;
