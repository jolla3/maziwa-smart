import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Trash2, Image, X } from "lucide-react";

const EditListingPhotos = ({
  existingPhotos,
  previews,
  newFiles,
  MAX_PHOTOS,
  handleNewFiles,
  removePreview,
  deleteExistingPhoto,
  getImageUrl,
}) => {
  const fileRef = useRef();
  const totalPhotos = existingPhotos.length + newFiles.length;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">
            Photos <span className="text-danger">*</span>
          </h6>
          <div>
            <span className="badge bg-secondary me-2">
              {totalPhotos}/{MAX_PHOTOS}
            </span>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => fileRef.current?.click()}
              disabled={totalPhotos >= MAX_PHOTOS}
            >
              <Image size={16} className="me-1" /> Add Photos
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleNewFiles(e.target.files)}
          />
        </div>

        {/* Existing Photos */}
        {existingPhotos.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-2">Existing Photos</small>
            <div className="row g-2">
              {existingPhotos.map((p, i) => (
                <div key={i} className="col-6 col-md-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="position-relative"
                    style={{ height: 120 }}
                  >
                    <img
                      src={getImageUrl(p)}
                      alt={`Photo ${i + 1}`}
                      className="rounded w-100 h-100"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.backgroundColor = "#e9ecef";
                        e.target.alt = "Failed to load";
                      }}
                    />
                    <button
                      className="btn btn-sm btn-danger position-absolute"
                      style={{
                        top: 4,
                        right: 4,
                        padding: "4px 8px",
                        borderRadius: "4px"
                      }}
                      onClick={() => deleteExistingPhoto(i)}
                      title="Delete photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Previews */}
        {previews.length > 0 && (
          <div>
            <small className="text-muted d-block mb-2">New Photos to Upload</small>
            <div className="row g-2">
              {previews.map((p, i) => (
                <div key={i} className="col-6 col-md-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="position-relative"
                    style={{ height: 120 }}
                  >
                    <img
                      src={p}
                      alt={`New photo ${i + 1}`}
                      className="rounded w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                    <button
                      className="btn btn-sm btn-secondary position-absolute"
                      style={{
                        top: 4,
                        right: 4,
                        padding: "4px 8px",
                        borderRadius: "4px"
                      }}
                      onClick={() => removePreview(i)}
                      title="Remove preview"
                    >
                      <X size={14} />
                    </button>
                    <span
                      className="badge bg-info position-absolute"
                      style={{ bottom: 4, left: 4, fontSize: "0.65rem" }}
                    >
                      New
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPhotos === 0 && (
          <div className="text-center py-5 text-muted">
            <Image size={48} className="mb-2 opacity-50" />
            <p className="mb-0">No photos added yet</p>
            <small>Click "Add Photos" to upload images</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditListingPhotos;