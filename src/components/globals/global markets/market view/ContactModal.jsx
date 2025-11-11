import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, X, User, Mail } from "lucide-react";

const ContactModal = ({ show, onClose, seller, title }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop show"
        onClick={onClose}
        style={{ zIndex: 1050 }}
      />
      
      <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="modal-dialog modal-dialog-centered"
        >
          <div className="modal-content rounded-4 shadow-lg border-0">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Contact Seller</h5>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>
            
            <div className="modal-body pt-2">
              <p className="text-muted mb-3">
                Get in touch with the seller about <strong>{title}</strong>
              </p>

              {/* Seller Information Card */}
              <div className="card border-0 bg-light mb-3">
                <div className="card-body">
                  {seller?.fullname && (
                    <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                        <User className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block">Seller Name</small>
                        <strong className="text-dark">{seller.fullname}</strong>
                      </div>
                    </div>
                  )}

                  {seller?.phone && (
                    <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2">
                        <PhoneCall className="text-success" size={20} />
                      </div>
                      <div className="flex-grow-1">
                        <small className="text-muted d-block">Phone Number</small>
                        <strong className="text-dark fs-5">{seller.phone}</strong>
                      </div>
                    </div>
                  )}

                  {seller?.email && (
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2">
                        <Mail className="text-info" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block">Email</small>
                        <strong className="text-dark">{seller.email}</strong>
                      </div>
                    </div>
                  )}

                  {!seller?.phone && !seller?.email && (
                    <div className="text-center py-3 text-muted">
                      <PhoneCall size={32} className="mb-2 opacity-50" />
                      <p className="mb-0">Contact information not available</p>
                    </div>
                  )}
                </div>
              </div>

              {seller?.phone && (
                <div className="alert alert-info border-0 mb-0">
                  <small>
                    <strong>Tip:</strong> Mention you found this listing on the marketplace when contacting the seller.
                  </small>
                </div>
              )}
            </div>
            
            <div className="modal-footer border-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-light rounded-pill px-4"
                onClick={onClose}
              >
                Close
              </motion.button>
              
              {seller?.phone && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${seller.phone}`}
                  className="btn btn-primary rounded-pill px-4"
                >
                  <PhoneCall size={18} className="me-2" />
                  Call Now
                </motion.a>
              )}

              {seller?.email && !seller?.phone && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`mailto:${seller.email}?subject=Inquiry about ${title}`}
                  className="btn btn-primary rounded-pill px-4"
                >
                  <Mail size={18} className="me-2" />
                  Send Email
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;