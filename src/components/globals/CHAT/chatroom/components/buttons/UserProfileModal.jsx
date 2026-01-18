import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Circle } from "lucide-react";
import { formatLastSeen } from "../../utils/time";
import { formatPhoneDisplay } from "../../utils/phone";

export const UserProfileModal = ({ show, onClose, counterpart, receiver, isOnline, lastSeen, theme }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(6px)",
              zIndex: 1040,
            }}
            onClick={onClose}
          />

          {/* Center wrapper */}
          <motion.div
            className="position-fixed w-100 d-flex justify-content-center"
            style={{
              top: "5%",
              zIndex: 1050,
              pointerEvents: "none",
            }}
          >
            {/* Popup box */}
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="shadow-lg rounded-4 overflow-hidden"
              style={{
                pointerEvents: "auto",
                width: "90%",
                maxWidth: "420px",
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: theme.bubbleMine,
                  padding: "24px",
                  position: "relative",
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn border-0 rounded-circle p-2 position-absolute"
                  style={{
                    top: 16,
                    right: 16,
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={onClose}
                >
                  <X size={20} color="white" />
                </motion.button>

                <div className="text-center pt-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                    style={{
                      width: 100,
                      height: 100,
                      background: "white",
                      color: theme.accent,
                      fontSize: 40,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    {(counterpart?.displayName?.[0] ||
                      counterpart?.name?.[0] ||
                      receiver?.name?.[0] ||
                      "?"
                    ).toUpperCase()}
                  </div>
                  <h4 className="fw-bold mb-2 text-white">
                    {counterpart?.displayName ||
                      counterpart?.name ||
                      receiver?.name ||
                      "User"}
                  </h4>
                  <div
                    className="d-inline-block px-3 py-1 rounded-pill"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <small className="text-white fw-medium">
                      {isOnline ? (
                        <>
                          <Circle
                            size={8}
                            fill="#10b981"
                            color="#10b981"
                            className="me-1"
                          />
                          Active now
                        </>
                      ) : (
                        formatLastSeen(lastSeen)
                      )}
                    </small>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div
                style={{
                  background: "#1e293b",
                  padding: "24px",
                }}
              >
                <h6 className="text-white-50 text-uppercase small fw-bold mb-3 d-flex align-items-center gap-2">
                  <User size={16} />
                  Contact Information
                </h6>

                <div className="d-flex flex-column gap-3">
                  {/* Email */}
                  {counterpart?.email && String(counterpart.email).trim() !== "" && (
                    <InfoCard
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      }
                      iconBg="rgba(99,102,241,0.2)"
                      label="Email Address"
                      value={counterpart.email}
                      delay={0}
                    />
                  )}

                  {/* Phone */}
                  {counterpart?.phone && String(counterpart.phone).trim() !== "" && (
                    <InfoCard
                      icon={<Phone size={18} color="#10b981" />}
                      iconBg="rgba(16,185,129,0.2)"
                      label="Phone Number"
                      value={formatPhoneDisplay(counterpart.phone)}
                      delay={0.1}
                    />
                  )}

                  {/* Location */}
                  {(counterpart?.location || counterpart?.Location || counterpart?.location_description) && (
                    <InfoCard
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      }
                      iconBg="rgba(245,158,11,0.2)"
                      label="Location"
                      value={String(counterpart?.location || counterpart?.Location || counterpart?.location_description || "Unknown")}
                      delay={0.2}
                    />
                  )}

                  {/* Fallback */}
                  {!counterpart?.email && !counterpart?.phone && !counterpart?.location && (
                    <div className="text-center py-4">
                      <p className="text-white-50 mb-0">No additional information available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const InfoCard = ({ icon, iconBg, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="p-3 rounded-3"
    style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <div className="d-flex align-items-start gap-3">
      <div
        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: iconBg,
        }}
      >
        {icon}
      </div>
      <div className="flex-grow-1">
        <small className="text-white-50 d-block mb-1">{label}</small>
        <p className="mb-0 text-white fw-medium" style={{ wordBreak: "break-all" }}>
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);