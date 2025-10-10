import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ArrowLeft,
  Save,
  Trash2,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../PrivateComponents/AuthContext";

const API_BASE = "https://maziwasmart.onrender.com/api";

export default function EditListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useContext(AuthContext);

  const listingData = location.state?.listing || null;
  const [listing, setListing] = useState(listingData);
  const [loading, setLoading] = useState(!listingData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [showConfirm, setShowConfirm] = useState({ show: false, index: null });
  const [deletingPhoto, setDeletingPhoto] = useState(false);

  const [form, setForm] = useState({ title: "", price: "", animal_type: "", description: "", location: "" });
  const [animalDetails, setAnimalDetails] = useState({ age: "", breed_name: "", gender: "" });
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileRef = useRef();
  const MAX_PHOTOS = 10;

  useEffect(() => {
    if (!listingData && location.state?.listingId) {
      fetchListing();
    } else if (listingData) {
      prefill(listingData);
    } else {
      showToast("error", "No listing data provided");
      setTimeout(() => navigate("/my-listings"), 2000);
    }
  }, []);

  const prefill = (data) => {
    setListing(data);
    setForm({
      title: data.title || "",
      price: data.price || "",
      animal_type: data.animal_type || "",
      description: data.description || "",
      location: data.location || "",
    });
    setExistingPhotos(data.photos || []);
    if (data.animal_info) {
      setAnimalDetails({
        age: calculateAge(data.animal_info.birth_date),
        breed_name: data.animal_info.breed?.name || "",
        gender: data.animal_info.gender || "",
      });
    }
    setLoading(false);
  };

  const fetchListing = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/listing/${location.state.listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) prefill(res.data.listing);
      else showToast("error", "Failed to load listing");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const now = new Date();
    const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;
    return `${displayYears}y ${displayMonths}m`;
  };

  const handleNewFiles = useCallback(
    (files) => {
      const currentTotal = existingPhotos.length + newFiles.length;
      const available = MAX_PHOTOS - currentTotal;
      if (available <= 0) return showToast("error", `Maximum ${MAX_PHOTOS} photos allowed`);

      const arr = Array.from(files).slice(0, available);
      if (arr.length < files.length) showToast("warning", `Only ${arr.length} photos added (max ${MAX_PHOTOS})`);
      setNewFiles((prev) => [...prev, ...arr]);
      arr.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => setPreviews((p) => [...p, reader.result]);
        reader.readAsDataURL(file);
      });
    },
    [existingPhotos.length, newFiles.length]
  );

  const confirmDelete = async () => {
    if (showConfirm.index === null) return;
    setDeletingPhoto(true);
    const photoIndex = showConfirm.index;
    try {
      const remaining = existingPhotos.filter((_, i) => i !== photoIndex);
      const formData = new FormData();
      remaining.forEach((p) => formData.append("photos", p));

      const listingId = listing?._id || listing?.id;
      const res = await axios.put(`${API_BASE}/listing/${listingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setExistingPhotos(remaining);
        showToast("success", "Photo deleted successfully");
      } else showToast("error", res.data.message || "Failed to delete photo");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete photo");
    } finally {
      setDeletingPhoto(false);
      setShowConfirm({ show: false, index: null });
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.animal_type || !form.location) return showToast("error", "Fill required fields");

    const listingId = listing?._id || listing?.id;
    if (!listingId) return showToast("error", "Invalid listing ID");

    setSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    existingPhotos.forEach((p) => formData.append("photos", p));
    if (user?.role === "seller" && animalDetails.age) formData.append("animal_details", JSON.stringify(animalDetails));
    newFiles.forEach((f) => formData.append("images", f));

    try {
      const res = await axios.put(`${API_BASE}/listing/${listingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setListing(res.data.listing);
        setExistingPhotos(res.data.listing.photos || []);
        showToast("success", "Listing updated successfully");
        setTimeout(() => navigate("/my-listings"), 1500);
      } else showToast("error", res.data.message || "Failed to update");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const getImageUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("http")) return photo;
    if (photo.startsWith("/uploads")) return `${API_BASE.replace("/api", "")}${photo}`;
    return photo;
  };

  return (
    <div className="container py-4">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="d-flex align-items-center mb-3">
            <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/my-listings")}>
              <ArrowLeft size={18} /> Back
            </button>
            <h4 className="fw-bold mb-0">Edit Listing</h4>
          </div>

          {/* form inputs */}
          <div className="mb-3">
            <label>Title</label>
            <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="mb-3">
            <label>Price</label>
            <input className="form-control" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>

          <div className="mb-3">
            <label>Animal Type</label>
            <input className="form-control" value={form.animal_type} onChange={(e) => setForm({ ...form, animal_type: e.target.value })} />
          </div>

          <div className="mb-3">
            <label>Location</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
          </div>

          <div className="mb-3">
            <button className="btn btn-success" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {toast.show && (
          <motion.div className={`toast align-items-center text-white bg-${toast.type === "success" ? "success" : toast.type === "warning" ? "warning" : "danger"}`} style={{ position: "fixed", bottom: 20, right: 20 }}>
            <div className="d-flex p-3">
              <div>{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
