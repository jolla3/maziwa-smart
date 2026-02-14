import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { MapPin, Eye, Heart, ShoppingCart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material"; // ✅ Added for dynamic sizing
import { AuthContext } from "../../../../../PrivateComponents/AuthContext";
import { marketApi } from "../../api/market.api";
import { imgUrl, getFirstImage } from "../../utils/image.utils";
import { formatCurrency, timeAgo } from "../../utils/currency.utils";
import useListingViews from "../../hooks/useListingViews";

const speciesConfig = {
  cow: { color: "#0d6efd", emoji: "🐄" },
  goat: { color: "#198754", emoji: "🐐" },
  sheep: { color: "#f59e0b", emoji: "🐑" },
  pig: { color: "#dc3545", emoji: "🐖" },
  bull: { color: "#6c757d", emoji: "🐂" },
};

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { incrementView } = useListingViews(listing._id);
  const [inWishlist, setInWishlist] = useState(false);
  const [inBasket, setInBasket] = useState(false);

  // ✅ Dynamic sizing based on device dimensions
  const isMobile = useMediaQuery("(max-width: 600px)"); // Mobile: <600px
  const isTablet = useMediaQuery("(min-width: 601px) and (max-width: 960px)"); // Tablet: 601-960px
  const isDesktop = useMediaQuery("(min-width: 961px)"); // Desktop: >960px

  // Set dynamic heights based on screen size
  const imageHeight = isMobile ? 150 : isTablet ? 180 : 200; // Smaller on mobile, larger on desktop
  const cardMinHeight = isMobile ? 350 : isTablet ? 380 : 400; // Adjust card height accordingly

  useEffect(() => {
    const checkStatus = () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const basket = JSON.parse(localStorage.getItem("basket") || "[]");
      setInWishlist(favorites.includes(listing._id));
      setInBasket(basket.some(item => item._id === listing._id));
    };

    checkStatus();

    const interval = setInterval(checkStatus, 500);
    return () => clearInterval(interval);
  }, [listing._id]);

  const handleView = async () => {
    await incrementView();
    navigate("/view-market", { state: { listing } });
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    let newFavorites;
    if (favorites.includes(listing._id)) {
      newFavorites = favorites.filter(id => id !== listing._id);
      setInWishlist(false);
    } else {
      newFavorites = [...favorites, listing._id];
      setInWishlist(true);
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    window.dispatchEvent(new Event("storage"));
  };

  const toggleBasket = (e) => {
    e.stopPropagation();
    if (listing.status === "sold") return;

    const basket = JSON.parse(localStorage.getItem("basket") || "[]");

    let newBasket;
    if (basket.some(item => item._id === listing._id)) {
      newBasket = basket.filter(item => item._id !== listing._id);
      setInBasket(false);
    } else {
      newBasket = [...basket, { ...listing, addedAt: new Date().toISOString() }];
      setInBasket(true);
    }

    localStorage.setItem("basket", JSON.stringify(newBasket));
    window.dispatchEvent(new Event("storage"));
  };

  const species = listing.animal_id?.species || "livestock";
  const speciesColor = speciesConfig[species]?.color || "#10b981";
  const speciesEmoji = speciesConfig[species]?.emoji || "📦";

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
      style={{
        cursor: "pointer",
        minHeight: `${cardMinHeight}px`, // ✅ Dynamic card height
      }}
    >
      <div className="position-relative" onClick={handleView}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: `${imageHeight}px`, // ✅ Dynamic image height
            overflow: "hidden",
            backgroundColor: "#f9fafb",
          }}
        >
          <img
            src={imgUrl(getFirstImage(listing))}
            alt={listing.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            className="card-zoom-img"
          />
        </div>

        <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
          <button
            className={`btn btn-sm shadow ${inWishlist ? "btn-danger" : "btn-light"}`}
            onClick={toggleWishlist}
            style={{ border: "none" }}
          >
            <Heart
              size={16}
              fill={inWishlist ? "white" : "none"}
              color={inWishlist ? "white" : "#0f172a"}
            />
          </button>

          <button
            className={`btn btn-sm shadow ${inBasket ? "btn-success" : "btn-light"}`}
            onClick={toggleBasket}
            disabled={listing.status === "sold"}
            style={{ border: "none" }}
          >
            <ShoppingCart
              size={16}
              color={inBasket ? "white" : "#0f172a"}
            />
          </button>
        </div>

        <div className="position-absolute bottom-0 start-0 m-2">
          <span
            className="badge text-white"
            style={{ backgroundColor: speciesColor }}
          >
            {speciesEmoji} {species}
          </span>
        </div>
      </div>

      <div className="card-body p-3" onClick={handleView}>
        <h6 className="fw-bold mb-2 text-truncate" style={{ color: "#0f172a" }}>
          {listing.title}
        </h6>

        <div className="d-flex align-items-center mb-2">
          <MapPin size={14} style={{ color: "#10b981" }} className="me-1" />
          <span className="text-truncate" style={{ color: "#0f172a", fontSize: "0.9rem" }}>
            {listing.location || "Location not specified"}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-bold mb-0" style={{ color: "#10b981" }}>
            {formatCurrency(listing.price)}
          </h5>
          <div className="d-flex align-items-center" style={{ color: "#0f172a" }}>
            <Eye size={14} className="me-1" />
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              {listing.views?.count || 0} views
            </span>
          </div>
        </div>

        <div className="d-flex gap-1 flex-wrap mb-2">
          {listing.animal_id?.gender && (
            <span className="badge" style={{ backgroundColor: "#3b82f6", color: "white" }}>
              {listing.animal_id.gender === "male" ? "♂" : "♀"} {listing.animal_id.gender}
            </span>
          )}
          {listing.animal_id?.stage && (
            <span className="badge" style={{ backgroundColor: "#8b5cf6", color: "white" }}>
              {listing.animal_id.stage}
            </span>
          )}
          {listing.animal_id?.status === "pregnant" && (
            <span className="badge" style={{ backgroundColor: "#f59e0b", color: "white" }}>
              🤰 Pregnant
            </span>
          )}
        </div>

        <div className="d-flex align-items-center">
          <Calendar size={12} style={{ color: "#10b981" }} className="me-1" />
          <small style={{ color: "#0f172a" }}>{timeAgo(listing.createdAt)}</small>
        </div>
      </div>

      <style>{`
        .card:hover .card-zoom-img {
          transform: scale(1.08);
        }
      `}</style>
    </motion.div>
  );
}