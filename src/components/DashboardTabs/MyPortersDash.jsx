// src/pages/ViewPortersPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Topbar from "../AdminDashboard/Topbar";
import PorterList from "../DashboardTabs/myporters/ViewPorters";

const ViewPortersPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("bg-dark", isDarkMode);
    document.body.classList.toggle("text-light", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={isDarkMode ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"}>
      <Topbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-primary">Porters List</h3>
          <Link to="/create-porter">
            <Button variant="primary" className="fw-semibold">
              + Add Porter
            </Button>
          </Link>
        </div>

        <Card className="shadow-sm border-0">
          <Card.Body>
            <PorterList />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ViewPortersPage;
