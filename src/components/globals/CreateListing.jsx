import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../PrivateComponents/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ArrowLeft, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = "https://maziwasmart.onrender.com/api";

const CreateListing = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    animal_type: "",
    animal_id: "",
    price: "",
    description: "",
    location: "",
    farmer_id: "",
    animal_details: {
      age: "",
      breed_name: "",
      gender: "",
      bull_code: "",
      bull_name: "",
      bull_breed: "",
      status: "active",
      stage: "",
      lifetime_milk: "",
      daily_average: "",
      total_offspring: "",
      is_pregnant: false,
      expected_due_date: "",
    },
  });

  const [animals, setAnimals] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const stageOptions = {
    cow: ["calf", "heifer", "cow"],
    bull: ["bull_calf", "young_bull", "mature_bull"],
    goat: ["kid", "doeling", "buckling", "nanny", "buck"],
    sheep: ["lamb", "ewe", "ram"],
    pig: ["piglet", "gilt", "sow", "boar"],
  };

  // ✅ Fetch animals if farmer
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get(`${API_BASE}/animals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAnimals(res.data.animals || []);
        }
      } catch (err) {
        showToast("Failed to load animals", "error");
      }
    };
    if (user?.role === "farmer" && token) fetchAnimals();
  }, [user, token]);

  // 🧠 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("animal_details.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        animal_details: {
          ...prev.animal_details,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🖼 Multiple image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      showToast("Maximum 10 images allowed", "error");
      return;
    }
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // 🔔 Toast handler
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 4000);
  };

  // 🧾 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role === "farmer" && !form.animal_type) {
      showToast("Select the animal type first", "error");
      return;
    }

    if (user?.role === "farmer" && !form.animal_id) {
      showToast("Please select an animal from your herd", "error");
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one image", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("animal_type", form.animal_type);
      formData.append("price", form.price);
      if (form.description) formData.append("description", form.description);
      if (form.location) formData.append("location", form.location);

      if (user?.role === "farmer") {
        formData.append("animal_id", form.animal_id);
      } else {
        Object.keys(form.animal_details).forEach((key) => {
          const val = form.animal_details[key];
          if (val) formData.append(`animal_details[${key}]`, val);
        });
      }

      images.forEach((img) => {
        if (img.file instanceof File) formData.append("images", img.file);
      });

      const res = await axios.post(`${API_BASE}/listing`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        showToast("✅ Listing created successfully!", "success");
        setTimeout(() => navigate("/my-listings"), 1500);
      } else {
        showToast(res.data.message || "Failed to create listing", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Filter animals only when type is chosen
  const filteredAnimals = form.animal_type
    ? animals.filter(
        (a) => a?.species?.toLowerCase() === form.animal_type?.toLowerCase()
      )
    : [];

  // 🌈 UI
  return (
    <div className="container-fluid px-3 py-4" style={{ background: "#f8fdff", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto card shadow-sm border-0"
        style={{ background: "#ffffff", borderRadius: "1rem", maxWidth: "900px" }}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-primary m-0">Post a New Listing 🐄</h3>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-outline-secondary rounded-pill"
              onClick={() => navigate("/my-listings")}
              type="button"
            >
              <ArrowLeft size={16} className="me-1" /> Back
            </motion.button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Title *</label>
                <input
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="Healthy Friesian cow for sale"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Animal Type *</label>
                <select
                  name="animal_type"
                  className="form-select"
                  value={form.animal_type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      animal_type: e.target.value,
                      animal_id: "", // reset selection when type changes
                    }))
                  }
                  required
                >
                  <option value="">Select type</option>
                  <option value="cow">Cow</option>
                  <option value="bull">Bull</option>
                  <option value="goat">Goat</option>
                  <option value="sheep">Sheep</option>
                  <option value="pig">Pig</option>
                </select>
              </div>
            </div>

            {user?.role === "farmer" && (
              <>
                <label className="form-label fw-semibold">Select Animal *</label>
                <select
                  name="animal_id"
                  className="form-select mb-3"
                  value={form.animal_id}
                  onChange={handleChange}
                  disabled={!form.animal_type} // disable if no type chosen
                  required
                >
                  <option value="">
                    {!form.animal_type
                      ? "Select animal type first"
                      : `Choose from your ${form.animal_type}s`}
                  </option>
                  {filteredAnimals.map((a) => {
                    const animalId = a._id || a.id;
                    const displayName = `${a.cow_name || a.name || "Unnamed"} (${a.species}) - ${
                      a.breed?.name || a.breed || "Unknown"
                    }`;
                    return (
                      <option key={animalId} value={animalId}>
                        {displayName}
                      </option>
                    );
                  })}
                </select>
              </>
            )}

            {/* Price */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Price (KES) *</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="50000"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Meru, Kenya"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                placeholder="Describe the animal..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Upload Images (Max 10)</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              <div className="d-flex flex-wrap gap-3 mt-3">
                {images.map((img, i) => (
                  <motion.div key={i} className="position-relative" whileHover={{ scale: 1.05 }}>
                    <img
                      src={img.preview}
                      alt={`preview-${i}`}
                      className="rounded border"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                      style={{ transform: "translate(30%,-30%)" }}
                      onClick={() => removeImage(i)}
                    >
                      <XCircle size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="text-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="btn text-white px-4 py-2 rounded-pill shadow"
                style={{
                  background: "linear-gradient(90deg,#00bcd4,#00d4ff)",
                  border: "none",
                }}
              >
                {loading ? "Saving..." : (<><Save size={18} className="me-2" /> Save Listing</>)}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`position-fixed top-0 end-0 mt-4 me-4 px-4 py-3 rounded text-white shadow ${
              toast.type === "success"
                ? "bg-success"
                : toast.type === "error"
                ? "bg-danger"
                : "bg-info"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateListing;
