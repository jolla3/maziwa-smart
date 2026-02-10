import React, { useState } from "react";
import { ChevronDown, Info, Heart, Droplet } from "lucide-react";

const AnimalDetailsEditable = ({ animalDetails, onChange, animalType, stageOptions }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    breeding: true,
    production: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!animalDetails) return null;  

  const handleInputChange = (field, value) => {
    onChange({ ...animalDetails, [field]: value });
  };

  const SectionHeader = ({ title, icon: Icon, isExpanded, onToggle }) => (
    <div
      className="d-flex align-items-center justify-content-between p-3 bg-light cursor-pointer"
      style={{ cursor: "pointer", borderBottom: isExpanded ? "2px solid #dee2e6" : "none", transition: "background-color 0.2s" }}
      onClick={onToggle}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
    >
      <div className="d-flex align-items-center gap-2">
        {Icon && <Icon size={20} className="text-primary" />}
        <h6 className="mb-0 fw-bold">{title}</h6>
      </div>
      <div style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
        <ChevronDown size={20} />
      </div>
    </div>
  );

  return (
    <div className="card shadow-sm border-0 overflow-hidden mt-4">
      <div className="card-header bg-warning text-white py-3">
        <h5 className="mb-0 fw-bold">Edit Details (Overrides will be public; blank to hide)</h5>
      </div>
      <div className="card-body p-0">
        {/* Basic Information */}
        <div className="mb-2">
          <SectionHeader title="Basic Information" icon={Info} isExpanded={expandedSections.basic} onToggle={() => toggleSection("basic")} />
          {expandedSections.basic && (
            <div className="p-4 bg-white">
              <div className="row g-3">
                <div className="col-12 col-sm-6 mb-3">
                  <label className="text-muted small mb-1">Species</label>
                  <input type="text" className="form-control" value={animalType || ""} disabled />
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <label className="text-muted small mb-1">Gender</label>
                  <select className="form-select" value={animalDetails.gender || ""} onChange={(e) => handleInputChange("gender", e.target.value)}>
                    <option value="">Hide</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <label className="text-muted small mb-1">Stage</label>
                  <select className="form-select" value={animalDetails.stage || ""} onChange={(e) => handleInputChange("stage", e.target.value)}>
                    <option value="">Hide</option>
                    {stageOptions.map(stage => (
                      <option key={stage} value={stage}>
                        {stage.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <label className="text-muted small mb-1">Status</label>
                  <select className="form-select" value={animalDetails.status || "active"} onChange={(e) => handleInputChange("status", e.target.value)}>
                    <option value="">Hide</option>
                    <option value="active">Active</option>
                    <option value="pregnant">Pregnant</option>
                    <option value="deceased">Deceased</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <label className="text-muted small mb-1">Breed</label>
                  <input type="text" className="form-control" value={animalDetails.breed_name || ""} onChange={(e) => handleInputChange("breed_name", e.target.value)} placeholder="Blank to hide" />
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <label className="text-muted small mb-1">Age</label>
                  <input type="text" className="form-control" value={animalDetails.age || ""} onChange={(e) => handleInputChange("age", e.target.value)} placeholder="Blank to hide" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Breeding */}
        <div className="mb-2">
          <SectionHeader title="Breeding Information" icon={Heart} isExpanded={expandedSections.breeding} onToggle={() => toggleSection("breeding")} />
          {expandedSections.breeding && (
            <div className="p-4 bg-white">
              <div className="row g-3">
                <div className="col-12 col-sm-4 mb-3">
                  <label className="text-muted small mb-1">Bull Code</label>
                  <input type="text" className="form-control" value={animalDetails.bull_code || ""} onChange={(e) => handleInputChange("bull_code", e.target.value)} placeholder="Blank to hide" />
                </div>
                <div className="col-12 col-sm-4 mb-3">
                  <label className="text-muted small mb-1">Bull Name</label>
                  <input type="text" className="form-control" value={animalDetails.bull_name || ""} onChange={(e) => handleInputChange("bull_name", e.target.value)} placeholder="Blank to hide" />
                </div>
                <div className="col-12 col-sm-4 mb-3">
                  <label className="text-muted small mb-1">Bull Breed</label>
                  <input type="text" className="form-control" value={animalDetails.bull_breed || ""} onChange={(e) => handleInputChange("bull_breed", e.target.value)} placeholder="Blank to hide" />
                </div>
                <div className="col-12 mb-3 form-check">
                  <input type="checkbox" className="form-check-input" checked={animalDetails.is_pregnant || false} onChange={(e) => handleInputChange("is_pregnant", e.target.checked)} />
                  <label className="form-check-label">Is Pregnant? (Uncheck to hide pregnancy info)</label>
                </div>
                {animalDetails.is_pregnant && (
                  <div className="col-12 col-sm-6 mb-3">
                    <label className="text-muted small mb-1">Expected Due Date</label>
                    <input type="date" className="form-control" value={animalDetails.expected_due_date || ""} onChange={(e) => handleInputChange("expected_due_date", e.target.value)} placeholder="Blank to hide" />
                  </div>
                )}
                <div className="col-12 col-sm-6 mb-3">
                  <label className="text-muted small mb-1">Offspring Count</label>
                  <input type="number" className="form-control" value={animalDetails.total_offspring || ""} onChange={(e) => handleInputChange("total_offspring", e.target.value ? parseInt(e.target.value) : "")} placeholder="Blank to hide" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Production */}
        <div className="mb-0">
          <SectionHeader title="Milk Production Records" icon={Droplet} isExpanded={expandedSections.production} onToggle={() => toggleSection("production")} />
          {expandedSections.production && (
            <div className="p-4 bg-white">
              <div className="row g-3">
                <div className="col-12 col-md-6 mb-3">
                  <label className="text-muted small mb-1">Daily Average (L)</label>
                  <input type="number" className="form-control" value={animalDetails.daily_average || ""} onChange={(e) => handleInputChange("daily_average", e.target.value ? parseFloat(e.target.value) : "")} placeholder="Blank to hide" />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="text-muted small mb-1">Lifetime Total (L)</label>
                  <input type="number" className="form-control" value={animalDetails.lifetime_milk || ""} onChange={(e) => handleInputChange("lifetime_milk", e.target.value ? parseFloat(e.target.value) : "")} placeholder="Blank to hide" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailsEditable;