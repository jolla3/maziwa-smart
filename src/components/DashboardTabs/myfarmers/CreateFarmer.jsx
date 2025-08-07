import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { User, Phone, MapPin, Barcode, UserPlus } from "lucide-react";
import Topbar from "../../AdminDashboard/Topbar";

const CreateFarmer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    farmer_code: "",
    location_description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.info("Submitting farmer...", { autoClose: 2000 });

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://maziwasmart.onrender.com/api/farmers", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Farmer created successfully!", {
        autoClose: 2000,
        onClose: () => navigate("/view-farmers"),
      });
    } catch (error) {
      console.error("Error creating farmer:", error);
      toast.error("Failed to create farmer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div><Topbar />
    <div className="container mt-5">
      
      <ToastContainer />
      <div className="card shadow p-4" style={{ backgroundColor: "#e0f7fa" }}>
        <h4 className="mb-4 d-flex align-items-center text-primary">
          <UserPlus className="me-2" /> Register New Farmer
        </h4>
        

        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text bg-aqua"><User size={18} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text bg-aqua"><Phone size={18} /></span>
            <input
              type="tel"
              className="form-control"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text bg-aqua"><Barcode size={18} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Farmer Code"
              name="farmer_code"
              value={formData.farmer_code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text bg-aqua"><MapPin size={18} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Location Description"
              name="location_description"
              value={formData.location_description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 text-white"
            style={{ backgroundColor: "#00bcd4" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Submitting...
              </>
            ) : (
              "Submit Farmer"
            )}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CreateFarmer;
