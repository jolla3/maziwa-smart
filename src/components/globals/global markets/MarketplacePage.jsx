import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MapPin,
    Filter,
    TrendingUp,
    Eye,
    Heart,
    X,
    ShoppingBag,
    Sparkles,
    Calendar,
    
    Award,
    AlertCircle,
    Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../PrivateComponents/AuthContext";

const API_BASE =
    process.env.REACT_APP_API_BASE 

export default function MarketPage() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [trendingListings, setTrendingListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
    });

    const [filters, setFilters] = useState({
        species: "",
        gender: "",
        stage: "",
        breed: "",
        pregnant: "",
        minPrice: "",
        maxPrice: "",
        sort: "createdAt",
    });

    // Species color mapping for visual appeal
    const speciesConfig = {
        cow: { color: "bg-primary", emoji: "🐄" },
        goat: { color: "bg-success", emoji: "🐐" },
        sheep: { color: "bg-warning text-dark", emoji: "🐑" },
        pig: { color: "bg-danger", emoji: "🐖" },
    };

    // --- IMAGE HELPERS ---
    // Always use this to get the first image, regardless of source
    const getFirstImage = (listing) => {
        if (!listing) return "";
        let photos = [];
        if (Array.isArray(listing.photos)) photos = listing.photos;
        else if (Array.isArray(listing.images)) photos = listing.images;
        else if (typeof listing.photos === "string") {
            try {
                const parsed = JSON.parse(listing.photos);
                if (Array.isArray(parsed)) photos = parsed;
            } catch {
                photos = [];
            }
        }
        // Prefer first Cloudinary image
        if (photos.length > 0) return photos[0];
        return "https://placehold.co/600x400?text=No+Image";
    };

    // Always use this for URLs (handles Cloudinary, legacy, etc)
    const imgUrl = (path) => {
        if (!path) return "https://placehold.co/600x400?text=No+Image";
        if (/^https?:\/\//.test(path)) return path; // Cloudinary or remote image
        if (path.startsWith("/uploads/")) {
            const relative = path.replace("/uploads/", "");
            return `${API_BASE.replace("/api", "")}/photo/${relative}`;
        }
        return `${API_BASE.replace("/api", "")}${path}`;
    };

    // Fetch main listings
    const fetchListings = React.useCallback(async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== "")
            );
            // Optionally add searchQuery for backend-side search
            if (searchQuery) params.search = searchQuery;
            const res = await axios.get(`${API_BASE}/market`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setListings(res.data.listings);
                localStorage.setItem("cachedListings", JSON.stringify(res.data.listings));
            }
        } catch (err) {
            console.error("❌ Fetch market error:", err);
            const cached = localStorage.getItem("cachedListings");
            if (cached) setListings(JSON.parse(cached));
        } finally {
            setLoading(false);
        }
    }, [filters, token, searchQuery]);

    // Fetch trending listings
    const fetchTrending = React.useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/market/extra/trending`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setTrendingListings(res.data.listings);
            }
        } catch (err) {
            console.error("❌ Trending fetch error:", err);
        }
    }, [token]);

    useEffect(() => {
        fetchTrending();
    }, [fetchTrending]);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchListings();
        }, 300); // debounce 300ms to avoid multiple API hits
        return () => clearTimeout(delay);
    }, [filters, searchQuery, fetchListings]);

    const formatCurrency = (val) =>
        new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            maximumFractionDigits: 0,
        }).format(val || 0);

    const handleView = (listing) => {
        if (!listing) return;
        navigate("/view-market", { state: { listing } });
    };

    const toggleFavorite = (id) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter((fav) => fav !== id)
            : [...favorites, id];
        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    };

    // Frontend-side search as fallback (if backend doesn't support search param)
    const filteredListings = listings.filter((l) =>
        searchQuery
            ? l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (l.animal_id?.species?.toLowerCase() || "").includes(searchQuery.toLowerCase())
            : true
    );

    const timeAgo = (date) => {
        const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        return `${Math.floor(days / 30)}mo ago`;
    };

    return (
        <div className="container-fluid px-3 py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <style>{`
        .card-zoom-img {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .card:hover .card-zoom-img {
          transform: scale(1.08);
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          border: 1px solid rgba(102, 126, 234, 0.3) !important;
        }
        .filter-sticky {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
        }
        .badge-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          padding: 0.5rem;
          color: white;
          font-size: 0.75rem;
        }
      `}</style>

            {/* 🎯 Hero Header with Gradient */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="position-relative overflow-hidden rounded-4 shadow-lg mb-4"
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "3rem 2rem",
                }}
            >
                <div className="position-absolute top-0 end-0 opacity-25">
                    <Sparkles size={200} color="white" />
                </div>
                <div className="row align-items-center position-relative">
                    <div className="col-lg-7 mb-3 mb-lg-0 text-white">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="display-5 fw-bold mb-2">
                                🐄 Premium Livestock Marketplace
                            </h1>
                            <p className="lead mb-0 opacity-90">
                                Discover quality livestock from verified sellers across Kenya
                            </p>
                        </motion.div>
                    </div>
                    <div className="col-lg-5">
                        <div className="bg-white rounded-4 shadow-sm p-1">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-transparent border-0">
                                    <Search size={24} className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none"
                                    placeholder="Search livestock, breeds, location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ fontSize: "1rem" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 📊 Quick Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="row g-3 mb-4"
            >
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                                <ShoppingBag className="text-primary" size={28} />
                            </div>
                            <div>
                                <h3 className="fw-bold mb-0 text-primary">{listings.length}</h3>
                                <small className="text-muted">Active Listings</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                                <TrendingUp className="text-success" size={28} />
                            </div>
                            <div>
                                <h3 className="fw-bold mb-0 text-success">{trendingListings.length}</h3>
                                <small className="text-muted">Trending Now</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="bg-danger bg-opacity-10 rounded-3 p-3 me-3">
                                <Heart className="text-danger" size={28} />
                            </div>
                            <div>
                                <h3 className="fw-bold mb-0 text-danger">{favorites.length}</h3>
                                <small className="text-muted">Favorites</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="card border-0 shadow-sm rounded-4 bg-gradient text-white h-100 w-100"
                        style={{
                            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            cursor: "pointer",
                        }}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <Filter className="me-2" size={24} />
                            <span className="fw-bold">Advanced Filters</span>
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* 🎛️ Advanced Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="card border-0 shadow-sm rounded-4 overflow-hidden"
                    >
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0 d-flex align-items-center">
                                    <Filter className="me-2 text-primary" size={20} />
                                    Filter Your Search
                                </h5>
                                <button
                                    className="btn btn-sm btn-light rounded-circle"
                                    onClick={() => setShowFilters(false)}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold text-muted">
                                        Species
                                    </label>
                                    <select
                                        className="form-select rounded-3"
                                        value={filters.species}
                                        onChange={(e) =>
                                            setFilters({ ...filters, species: e.target.value })
                                        }
                                    >
                                        <option value="">All Species</option>
                                        <option value="cow">Cow 🐄</option>
                                        <option value="goat">Goat 🐐</option>
                                        <option value="sheep">Sheep 🐑</option>
                                        <option value="pig">Pig 🐖</option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold text-muted">
                                        Gender
                                    </label>
                                    <select
                                        className="form-select rounded-3"
                                        value={filters.gender}
                                        onChange={(e) =>
                                            setFilters({ ...filters, gender: e.target.value })
                                        }
                                    >
                                        <option value="">All Genders</option>
                                        <option value="female">Female ♀</option>
                                        <option value="male">Male ♂</option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold text-muted">
                                        Stage
                                    </label>
                                    <select
                                        className="form-select rounded-3"
                                        value={filters.stage}
                                        onChange={(e) =>
                                            setFilters({ ...filters, stage: e.target.value })
                                        }
                                    >
                                        <option value="">All Stages</option>
                                        <option value="calf">Calf</option>
                                        <option value="weaner">Weaner</option>
                                        <option value="mature">Mature</option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold text-muted">
                                        Min Price (KES)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="form-control rounded-3"
                                        value={filters.minPrice}
                                        onChange={(e) =>
                                            setFilters({ ...filters, minPrice: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold text-muted">
                                        Max Price (KES)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="100000"
                                        className="form-control rounded-3"
                                        value={filters.maxPrice}
                                        onChange={(e) =>
                                            setFilters({ ...filters, maxPrice: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold text-muted">
                                        Sort By
                                    </label>
                                    <select
                                        className="form-select rounded-3"
                                        value={filters.sort}
                                        onChange={(e) =>
                                            setFilters({ ...filters, sort: e.target.value })
                                        }
                                    >
                                        <option value="createdAt">Newest First</option>
                                        <option value="price_asc">Price: Low → High</option>
                                        <option value="price_desc">Price: High → Low</option>
                                        <option value="views_desc">Most Viewed</option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold text-muted">
                                        Pregnant
                                    </label>
                                    <select
                                        className="form-select rounded-3"
                                        value={filters.pregnant}
                                        onChange={(e) =>
                                            setFilters({ ...filters, pregnant: e.target.value })
                                        }
                                    >
                                        <option value="">All</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>

                                <div className="col-md-12">
                                    <button
                                        className="btn btn-outline-secondary rounded-3"
                                        onClick={() =>
                                            setFilters({
                                                species: "",
                                                gender: "",
                                                stage: "",
                                                breed: "",
                                                pregnant: "",
                                                minPrice: "",
                                                maxPrice: "",
                                                sort: "createdAt",
                                            })
                                        }
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🔥 Trending Section */}
            {trendingListings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4"
                >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4 className="fw-bold d-flex align-items-center mb-0">
                            <div
                                className="bg-danger bg-opacity-10 rounded-3 p-2 me-3"
                                style={{ display: "inline-flex" }}
                            >
                                <TrendingUp className="text-danger" size={24} />
                            </div>
                            Trending Listings
                        </h4>
                        <span className="badge bg-danger rounded-pill px-3 py-2 badge-pulse">
                            Hot Deals 🔥
                        </span>
                    </div>
                    <div className="row g-3">
                        {trendingListings.slice(0, 4).map((listing, idx) => (
                            <div key={listing._id} className="col-lg-3 col-md-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
                                    className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 position-relative"
                                    onClick={() => handleView(listing)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="position-absolute top-0 end-0 m-2 z-3">
                                        <span className="badge bg-danger shadow-sm d-flex align-items-center gap-1">
                                            <Award size={14} />
                                            Trending
                                        </span>
                                    </div>
                                    <div className="ratio ratio-4x3 bg-light position-relative overflow-hidden">
                                        {/* --- ALWAYS USE THE IMAGE HELPER --- */}
                                        <img
                                            src={imgUrl(getFirstImage(listing))}
                                            alt={listing.title}
                                            className="rounded w-100"
                                            style={{ objectFit: "cover", height: 200 }}
                                            onError={(e) => (e.target.src = "https://placehold.co/600x400?text=No+Image")}
                                        />
                                        {/* ✅ NEW: Image count overlay */}
                                        {(
                                            (Array.isArray(listing.photos) && listing.photos.length > 1) ||
                                            (Array.isArray(listing.images) && listing.images.length > 1)
                                        ) && (
                                                <div className="image-overlay">
                                                    <ImageIcon size={14} className="me-1" />
                                                    {(listing.photos?.length || listing.images?.length) + " photos"}
                                                </div>
                                            )}
                                    </div>
                                    <div className="card-body p-3">
                                        <h6 className="fw-bold mb-2 text-truncate">{listing.title}</h6>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="h5 mb-0 text-success fw-bold">
                                                {formatCurrency(listing.price)}
                                            </span>
                                            <span className="badge bg-light text-dark">
                                                <Eye size={12} className="me-1" />
                                                {listing.views || 0}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* 📋 Main Listings Grid */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-dark" >
                    {filteredListings.length} Available Listing
                    {filteredListings.length !== 1 ? "s" : ""}
                </h5>
                {searchQuery && (
                    <span className="text-muted">
                        Searching for: <strong>"{searchQuery}"</strong>
                    </span>
                )}
            </div>

            {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
                    <p className="text-muted">Loading amazing livestock...</p>
                </div>
            ) : filteredListings.length > 0 ? (
                <motion.div layout className="row g-4">
                    <AnimatePresence>
                        {filteredListings.map((listing, idx) => (
                            <motion.div
                                key={listing._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="col-xl-3 col-lg-4 col-md-6"
                            >
                                <motion.div
                                    whileHover={{ y: -10, boxShadow: "0 15px 50px rgba(0,0,0,0.15)" }}
                                    className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="position-relative">
                                        <div
                                            className="ratio ratio-4x3 bg-light overflow-hidden position-relative"
                                            onClick={() => handleView(listing)}
                                        >
                                            {/* --- ALWAYS USE THE IMAGE HELPER --- */}
                                            <img
                                                src={imgUrl(getFirstImage(listing))}
                                                alt={listing.title}
                                                className="object-fit-cover card-zoom-img"
                                                onError={(e) =>
                                                    (e.target.src = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80")
                                                }
                                            />
                                            {/* ✅ NEW: Image count overlay */}
                                            {(
                                                (Array.isArray(listing.photos) && listing.photos.length > 1) ||
                                                (Array.isArray(listing.images) && listing.images.length > 1)
                                            ) && (
                                                    <div className="image-overlay">
                                                        <ImageIcon size={14} className="me-1" />
                                                        {(listing.photos?.length || listing.images?.length) + " photos"}
                                                    </div>
                                                )}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`btn btn-sm position-absolute top-0 end-0 m-2 shadow ${favorites.includes(listing._id) ? "btn-danger" : "btn-light"
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(listing._id);
                                            }}
                                        >
                                            <Heart
                                                size={16}
                                                fill={favorites.includes(listing._id) ? "white" : "none"}
                                            />
                                        </motion.button>
                                        <div className="position-absolute bottom-0 start-0 m-2">
                                            {/* ✅ NEW: Species with emoji and color */}
                                            <span className={`badge ${speciesConfig[listing.animal_id?.species]?.color || 'bg-secondary'} text-white shadow-sm`}>
                                                {speciesConfig[listing.animal_id?.species]?.emoji || '📦'}{' '}
                                                {listing.animal_id?.species || "Livestock"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body p-3" onClick={() => handleView(listing)}>
                                        <h6 className="fw-bold mb-2 text-truncate">{listing.title}</h6>
                                        <div className="d-flex align-items-center text-muted small mb-2">
                                            <MapPin size={14} className="me-1 flex-shrink-0" />
                                            <span className="text-truncate">{listing.location || "Location N/A"}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="text-success fw-bold mb-0">
                                                {formatCurrency(listing.price)}
                                            </h5>
                                            <div className="text-muted small d-flex align-items-center">
                                                <Eye size={14} className="me-1" />
                                                {listing.views || 0}
                                            </div>
                                        </div>
                                        <div className="d-flex gap-1 flex-wrap">
                                            {listing.animal_id?.gender && (
                                                <span className="badge bg-light text-dark small">
                                                    {listing.animal_id.gender === "male" ? "♂" : "♀"}{" "}
                                                    {listing.animal_id.gender}
                                                </span>
                                            )}
                                            {listing.animal_id?.stage && (
                                                <span className="badge bg-light text-dark small">
                                                    {listing.animal_id.stage}
                                                </span>
                                            )}
                                            {listing.animal_id?.status === "pregnant" && (
                                                <span className="badge bg-warning text-dark small">🤰 Pregnant</span>
                                            )}
                                        </div>
                                        <div className="text-muted small mt-2 d-flex align-items-center">
                                            <Calendar size={12} className="me-1" />
                                            {timeAgo(listing.createdAt)}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card border-0 shadow-sm rounded-4 text-center py-5"
                >
                    <AlertCircle size={64} className="mx-auto text-muted mb-3" />
                    <h5 className="fw-bold mb-2">No Listings Found</h5>
                    <p className="text-muted mb-3">
                        Try adjusting your filters or search query
                    </p>
                    <button
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() => {
                            setSearchQuery("");
                            setFilters({
                                species: "",
                                gender: "",
                                stage: "",
                                breed: "",
                                pregnant: "",
                                minPrice: "",
                                maxPrice: "",
                                sort: "createdAt",
                            });
                        }}
                    >
                        Clear All Filters
                    </button>
                </motion.div>
            )}
        </div>
    );
}