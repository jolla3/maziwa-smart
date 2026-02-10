import React from "react";
import AnimalDetailsEditable from "./AnimalDetailsEditable";

const EditListingForm = ({ form, handleChange, animalDetails, handleAnimalDetailsChange, stageOptions, user }) => {
  const currency = (n) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(n || 0);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Title <span className="text-danger">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="form-control"
            placeholder="Enter listing title"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Price <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="form-control"
              placeholder="0"
              min="0"
            />
            <small className="text-muted">{currency(form.price)}</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Animal Type <span className="text-danger">*</span>
            </label>
            <input
              value={form.animal_type}
              onChange={(e) => handleChange("animal_type", e.target.value)}
              className="form-control"
              placeholder="e.g., Cow, Goat, Chicken"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Location <span className="text-danger">*</span>
          </label>
          <input
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="form-control"
            placeholder="City, County"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="form-control"
            placeholder="Describe your listing..."
          />
        </div>

        {/* ✅ Animal Details Editing */}
        <AnimalDetailsEditable
          animalDetails={animalDetails}
          onChange={handleAnimalDetailsChange}
          animalType={form.animal_type}
          stageOptions={stageOptions[form.animal_type] || []}
        />
      </div>
    </div>
  );
};

export default EditListingForm;