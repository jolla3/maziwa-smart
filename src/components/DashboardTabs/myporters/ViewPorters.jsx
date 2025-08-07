import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../PrivateComponents/AuthContext";

const ViewPorters = () => {
  const [porters, setPorters] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPorters = async () => {
      try {
        const response = await axios.get("https://maziwasmart.onrender.com/api/porters", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const porterList = response.data?.porters || [];
        setPorters(porterList);
      } catch (error) {
        console.error("Failed to fetch porters:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Failed to load porters.");
          setPorters([]);
        }
      }
    };

    if (token) {
      fetchPorters();
    } else {
      toast.warning("Not authenticated. Please log in again.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid porter ID.");
      return;
    }

    try {
      await axios.delete(`https://maziwasmart.onrender.com/api/porters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = porters.filter((porter) => porter._id !== id);
      setPorters(updated);
      toast.success("Porter deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Failed to delete porter.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center mb-4">All Porters</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-success">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Route</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {porters.length > 0 ? (
              porters.map((porter) => (
                <tr key={porter._id}>
                  <td>{porter.name}</td>
                  <td>{porter.phone}</td>
                  <td>{porter.email}</td>
                  <td>{porter.assigned_route}</td>
                  <td>
                    <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary w-100 w-sm-auto"
                        onClick={() =>
                          navigate(`/update-porter/${porter._id}`, { state: { porter } })
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger w-100 w-sm-auto"
                        onClick={() => handleDelete(porter._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No porters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPorters;
