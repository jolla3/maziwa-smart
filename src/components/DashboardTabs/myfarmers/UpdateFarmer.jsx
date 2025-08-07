import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { User, Phone, Mail, MapPin, Save } from "lucide-react";
import Topbar from "../../AdminDashboard/Topbar";

const UpdateFarmer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    location: "",
  });

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://maziwasmart.onrender.com/api/farmers/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const farmer = res.data;
        setFormData({
          fullname: farmer.fullname,
          phone: farmer.phone,
          email: farmer.email,
          location: farmer.location,
        });
      } catch {
        navigate("/view-farmers");
      }
    };
    fetchFarmer();
  }, [id, navigate]);

  const handleChange = (e) => setFormData((prev) => ({
    ...prev, [e.target.name]: e.target.value
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://maziwasmart.onrender.com/api/farmers/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/view-farmers");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div>
      <Topbar />
      <div className="container mt-5">
        <div className="card shadow-lg p-4">
          <h3 className="mb-4"><User className="me-2" />Edit Farmer</h3>
          <form onSubmit={handleSubmit}>
            {["fullname", "phone", "email", "location"].map((field, i) => (
              <div className="mb-3" key={field}>
                <label className="form-label text-capitalize">
                  {field === "location" ? <MapPin size={16} /> :
                   field === "phone" ? <Phone size={16} /> :
                   field === "email" ? <Mail size={16} /> :
                   <User size={16} />}{" "}
                  {field.replace("_", " ")}
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type={field === "email" ? "email" : "text"}
                  className="form-control"
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              <Save size={16} className="me-2" />Update Farmer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateFarmer;
