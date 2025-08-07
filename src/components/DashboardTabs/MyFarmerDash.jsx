import React from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Users,
  BarChart2,
  CloudSun,
} from "lucide-react";

const MyFarmerDash = () => {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">👨‍🌾 Farmer Dashboard</h2>

      <div className="row g-4">
        {/* Create Farmer */}
        <div className="col-md-6 col-lg-4">
          <Link to="/create-farmer" className="text-decoration-none">
            <div className="card shadow-sm h-100 border-success">
              <div className="card-body text-center">
                <UserPlus size={32} className="text-success mb-2" />
                <h5 className="card-title">Add Farmer</h5>
                <p className="card-text">Register a new farmer in the system.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* View Farmers */}
        <div className="col-md-6 col-lg-4">
          <Link to="/view-farmers" className="text-decoration-none">
            <div className="card shadow-sm h-100 border-primary">
              <div className="card-body text-center">
                <Users size={32} className="text-primary mb-2" />
                <h5 className="card-title">View Farmers</h5>
                <p className="card-text">See all registered farmers with details.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Farmer Statistics */}
        <div className="col-md-6 col-lg-4">
          <Link to="/farmer-stats" className="text-decoration-none">
            <div className="card shadow-sm h-100 border-info">
              <div className="card-body text-center">
                <BarChart2 size={32} className="text-info mb-2" />
                <h5 className="card-title">Farmer Stats</h5>
                <p className="card-text">Analyze milk records, activity, and trends.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Optional Weather & Advice */}
        <div className="col-md-6 col-lg-4">
          <Link to="/weather-advice" className="text-decoration-none">
            <div className="card shadow-sm h-100 border-warning">
              <div className="card-body text-center">
                <CloudSun size={32} className="text-warning mb-2" />
                <h5 className="card-title">Weather & Advice</h5>
                <p className="card-text">Send tips based on climate data.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyFarmerDash;
