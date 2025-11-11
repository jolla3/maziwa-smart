import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import ImageGallery from "./market view/ImageGallery";
import StatsBar from "./market view/StatsBar";
import AnimalDetailsCard from "./market view/AnimalDetailsCard";
import ActionButtons from "./market view/ActionButtons";
import ChatModal from "./market view/ChatModal";
import ContactModal from "./market view/ContactModal";

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
    if (!path) return DEFAULT_IMAGE;
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith("/uploads/")) {
      const relative = path.replace("/uploads/", "");
      return `${API_BASE.replace("/api", "")}/image/${relative}`;
    }
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
        const images = getDisplayImages(fetchedListing);
        setMainPhoto(images[0] || DEFAULT_IMAGE);
      } else {
        setError(res.data.message || "Failed to fetch listing");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server error while loading listing");
    } finally {
      setLoading(false);
    }
  };

  // Initialize listing on mount
  useEffect(() => {
    const stateData = location.state;
    if (stateData?.listing) {
      setListing(stateData.listing);
      const images = getDisplayImages(stateData.listing);
      setMainPhoto(images[0] || DEFAULT_IMAGE);
      setLoading(false);
    } else if (stateData?.id) {
      fetchListingById(stateData.id);
    } else {
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
    const species = listing?.animal?.species;
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

      navigate("/chatroom", { state: { receiverId: listing.sellerData, receiver: "" } });
      alert("Seller information not available")
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

  return (
    <div className="container-fluid px-3 py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
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
          <ImageGallery
            displayImages={displayImages}
            mainPhoto={mainPhoto}
            setMainPhoto={setMainPhoto}
            imgUrl={imgUrl}
            DEFAULT_IMAGE={DEFAULT_IMAGE}
          />

          <StatsBar
            views={views}
            createdAt={createdAt}
            location={loc}
          />
        </div>

        {/* Details Section */}
        <div className="col-12 col-lg-5">
          {/* Title & Price Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm rounded-4 mb-3"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-white text-primary">
                  {animal?.species || "Livestock"}
                </span>
                {animal?.status === "pregnant" && (
                  <span className="badge bg-warning text-dark">
                    Pregnant
                  </span>
                )}
              </div>
              <h3 className="fw-bold mb-3">{title}</h3>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-0 small opacity-75">Price</p>
                  <h2 className="fw-bold mb-0">{formattedPrice}</h2>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimalDetailsCard animal={animal} />

          <ActionButtons
            seller={seller}
            handleOpenChat={handleOpenChat}
            setShowContactModal={setShowContactModal}
          />
        </div>
      </div>

      <ChatModal
        showChatModal={showChatModal}
        setShowChatModal={setShowChatModal}
        seller={seller}
        listing={listing}
      />

      <ContactModal
        showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}
        seller={seller}
        title={title}
      />
    </div>
  );
};

export default MarketView;