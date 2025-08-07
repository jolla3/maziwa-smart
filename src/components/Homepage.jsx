// src/components/Homepage.jsx

import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="homepage">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg custom-navbar sticky-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-droplet-half me-2"></i> MaziwaSmart
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section text-white text-center d-flex align-items-center justify-content-center">
        <div className="overlay px-3 py-5 rounded shadow">
          <h1 className="display-4 fw-bold">Welcome to MaziwaSmart</h1>
          <p className="lead">Smartly managing milk supply chains – from farmers to buyers, seamlessly.</p>
          <Link to="/register" className="btn btn-outline-light btn-lg mt-3">Get Started</Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="mb-4 aqua-text">What is MaziwaSmart?</h2>
          <p className="lead">
            MaziwaSmart is a digital platform streamlining milk collection, delivery, and tracking across regions,
            ensuring quality, transparency, and profitability for dairy stakeholders.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 aqua-text">Key Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card p-4 text-center shadow-sm h-100">
                <i className="bi bi-truck feature-icon"></i>
                <h5>Efficient Delivery</h5>
                <p>Track milk delivery in real time from collection points to destinations.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center shadow-sm h-100">
                <i className="bi bi-people feature-icon"></i>
                <h5>Porter Management</h5>
                <p>Manage and assign porters effectively with one-click access and monitoring.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center shadow-sm h-100">
                <i className="bi bi-graph-up feature-icon"></i>
                <h5>Analytics & Reports</h5>
                <p>Gain insight on volumes, timing, and operations to boost productivity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section text-white text-center py-5">
        <div className="container">
          <h2 className="mb-3">Ready to digitize your dairy operations?</h2>
          <Link to="/register" className="btn btn-light btn-lg">
            <i className="bi bi-person-plus me-2"></i>Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-4">
        <small>&copy; {new Date().getFullYear()} MaziwaSmart. All Rights Reserved.</small>
      </footer>

    </div>
  );
};

export default Homepage;
