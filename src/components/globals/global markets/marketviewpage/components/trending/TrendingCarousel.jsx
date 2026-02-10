import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { imgUrl, getFirstImage } from '../../utils/image.utils';
import { formatCurrency } from '../../utils/currency.utils';

export default function TrendingCarousel({ listings = [] }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Filter valid listings
  const validListings = listings.filter(
    (l) => l._id && l.title && l.price > 0
  );

  // Auto-slide every 5 seconds
  useEffect(() => {
    // Only start timer if there are valid listings
    if (!validListings.length) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % validListings.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [validListings.length]);

  if (!validListings.length) return null;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + validListings.length) % validListings.length
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(
      (prev) => (prev + 1) % validListings.length
    );
  };

  const currentListing = validListings[currentIndex];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Cards Container */}
      <div
        style={{
          position: 'relative',
          height: '550px',
          perspective: '1000px',
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              onClick={() =>
                navigate('/view-market', { state: { listing: currentListing } })
              }
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 12px 32px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
            >
              {/* Image Section */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
                  overflow: 'hidden',
                  background: '#f3f4f6',
                }}
              >
                <motion.img
                  src={imgUrl(getFirstImage(currentListing))}
                  alt={currentListing.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Hot Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#ef4444',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  🔥 TRENDING
                </div>
              </div>

              {/* Details Section */}
              <div
                style={{
                  flex: 1,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Title */}
                <h5
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {currentListing.title}
                </h5>

                {/* Price */}
                <div style={{ marginBottom: '12px' }}>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#10b981',
                    }}
                  >
                    {formatCurrency(currentListing.price)}
                  </h4>
                </div>

                {/* Location */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <MapPin
                    size={16}
                    style={{ color: '#10b981', flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: '0.9rem',
                      color: '#475569',
                      fontWeight: 500,
                    }}
                  >
                    {currentListing.location}
                  </span>
                </div>

                {/* Views */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Eye
                    size={16}
                    style={{ color: '#10b981', flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: '0.9rem',
                      color: '#475569',
                      fontWeight: 500,
                    }}
                  >
                    {currentListing.views?.count || 0} views
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '-60px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'white',
          border: '1px solid #e5e7eb',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: '#0f172a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#10b981';
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.boxShadow =
            '0 4px 12px rgba(16, 185, 129, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = '#0f172a';
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow =
            '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '-60px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'white',
          border: '1px solid #e5e7eb',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: '#0f172a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#10b981';
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.boxShadow =
            '0 4px 12px rgba(16, 185, 129, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = '#0f172a';
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow =
            '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '24px',
          flexWrap: 'wrap',
        }}
      >
        {validListings.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            style={{
              width: idx === currentIndex ? '32px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: idx === currentIndex ? '#10b981' : '#d1d5db',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (idx !== currentIndex) {
                e.currentTarget.style.background = '#9ca3af';
              }
            }}
            onMouseLeave={(e) => {
              if (idx !== currentIndex) {
                e.currentTarget.style.background = '#d1d5db';
              }
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
