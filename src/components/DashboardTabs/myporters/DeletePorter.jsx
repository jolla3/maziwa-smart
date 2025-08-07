import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DeletePorter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const deletePorter = async () => {
      if (!id) {
        alert("No porter ID provided.");
        navigate("/view-porters");
        return;
      }

      try {
        const token = localStorage.getItem("token");

         await axios.delete(
          `https://maziwasmart.onrender.com/api/porters/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Remove deleted porter from localStorage (if stored there)
        const storedPorters = JSON.parse(localStorage.getItem("porters")) || [];
        const updatedPorters = storedPorters.filter((porter) => porter._id !== id);
        localStorage.setItem("porters", JSON.stringify(updatedPorters));

        // Navigate after deletion
        navigate("/view-porters");
      } catch (error) {
        console.error("Failed to delete porter:", error);
        alert("Failed to delete porter. Please try again.");
        navigate("/view-porters");
      }
    };

    deletePorter();
  }, [id, navigate]);

  return (
    <div className="container mt-5">
      <h4>Deleting porter...</h4>
    </div>
  );
};

export default DeletePorter;
