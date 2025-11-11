import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "lucide-react";

const ImageGallery = ({ displayImages, mainPhoto, setMainPhoto, imgUrl, DEFAULT_IMAGE }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="card border-0 shadow-sm rounded-4 overflow-hidden"
      style={{ transition: "all 0.3s ease" }}
    >
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
      `}</style>

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
  );
};

export default ImageGallery;