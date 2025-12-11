import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../PrivateComponents/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ArrowLeft, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = process.env.REACT_APP_API_BASE
// ✅ Image URL fixer (Cloudinary already returns full URLs)
const getImageUrl = (url) => {
  if (!url) return "https://placehold.co/600x400?text=No+Image";
  return url.startsWith("http") ? url : `${API_BASE.replace("/api", "")}/${url}`;
};

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
      insemination_id: "",
    },
  });

  const [animals, setAnimals] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const stageOptions = {
    cow: ["calf", "heifer", "cow"],
    bull: ["bull_calf", "young_bull", "mature_bull"],
    goat: ["kid", "doeling", "buckling", "nanny", "buck"],
    sheep: ["lamb", "ewe", "ram"],
    pig: ["piglet", "gilt", "sow", "boar"],
  };

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      showToast("Maximum 10 images allowed", "error");
      return;
    }

    // ✅ Ensure images preview locally before Cloudinary upload
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

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 4000);
  };

  useEffect(() => {
    return () => {
      // Revoke local image object URLs to avoid memory leaks
      images.forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  // --- Corrected handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.animal_type) return showToast("Select the animal type first", "error");
    if (user?.role === "farmer" && !form.animal_id)
      return showToast("Please select an animal from your herd", "error");
    if (user?.role === "seller" && (!form.animal_details.age || !form.animal_details.breed_name))
      return showToast("Please provide animal age and breed name", "error");
    if (images.length === 0) return showToast("Please upload at least one image", "error");

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
        formData.append("animal_details", JSON.stringify(form.animal_details));
      }

      // ✅ Append actual File objects (not preview URLs)
      images.forEach((img) => {
        formData.append("images", img.file); // keep `images` as field name!
      });

      // --- Debug FormData content if needed ---
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const res = await axios.post(`${API_BASE}/listing`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not set Content-Type! Let Axios handle it.
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / (progressEvent.total || 1)) * 100
          );
          setUploadProgress({ total: percent });
        },
      });

      if (res.data.success) {
        showToast("✅ Listing created successfully!", "success");
        setTimeout(() => navigate("/slr.drb/my-listings"), 1500);
      } else {
        showToast(res.data.message || "Failed to create listing", "error");
      }
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      showToast(
        err.response?.data?.message || "Server error during listing creation",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAnimals = form.animal_type
    ? animals.filter(
      (a) => a?.species?.toLowerCase() === form.animal_type?.toLowerCase()
    )
    : [];

  return (
    <div className="container-fluid px-3 py-4" style={{ background: "#f8fdff", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto card shadow-sm border-0"
        style={{ background: "#ffffff", borderRadius: "1rem", maxWidth: "900px" }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-primary m-0">Post a New Listing 🐄</h3>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-outline-secondary rounded-pill"
              onClick={() => navigate("/slr.drb/my-listings")}
              type="button"
            >
              <ArrowLeft size={16} className="me-1" /> Back
            </motion.button>
          </div>

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
                      animal_id: "",
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
                  disabled={!form.animal_type}
                  required
                >
                  <option value="">
                    {!form.animal_type
                      ? "Select animal type first"
                      : `Choose from your ${form.animal_type}s`}
                  </option>
                  {filteredAnimals.map((a) => {
                    const animalId = a._id || a.id;
                    const displayName = `${a.cow_name || a.name || "Unnamed"} (${a.species}) - ${a.breed?.name || a.breed || "Unknown"
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

            {user?.role === "seller" && (
              <div className="border rounded p-3 mb-3" style={{ background: "#f0f9ff" }}>
                <h5 className="fw-semibold text-primary mb-3">Animal Details</h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Age (e.g., 3 years) *</label>
                    <input
                      name="animal_details.age"
                      type="text"
                      className="form-control"
                      placeholder="3 years"
                      value={form.animal_details.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Breed Name *</label>
                    <input
                      name="animal_details.breed_name"
                      type="text"
                      className="form-control"
                      placeholder="Friesian"
                      value={form.animal_details.breed_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      name="animal_details.gender"
                      className="form-select"
                      value={form.animal_details.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Stage</label>
                    <select
                      name="animal_details.stage"
                      className="form-select"
                      value={form.animal_details.stage}
                      onChange={handleChange}
                      disabled={!form.animal_type}
                    >
                      <option value="">Select stage</option>
                      {form.animal_type && stageOptions[form.animal_type]?.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Lifetime Milk (L)</label>
                    <input
                      name="animal_details.lifetime_milk"
                      type="number"
                      className="form-control"
                      placeholder="5000"
                      value={form.animal_details.lifetime_milk}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Daily Average (L)</label>
                    <input
                      name="animal_details.daily_average"
                      type="number"
                      className="form-control"
                      placeholder="15"
                      value={form.animal_details.daily_average}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Total Offspring</label>
                    <input
                      name="animal_details.total_offspring"
                      type="number"
                      className="form-control"
                      placeholder="3"
                      value={form.animal_details.total_offspring}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Bull Code</label>
                    <input
                      name="animal_details.bull_code"
                      type="text"
                      className="form-control"
                      placeholder="B001"
                      value={form.animal_details.bull_code}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Bull Name</label>
                    <input
                      name="animal_details.bull_name"
                      type="text"
                      className="form-control"
                      placeholder="Thunder"
                      value={form.animal_details.bull_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Bull Breed</label>
                    <input
                      name="animal_details.bull_breed"
                      type="text"
                      className="form-control"
                      placeholder="Angus"
                      value={form.animal_details.bull_breed}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row align-items-end">
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        name="animal_details.is_pregnant"
                        type="checkbox"
                        className="form-check-input"
                        id="isPregnant"
                        checked={form.animal_details.is_pregnant}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="isPregnant">
                        Is Pregnant?
                      </label>
                    </div>
                  </div>

                  {form.animal_details.is_pregnant && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Expected Due Date</label>
                      <input
                        name="animal_details.expected_due_date"
                        type="date"
                        className="form-control"
                        value={form.animal_details.expected_due_date}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

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

            <div className="mb-4">
              <label className="form-label fw-semibold">Upload Images (Max 10) *</label>
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
                      src={img.preview || getImageUrl(img.url)}
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

                    {/* 🩵 Progress overlay bar */}
                    {loading && (
                      <div
                        className="position-absolute bottom-0 start-0 w-100 bg-light rounded-bottom overflow-hidden"
                        style={{ height: "6px" }}
                      >
                        <div
                          className="bg-primary"
                          style={{
                            width: `${uploadProgress.total || 0}%`,
                            height: "100%",
                            transition: "width 0.3s ease",
                          }}
                        />
                        {loading && (
                          <small className="text-primary fw-semibold d-block text-center mt-1">
                            {uploadProgress.total || 0}%
                          </small>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

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

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`position-fixed top-0 end-0 mt-4 me-4 px-4 py-3 rounded text-white shadow ${toast.type === "success"
              ? "bg-success"
              : toast.type === "error"
                ? "bg-danger"
                : "bg-info"
              }`}
            style={{ zIndex: 9999 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateListing;