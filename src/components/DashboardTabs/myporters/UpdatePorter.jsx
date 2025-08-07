import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdatePorterForm = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [porter, setPorter] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    assigned_route: ""
  });

  useEffect(() => {
    if (state?.porter) {
      localStorage.setItem("porterToUpdate", JSON.stringify(state.porter));
      setPorter(state.porter);
    } else {
      const storedPorter = localStorage.getItem("porterToUpdate");
      if (storedPorter) {
        setPorter(JSON.parse(storedPorter));
      } else {
        navigate("/viewporters");
      }
    }
  }, [state, navigate]); // ✅ FIXED: Added navigate to avoid ESLint warning

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPorter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://maziwasmart.onrender.com/api/porters/${porter.id}`,
        porter,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Porter updated successfully!");
      navigate("/viewporters");
    } catch (error) {
      console.error("Failed to update porter:", error);
      alert("Failed to update porter.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Update Porter</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={porter.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={porter.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={porter.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Assigned Route</label>
          <input
            type="text"
            name="assigned_route"
            value={porter.assigned_route}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default UpdatePorterForm;
      