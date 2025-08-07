// src/components/Farmers/ViewFarmers.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Users, Pencil, Trash2, RefreshCcw, Search, Home, Save,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "../../AdminDashboard/Topbar";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import { Button } from "react-bootstrap";

const ViewFarmers = () => {
  const { token } = useContext(AuthContext);

  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("farmers");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed)) {
          setFarmers(parsed);
          setFilteredFarmers(parsed);
        }
      } catch (e) {
        console.warn("Invalid cached farmers data", e);
      }
    }
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://maziwasmart.onrender.com/api/farmers", authHeader);
      if (Array.isArray(response.data)) {
        setFarmers(response.data);
        setFilteredFarmers(response.data);
        localStorage.setItem("farmers", JSON.stringify(response.data));
        setError("");
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch farmers.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredFarmers(farmers.filter((f) => f?.fullname?.toLowerCase().includes(term)));
  };

  const handleEditClick = (farmer) => {
    setEditingId(farmer._id);
    setEditData({ ...farmer });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    setUpdating(true);
    try {
      const response = await axios.put(
        `https://maziwasmart.onrender.com/api/farmers/${editingId}`,
        editData,
        authHeader
      );

      if (response.data && response.data.farmer) {
        const updated = farmers.map((f) => {
          if (!f || !f._id) return f;
          return f._id === editingId ? response.data.farmer : f;
        });

        setFarmers(updated);
        setFilteredFarmers(updated);
        localStorage.setItem("farmers", JSON.stringify(updated));
        toast.success("Farmer updated successfully");
        setEditingId(null);
      } else {
        toast.error("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (farmerCode, farmerName) => {
    const confirmToastId = toast.info(
      ({ closeToast }) => (
        <div>
          <div>
            Are you sure you want to delete <strong>{farmerName}</strong>?
          </div>
          <div className="mt-2 d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={async () => {
                toast.dismiss(confirmToastId);
                try {
                  await axios.delete(
                    `https://maziwasmart.onrender.com/api/farmers/${farmerCode}`,
                    authHeader
                  );
                  const updated = farmers.filter((f) => f?.farmer_code !== farmerCode);
                  setFarmers(updated);
                  setFilteredFarmers(updated);
                  localStorage.setItem("farmers", JSON.stringify(updated));
                  toast.success("Farmer deleted successfully");
                } catch {
                  toast.error("Delete failed");
                }
              }}
            >
              Yes, Delete
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => toast.dismiss(confirmToastId)}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  return (
    <div>
      
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mt-4">
        

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary">
            <Users size={24} className="me-2" />
            Farmers
          </h4>

            <Link to="/admindashboard/create-porter">
                       <Button variant="primary" className="fw-semibold">
                         + Add Porter
                       </Button>
            </Link>

          <button onClick={fetchFarmers} className="btn btn-outline-info">
            <RefreshCcw size={18} className="me-1" />
            Refresh
          </button>
        </div>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admindashboard">
                <Home size={16} className="me-1" />
                Home
              </Link>
            </li>
            <li className="breadcrumb-item active">Farmers List</li>
          </ol>
        </nav>

        <div className="input-group mb-3">
          <span className="input-group-text bg-info text-white">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2">Loading farmers...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredFarmers.length === 0 ? (
          <div className="alert alert-warning">No matching farmers found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-info">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Code</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredFarmers) && filteredFarmers.map((f, idx) => (
                  f && f._id ? (
                    <tr key={f._id}>
                      <td>{idx + 1}</td>
                      <td>
                        {editingId === f._id ? (
                          <input
                            value={editData.fullname || ""}
                            onChange={(e) => handleEditChange("fullname", e.target.value)}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          f.fullname
                        )}
                      </td>
                      <td>
                        {editingId === f._id ? (
                          <input
                            value={editData.phone || ""}
                            onChange={(e) => handleEditChange("phone", e.target.value)}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          f.phone
                        )}
                      </td>
                      <td>
                        {editingId === f._id ? (
                          <input
                            value={editData.email || ""}
                            onChange={(e) => handleEditChange("email", e.target.value)}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          f.email || "-"
                        )}
                      </td>
                      <td>{f.farmer_code}</td>
                      <td>
                        {editingId === f._id ? (
                          <input
                            value={editData.location || ""}
                            onChange={(e) => handleEditChange("location", e.target.value)}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          f.location || "-"
                        )}
                      </td>
                      <td className="d-flex gap-1">
                        {editingId === f._id ? (
                          <button
                            onClick={handleSaveEdit}
                            className="btn btn-sm btn-success"
                            disabled={updating}
                          >
                            {updating ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                              <Save size={14} />
                            )}
                          </button>
                        ) : (
                          <button onClick={() => handleEditClick(f)} className="btn btn-sm btn-warning">
                            <Pencil size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(f.farmer_code, f.fullname)}
                          className="btn btn-sm btn-danger"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ) : null
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFarmers;