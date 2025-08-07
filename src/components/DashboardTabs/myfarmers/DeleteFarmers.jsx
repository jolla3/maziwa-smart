import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, UserX } from "lucide-react";
import { Button, Modal } from "react-bootstrap";

const DeleteFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://maziwasmart.onrender.com/api/farmers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(res.data);
    } catch (err) {
      console.error("Failed to fetch farmers:", err);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://maziwasmart.onrender.com/api/farmers/${selectedFarmer._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFarmers((prev) => prev.filter((f) => f._id !== selectedFarmer._id));
      setShowConfirm(false);
      setSelectedFarmer(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete farmer.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-danger mb-4">
        <UserX size={24} className="me-2" />
        Delete Farmers
      </h3>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Farmer Code</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer._id}>
                <td>{farmer.fullname}</td>
                <td>{farmer.phone}</td>
                <td>{farmer.farmer_code}</td>
                <td>{farmer.location_description}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setShowConfirm(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedFarmer?.fullname}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Farmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteFarmers;
