import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";

export const ConnectionModal = ({ 
  socketConnected, 
  connectionError, 
  loading,
  theme 
}) => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    // Don't show modal during initial loading
    if (loading) {
      setShow(false);
      return;
    }

    // Determine status based on connection state
    if (connectionError) {
      setStatus('error');
      setShow(true);
    } else if (socketConnected) {
      setStatus('connected');
      setShow(true);
      // Auto-hide success message after 2 seconds
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    } else {
      // Show connecting only if we've been disconnected for > 2 seconds
      const timer = setTimeout(() => {
        setStatus('connecting');
        setShow(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [socketConnected, connectionError, loading]);

  const getConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          icon: <Wifi size={48} style={{ color: "#3b82f6" }} />,
          title: "Connecting to Chat",
          message: "Please wait while we establish a secure connection",
          bg: "#3b82f6",
          showSpinner: true,
          showRetry: false
        };
      case 'connected':
        return {
          icon: <CheckCircle size={48} style={{ color: "#10b981" }} />,
          title: "Connected!",
          message: "You can now send and receive messages in real-time",
          bg: "#10b981",
          showSpinner: false,
          showRetry: false
        };
      case 'error':
        return {
          icon: <AlertCircle size={48} style={{ color: "#ef4444" }} />,
          title: "Connection Failed",
          message: connectionError || "Unable to connect to chat server. Please check your internet connection.",
          bg: "#ef4444",
          showSpinner: false,
          showRetry: true
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config || !show) return null;

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
            onClick={() => status === 'connected' && setShow(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="position-fixed top-50 start-50"
            style={{
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <div
              className="rounded-4 shadow-lg p-4"
              style={{
                background: "white",
                border: `3px solid ${config.bg}`,
              }}
            >
              <div className="text-center">
                {/* Icon with animation */}
                <motion.div
                  animate={
                    config.showSpinner
                      ? { rotate: 360 }
                      : { scale: [1, 1.1, 1] }
                  }
                  transition={
                    config.showSpinner
                      ? { duration: 2, repeat: Infinity, ease: "linear" }
                      : { duration: 0.5 }
                  }
                  className="mb-3 d-flex justify-content-center"
                >
                  {config.icon}
                </motion.div>

                {/* Title */}
                <h5 className="fw-bold mb-2" style={{ color: config.bg }}>
                  {config.title}
                </h5>

                {/* Message */}
                <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                  {config.message}
                </p>

                {/* Loading dots */}
                {config.showSpinner && (
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: config.bg,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Retry button */}
                {config.showRetry && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="btn btn-primary mt-3 px-4"
                    style={{
                      background: config.bg,
                      border: "none",
                    }}
                  >
                    Retry Connection
                  </motion.button>
                )}

                {/* Debug info for developers */}
                {status === 'error' && process.env.NODE_ENV === 'development' && (
                  <div className="mt-3 p-2 rounded" style={{ background: "#f1f5f9", fontSize: "12px" }}>
                    <strong>Debug Info:</strong>
                    <br />
                    Error: {connectionError}
                    <br />
                    Socket URL: {process.env.REACT_APP_API_BASE}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};