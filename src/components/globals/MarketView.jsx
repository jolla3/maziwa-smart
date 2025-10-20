import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Info,
  PhoneCall,
  Image,
  Eye,
  Calendar,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  TrendingUp,
  Award,
  Milk,
  Baby,
} from "lucide-react";
import { AuthContext } from "../PrivateComponents/AuthContext";
import ChatRoom from "./ChatRoom";

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://maziwasmart.onrender.com/api";

const MarketView = () => {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [mainPhoto, setMainPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80";

  // Helper function to convert relative paths to full URLs
  const imgUrl = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80";
  }

  // If full URL (external image), return as is
  if (/^https?:\/\//.test(path)) return path;

  // If old /uploads path, rewrite to proxy endpoint
  if (path.startsWith("/uploads/")) {
    const relative = path.replace("/uploads/", "");
    return `${API_BASE.replace("/api", "")}/image/${relative}`;
  }

  // Default fallback
  return `${API_BASE.replace("/api", "")}${path}`;
};



  // Get all available images from listing
  const getDisplayImages = (listing) => {
    if (!listing) return [];
    const images = listing.images || listing.photos || listing.animal?.photos || [];
    return images.length > 0 ? images : [DEFAULT_IMAGE];
  };

  // Fetch listing by ID
  const fetchListingById = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/market/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.listing) {
        const fetchedListing = res.data.listing;
        setListing(fetchedListing);
        
        // Initialize mainPhoto with first available image
        const images = getDisplayImages(fetchedListing);
        setMainPhoto(images[0] || DEFAULT_IMAGE);
      } else {
        setError(res.data.message || "Failed to fetch listing");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Server error while loading listing");
    } finally {
      setLoading(false);
    }
  };

  // Initialize listing on mount
  useEffect(() => {
    const stateData = location.state;
    
    if (stateData?.listing) {
      // Listing was preloaded via navigation state
      setListing(stateData.listing);
      const images = getDisplayImages(stateData.listing);
      setMainPhoto(images[0] || DEFAULT_IMAGE);
      setLoading(false);
    } else if (stateData?.id) {
      // Only ID provided, fetch the listing
      fetchListingById(stateData.id);
    } else {
      // No data provided
      setError("No listing data provided");
      setLoading(false);
    }
  }, []);

  // Update favorites when listing changes
  useEffect(() => {
    if (listing?._id) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(listing._id));
    }
  }, [listing]);

  const toggleFavorite = () => {
    if (!listing?._id) return;
    
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== listing._id);
    } else {
      newFavorites = [...favorites, listing._id];
    }
    
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    const species = listing?.animal?.species || "livestock";
    const formattedPrice = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(listing?.price || 0);

    if (navigator.share) {
      navigator.share({
        title: listing?.title || "Livestock Listing",
        text: `Check out this ${species} for ${formattedPrice}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleOpenChat = () => {
    if (!listing?.seller?._id) {
      alert("Seller information not available");
      return;
    }
    setShowChatModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
        <p className="text-muted">Loading listing details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-sm rounded-4 text-center py-5"
        >
          <h5 className="text-danger mb-3">{error || "Listing not found"}</h5>
          <button 
            className="btn btn-primary rounded-pill px-4" 
            onClick={() => navigate("/market")}
          >
            <ArrowLeft size={16} className="me-2" /> Back to Market
          </button>
        </motion.div>
      </div>
    );
  }

  const { title, price, location: loc, createdAt, views, animal, seller } = listing;
  const displayImages = getDisplayImages(listing);

  const formattedPrice = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price || 0);

  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const speciesConfig = {
    cow: { color: "primary", emoji: "🐄" },
    goat: { color: "success", emoji: "🐐" },
    sheep: { color: "warning", emoji: "🐑" },
    pig: { color: "danger", emoji: "🐖" },
  };

  const animalConfig = speciesConfig[animal?.species?.toLowerCase()] || { color: "secondary", emoji: "🐾" };

  return (
    <div className="container-fluid px-3 py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <style>{`
        .image-gallery-main {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .image-gallery-main img {
          transition: transform 0.5s ease;
        }
        .image-gallery-main:hover img {
          transform: scale(1.05);
        }
        .thumbnail-img {
          transition: all 0.3s ease;
          border: 3px solid transparent;
        }
        .thumbnail-img:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .thumbnail-img.active {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        .info-card {
          transition: all 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
        }
      `}</style>

      {/* Header with Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center mb-4 bg-white rounded-4 shadow-sm p-3"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="btn btn-light rounded-circle shadow-sm"
          onClick={() => navigate("/market")}
        >
          <ArrowLeft size={20} />
        </motion.button>
        
        <div className="d-flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`btn rounded-circle shadow-sm ${isFavorite ? 'btn-danger' : 'btn-light'}`}
            onClick={toggleFavorite}
          >
            <Heart size={20} fill={isFavorite ? "white" : "none"} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-light rounded-circle shadow-sm"
            onClick={handleShare}
          >
            <Share2 size={20} />
          </motion.button>
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Image Gallery Section */}
        <div className="col-12 col-lg-7">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm rounded-4 overflow-hidden info-card"
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Image size={20} className="text-primary" />
                  Gallery
                </h6>
                <span className="badge bg-light text-dark">
                  {displayImages.length} Photos
                </span>
              </div>

              {/* Main Image */}
              <div className="image-gallery-main mb-3">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mainPhoto}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={imgUrl(mainPhoto)}
                    alt="Main view"
                    className="w-100 object-fit-cover"
                    style={{ height: "450px", borderRadius: "20px" }}
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Thumbnail Strip */}
              <div className="d-flex gap-2 overflow-auto pb-2">
                {displayImages.map((img, i) => (
                  <motion.img
                    key={i}
                    src={imgUrl(img)}
                    alt={`Thumbnail ${i + 1}`}
                    className={`thumbnail-img rounded-3 object-fit-cover ${
                      imgUrl(mainPhoto) === imgUrl(img) ? "active" : ""
                    }`}
                    style={{
                      width: "100px",
                      height: "75px",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMainPhoto(img)}
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="row g-3 mt-2"
          >
            <div className="col-4">
              <div className="card border-0 shadow-sm rounded-4 info-card">
                <div className="card-body text-center py-3">
                  <Eye className="text-primary mb-2" size={24} />
                  <h5 className="fw-bold mb-0">{views || 0}</h5>
                  <small className="text-muted">Views</small>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card border-0 shadow-sm rounded-4 info-card">
                <div className="card-body text-center py-3">
                  <Calendar className="text-success mb-2" size={24} />
                  <h6 className="fw-bold mb-0 small">{timeAgo(createdAt)}</h6>
                  <small className="text-muted">Posted</small>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card border-0 shadow-sm rounded-4 info-card">
                <div className="card-body text-center py-3">
                  <MapPin className="text-danger mb-2" size={24} />
                  <h6 className="fw-bold mb-0 small text-truncate">{loc || "Kenya"}</h6>
                  <small className="text-muted">Location</small>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Details Section */}
        <div className="col-12 col-lg-5">
          {/* Title & Price Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm rounded-4 mb-3 info-card"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`badge bg-white text-${animalConfig.color}`}>
                  {animalConfig.emoji} {animal?.species || "Livestock"}
                </span>
                {animal?.status === "pregnant" && (
                  <span className="badge bg-warning text-dark">
                    🤰 Pregnant
                  </span>
                )}
              </div>
              <h3 className="fw-bold mb-3">{title}</h3>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-0 small opacity-75">Price</p>
                  <h2 className="fw-bold mb-0">{formattedPrice}</h2>
                </div>
                <DollarSign size={48} className="opacity-50" />
              </div>
            </div>
          </motion.div>

          {/* Animal Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card border-0 shadow-sm rounded-4 mb-3 info-card"
          >
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Info size={20} className="text-primary" />
                Animal Details
              </h6>
              
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block mb-1">Name</small>
                    <strong>{animal?.name || "N/A"}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block mb-1">Species</small>
                    <strong className="text-capitalize">{animal?.species || "Unknown"}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block mb-1">Gender</small>
                    <strong className="text-capitalize">
                      {animal?.gender === "male" ? "♂ Male" : animal?.gender === "female" ? "♀ Female" : "N/A"}
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block mb-1">Stage</small>
                    <strong className="text-capitalize">{animal?.stage || "N/A"}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block mb-1">Status</small>
                    <span className={`badge ${animal?.status === "pregnant" ? "bg-warning" : "bg-success"}`}>
                      {animal?.status || "Available"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block mb-1">Breed</small>
                    <strong>{animal?.breed || "Unknown"}</strong>
                  </div>
                </div>
              </div>

              {/* Production Stats */}
              {(animal?.lifetime_milk || animal?.daily_average || animal?.calved_count > 0) && (
                <div className="mt-3">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <TrendingUp size={18} className="text-success" />
                    Production Stats
                  </h6>
                  <div className="row g-2">
                    {animal?.daily_average && (
                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between p-3 bg-success bg-opacity-10 rounded-3">
                          <div className="d-flex align-items-center gap-2">
                            <Milk size={18} className="text-success" />
                            <span className="small fw-semibold">Daily Milk</span>
                          </div>
                          <strong className="text-success">{animal.daily_average} L/day</strong>
                        </div>
                      </div>
                    )}
                    {animal?.lifetime_milk && (
                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between p-3 bg-primary bg-opacity-10 rounded-3">
                          <div className="d-flex align-items-center gap-2">
                            <Award size={18} className="text-primary" />
                            <span className="small fw-semibold">Lifetime Milk</span>
                          </div>
                          <strong className="text-primary">
                            {animal.lifetime_milk.toLocaleString()} L
                          </strong>
                        </div>
                      </div>
                    )}
                    {animal?.calved_count > 0 && (
                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between p-3 bg-warning bg-opacity-10 rounded-3">
                          <div className="d-flex align-items-center gap-2">
                            <Baby size={18} className="text-warning" />
                            <span className="small fw-semibold">Calved Count</span>
                          </div>
                          <strong className="text-warning">{animal.calved_count}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="d-flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-lg rounded-pill flex-grow-1 shadow"
              onClick={handleOpenChat}
              disabled={!seller?._id}
            >
              <MessageCircle size={20} className="me-2" />
              Chat with Seller
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline-primary btn-lg rounded-circle shadow-sm"
              onClick={() => setShowContactModal(true)}
            >
              <PhoneCall size={20} />
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <div className="mt-3 p-3 bg-white rounded-4 shadow-sm">
            <div className="d-flex align-items-center gap-2 text-success small">
              <CheckCircle size={16} />
              <span>Verified product</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-primary small mt-2">
              <CheckCircle size={16} />
              <span>Secure Payment Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && seller?._id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="position-absolute top-50 start-50 translate-middle"
              style={{ width: "90vw", height: "90vh", maxWidth: "1200px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-4 shadow-lg h-100 overflow-hidden">
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <h5 className="mb-0 fw-bold">Chat with Seller</h5>
                  <button
                    className="btn btn-light rounded-circle"
                    onClick={() => setShowChatModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="h-100">
                  <ChatRoom
                    receiverId={seller._id}
                    listingId={listing._id}
                    onBack={() => setShowChatModal(false)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Phone Modal */}
      <AnimatePresence>
        {showContactModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop show"
              onClick={() => setShowContactModal(false)}
            />
            <div className="modal show d-block" tabIndex="-1">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modal-dialog modal-dialog-centered"
              >
                <div className="modal-content rounded-4 shadow-lg">
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold">Contact Seller</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowContactModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <p className="text-muted">
                      To contact the seller about <strong>{title}</strong>, please call:
                    </p>
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                      <PhoneCall className="text-primary" size={24} />
                      <div>
                        <small className="text-muted d-block">Seller Phone</small>
                        <strong className="h5 mb-0">{seller?.phone || "+254 XXX XXX XXX"}</strong>
                      </div>
                    </div>
                    <p className="small text-muted mt-3 mb-0">
                      <strong>Tip:</strong> Mention you saw this listing on the marketplace
                    </p>
                  </div>
                  <div className="modal-footer border-0">
                    <button
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => setShowContactModal(false)}
                    >
                      Close
                    </button>
                    <a
                      href={`tel:${seller?.phone || ""}`}
                      className="btn btn-primary rounded-pill px-4"
                    >
                      <PhoneCall size={18} className="me-2" />
                      Call Now
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketView;