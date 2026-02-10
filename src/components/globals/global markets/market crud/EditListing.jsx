import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ArrowLeft,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../PrivateComponents/AuthContext";
import EditListingForm from "./EditListingForm"; // ✅ Import separated form
import EditListingPhotos from "./EditListingPhotos"; // ✅ Import separated photos

const API_BASE = process.env.REACT_APP_API_BASE;

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

  const [form, setForm] = useState({
    title: "",
    price: "",
    animal_type: "",
    description: "",
    location: "",
  });

  const [animalDetails, setAnimalDetails] = useState({
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
  });

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const MAX_PHOTOS = 10;

  const stageOptions = {
    cow: ["calf", "heifer", "cow"],
    bull: ["bull_calf", "young_bull", "mature_bull"],
    goat: ["kid", "doeling", "buckling", "nanny", "buck"],
    sheep: ["lamb", "ewe", "ram"],
    pig: ["piglet", "gilt", "sow", "boar"],
  };

  useEffect(() => {
    if (!listingData && location.state?.listingId) {
      fetchListing();
    } else if (listingData) {
      prefill(listingData);
    } else {
      showToast("error", "No listing data provided");
      setTimeout(() => navigate("/fmr.drb/my-listings"), 2000);
    }
  }, []);

  const prefill = (data) => {
    console.log("Prefilling with data:", data);
    setListing(data);
    setForm({
      title: data.title || "",
      price: data.price || "",
      animal_type: data.animal_type || "",
      description: data.description || "",
      location: data.location || "",
    });
    setExistingPhotos(data.photos || []);
    // ✅ Prefill animal_details from listing (already populated from animal for farmers)
    if (data.animal_details) {
      setAnimalDetails({
        age: data.animal_details.age || "",
        breed_name: data.animal_details.breed_name || "",
        gender: data.animal_details.gender || "",
        bull_code: data.animal_details.bull_code || "",
        bull_name: data.animal_details.bull_name || "",
        bull_breed: data.animal_details.bull_breed || "",
        status: data.animal_details.status || "active",
        stage: data.animal_details.stage || "",
        lifetime_milk: data.animal_details.lifetime_milk || "",
        daily_average: data.animal_details.daily_average || "",
        total_offspring: data.animal_details.total_offspring || "",
        is_pregnant: data.animal_details.pregnancy?.is_pregnant || false,
        expected_due_date: data.animal_details.pregnancy?.expected_due_date || "",
        insemination_id: data.animal_details.pregnancy?.insemination_id || "",
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
      if (res.data.success) {
        prefill(res.data.listing);
      } else {
        setError("Failed to load listing");
        showToast("error", "Failed to load listing");
      }
    } catch (err) {
      setError("Failed to load listing");
      showToast("error", err.response?.data?.message || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleAnimalDetailsChange = (updatedDetails) => {
    setAnimalDetails(updatedDetails);
  };

  const handleNewFiles = useCallback((files) => {
    const currentTotal = existingPhotos.length + newFiles.length;
    const available = MAX_PHOTOS - currentTotal;

    if (available <= 0) {
      showToast("error", `Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }

    const arr = Array.from(files).slice(0, available);

    if (arr.length < files.length) {
      showToast("warning", `Only ${arr.length} photos added (max ${MAX_PHOTOS} total)`);
    }

    const newFilesList = [...arr];
    setNewFiles((prev) => [...prev, ...newFilesList]);

    // Create previews for each file
    newFilesList.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((p) => [...p, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, [existingPhotos.length, newFiles.length]);

  const removePreview = (i) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const deleteExistingPhoto = (index) => {
    setShowConfirm({ show: true, index });
  };

  const confirmDelete = async () => {
    if (showConfirm.index === null) return;

    const photoIndex = showConfirm.index;
    setDeletingPhoto(true);

    try {
      const remaining = existingPhotos.filter((_, i) => i !== photoIndex);

      // ✅ Send as JSON, not FormData
      const listingId = listing._id || listing.id;
      const res = await axios.patch(
        `${API_BASE}/listing/${listingId}`,
        { photos: remaining }, // Send as plain object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setExistingPhotos(remaining);
        setListing(res.data.listing);
        showToast("success", "Photo deleted successfully");
      } else {
        showToast("error", res.data.message || "Failed to delete photo");
      }
    } catch (err) {
      console.error("Delete photo error:", err);
      showToast("error", err.response?.data?.message || "Failed to delete photo");
    } finally {
      setDeletingPhoto(false);
      setShowConfirm({ show: false, index: null });
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      showToast("error", "Title is required");
      return false;
    }
    if (!form.price || form.price <= 0) {
      showToast("error", "Valid price is required");
      return false;
    }
    if (!form.animal_type.trim()) {
      showToast("error", "Animal type is required");
      return false;
    }
    if (!form.location.trim()) {
      showToast("error", "Location is required");
      return false;
    }
    if (existingPhotos.length + newFiles.length === 0) {
      showToast("error", "At least one photo is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!listing?._id && !listing?.id) {
      showToast("error", "Invalid listing ID");
      return;
    }

    setSaving(true);
    const formData = new FormData();

    // Add form fields
    Object.entries(form).forEach(([k, v]) => {
      formData.append(k, v);
    });

    // ✅ Add existing photos as separate indexed fields
    existingPhotos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });

    // ✅ Add animal_details for both farmers and sellers
    formData.append("animal_details", JSON.stringify(animalDetails));

    // Add new image files
    newFiles.forEach((file) => {
      formData.append("images", file);
    });

    const listingId = listing._id || listing.id;

    try {
      const res = await axios.patch(
        `${API_BASE}/listing/${listingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setListing(res.data.listing);
        setExistingPhotos(res.data.listing.photos || []);
        showToast("success", "Listing updated successfully");
        setNewFiles([]);
        setPreviews([]);

        setTimeout(() => {
          navigate("/fmr.drb/my-listings");
        }, 1500);
      } else {
        showToast("error", res.data.message || "Failed to update listing");
      }
    } catch (err) {
      console.error("Save error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Server error during save";
      showToast("error", errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const currency = (n) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(n || 0);

  const totalPhotos = existingPhotos.length + newFiles.length;

  const getImageUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("http")) return photo;
    if (photo.startsWith("/uploads")) {
      return `${API_BASE.replace("/api", "")}${photo}`;
    }
    return photo;
  };

  return (
    <div className="container-fluid px-3 py-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading listing...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={20} className="me-2" />
          {error}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="d-flex align-items-center mb-4">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate("/fmr.drb/my-listings")}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <h4 className="mb-0 fw-bold">Edit Listing</h4>
          </div>

          <div className="row g-4">
            {/* Left: Form */}
            <div className="col-lg-7">
              <EditListingForm
                form={form}
                handleChange={handleChange}
                animalDetails={animalDetails}
                handleAnimalDetailsChange={handleAnimalDetailsChange}
                stageOptions={stageOptions}
                user={user}
              />
            </div>

            {/* Right: Photos */}
            <div className="col-lg-5">
              <EditListingPhotos
                existingPhotos={existingPhotos}
                previews={previews}
                newFiles={newFiles}
                MAX_PHOTOS={MAX_PHOTOS}
                handleNewFiles={handleNewFiles}
                removePreview={removePreview}
                deleteExistingPhoto={deleteExistingPhoto}
                getImageUrl={getImageUrl}  // ✅ Pass getImageUrl as prop
              />

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-outline-secondary w-50"
                  onClick={() => navigate("/fmr.drb/my-listings")}
                  disabled={saving}
                >
                  <ArrowLeft size={16} className="me-1" /> Cancel
                </button>
                <button
                  className="btn btn-success w-50 d-flex align-items-center justify-content-center"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <Loader size={16} className="me-1 spinner-border spinner-border-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="me-1" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Animated Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            className={`position-fixed bottom-0 end-0 m-3 p-3 rounded shadow-lg ${toast.type === "success"
              ? "bg-success"
              : toast.type === "warning"
                ? "bg-warning"
                : "bg-danger"
              } text-white`}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            style={{ zIndex: 9999, minWidth: 250 }}
          >
            <div className="d-flex align-items-center">
              {toast.type === "success" ? (
                <CheckCircle className="me-2" size={20} />
              ) : (
                <AlertCircle className="me-2" size={20} />
              )}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Confirm Modal */}
      <AnimatePresence>
        {showConfirm.show && (
          <motion.div
            className="modal fade show d-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !deletingPhoto) {
                setShowConfirm({ show: false, index: null });
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                className="modal-content"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
              >
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => !deletingPhoto && setShowConfirm({ show: false, index: null })}
                    disabled={deletingPhoto}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Are you sure you want to delete this photo? This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowConfirm({ show: false, index: null })}
                    disabled={deletingPhoto}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger d-flex align-items-center"
                    onClick={confirmDelete}
                    disabled={deletingPhoto}
                  >
                    {deletingPhoto ? (
                      <>
                        <Loader size={16} className="me-1 spinner-border spinner-border-sm" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} className="me-1" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}