import React from "react";
import { motion } from "framer-motion";
import { Info, TrendingUp, Award, Milk } from "lucide-react";

const AnimalDetailsCard = ({ animal }) => {
  if (!animal) {
    return (
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-body p-4 text-center text-muted">
          <Info size={32} className="mb-2 opacity-50" />
          <p className="mb-0">No animal details available</p>
        </div>
      </div>
    );
  }

  const {
    name,
    species,
    gender,
    stage,
    status,
    breed,
    bull_code,
    bull_name,
    bull_breed,
    calved_count,
    lifetime_milk,
    daily_average,
    pregnancy,
  } = animal;

  const expectedDueDate = pregnancy?.expected_due_date;

  const DetailItem = ({ label, value, colSize = "col-6" }) => {
    if (!value && value !== 0) return null;
    
    return (
      <div className={colSize}>
        <div className="p-3 bg-light rounded-3">
          <small className="text-muted d-block mb-1 fw-semibold">{label}</small>
          <strong className="text-dark">{value}</strong>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      pregnant: "warning",
      available: "success",
      sold: "secondary",
      reserved: "info",
    };

    const color = statusColors[status?.toLowerCase()] || "success";
    
    return (
      <span className={`badge bg-${color}`}>
        {status || "Available"}
      </span>
    );
  };

  const GenderDisplay = ({ gender }) => {
    if (gender === "male") return "Male";
    if (gender === "female") return "Female";
    return "N/A";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card border-0 shadow-sm rounded-4 mb-3"
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="card-body p-4">
        {/* Basic Information Section */}
        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Info size={20} className="text-primary" />
          Basic Information
        </h6>
        
        <div className="row g-3 mb-4">
          <DetailItem label="Name" value={name} />
          <DetailItem label="Species" value={species ? species.charAt(0).toUpperCase() + species.slice(1) : "Unknown"} />
          <DetailItem label="Gender" value={<GenderDisplay gender={gender} />} />
          <DetailItem label="Stage" value={stage ? stage.charAt(0).toUpperCase() + stage.slice(1) : "N/A"} />
          <DetailItem 
            label="Status" 
            value={<StatusBadge status={status} />} 
          />
          <DetailItem label="Breed" value={breed || "Unknown"} />
        </div>

        {/* Breeding Information */}
        {(bull_code || bull_name || bull_breed || (status === "pregnant" && expectedDueDate) || calved_count > 0) && (
          <>
            <h6 className="fw-bold mb-3 mt-4 d-flex align-items-center gap-2">
              <Info size={20} className="text-success" />
              Breeding Information
            </h6>
            
            <div className="row g-3 mb-4">
              {bull_code && <DetailItem label="Bull Code" value={bull_code} />}
              {bull_name && <DetailItem label="Bull Name" value={bull_name} />}
              {bull_breed && <DetailItem label="Bull Breed" value={bull_breed} />}
              
              {status === "pregnant" && expectedDueDate && (
                <DetailItem 
                  label="Expected Due Date" 
                  value={new Date(expectedDueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} 
                  colSize="col-12"
                />
              )}
              
              {calved_count > 0 && (
                <DetailItem 
                  label="Total Offspring" 
                  value={`${calved_count} calf${calved_count !== 1 ? 'ves' : ''}`} 
                />
              )}
            </div>
          </>
        )}

        {/* Production Statistics */}
        {(lifetime_milk || daily_average) && (
          <>
            <h6 className="fw-bold mb-3 mt-4 d-flex align-items-center gap-2">
              <TrendingUp size={20} className="text-success" />
              Production Statistics
            </h6>
            
            <div className="row g-3">
              {daily_average && (
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between p-3 bg-success bg-opacity-10 rounded-3">
                    <div className="d-flex align-items-center gap-2">
                      <Milk size={20} className="text-success" />
                      <span className="fw-semibold">Daily Milk Production</span>
                    </div>
                    <strong className="text-success fs-5">{daily_average} L/day</strong>
                  </div>
                </div>
              )}
              
              {lifetime_milk && (
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between p-3 bg-primary bg-opacity-10 rounded-3">
                    <div className="d-flex align-items-center gap-2">
                      <Award size={20} className="text-primary" />
                      <span className="fw-semibold">Lifetime Milk Production</span>
                    </div>
                    <strong className="text-primary fs-5">
                      {lifetime_milk.toLocaleString()} L
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Additional Health Information */}
        {animal.health_status && (
          <div className="mt-4 p-3 bg-info bg-opacity-10 rounded-3">
            <div className="d-flex align-items-start gap-2">
              <Info size={18} className="text-info mt-1" />
              <div>
                <small className="text-muted d-block mb-1 fw-semibold">Health Status</small>
                <span className="text-dark">{animal.health_status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnimalDetailsCard;
