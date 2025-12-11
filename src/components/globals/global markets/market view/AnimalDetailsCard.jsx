import React, { useState } from "react";
import { ChevronDown, Info, Heart, Droplet } from "lucide-react";

const AnimalDetailsCard = ({ animalDetails }) => {
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    breeding: true,
    production: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!animalDetails) {
    return (
      <div className="alert alert-warning">
        <strong>No details</strong>
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
    birth_date,
  } = animalDetails;

  // Calculate age from birth_date
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const today = new Date("2025-11-25");
    let ageYears = today.getFullYear() - birth.getFullYear();
    let ageMonths = today.getMonth() - birth.getMonth();
    if (ageMonths < 0 || (ageMonths === 0 && today.getDate() < birth.getDate())) {
      ageYears--;
      ageMonths += 12;
    }
    return `${ageYears} year${ageYears !== 1 ? 's' : ''} ${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
  };

  const DetailItem = ({ label, value, colSize = "col-12 col-sm-6" }) => {
    if (value == null || value === "" || value === 0) return null;
    return (
      <div className={`${colSize} mb-3`}>
        <div className="d-flex flex-column">
          <span className="text-muted small mb-1">{label}</span>
          <span className="fw-semibold fs-6">{value}</span>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, icon: Icon, isExpanded, onToggle }) => (
    <div
      className="d-flex align-items-center justify-content-between p-3 bg-light cursor-pointer"
      style={{ 
        cursor: "pointer", 
        borderBottom: isExpanded ? "2px solid #dee2e6" : "none",
        transition: "background-color 0.2s"
      }}
      onClick={onToggle}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
    >
      <div className="d-flex align-items-center gap-2">
        {Icon && <Icon size={20} className="text-primary" />}
        <h6 className="mb-0 fw-bold">{title}</h6>
      </div>
      <div style={{ 
        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s"
      }}>
        <ChevronDown size={20} />
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusColors = {
      pregnant: "warning",
      available: "success",
      sold: "secondary",
      reserved: "info",
    };
    const color = statusColors[status?.toLowerCase()] || "success";
    return <span className={`badge bg-${color}`}>{status || "Available"}</span>;
  };

  const GenderDisplay = ({ gender }) => (
    gender === "male" ? "Male" : gender === "female" ? "Female" : "N/A"
  );

  return (
    <div className="container-fluid p-0" style={{ 
      opacity: 1,
      animation: "fadeIn 0.5s ease-in"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="card-header bg-primary text-white py-3">
          <h5 className="mb-0 fw-bold">{name || "Animal Details"}</h5>
        </div>

        <div className="card-body p-0">
          {/* Basic Information Section */}
          <div className="mb-2">
            <SectionHeader
              title="Basic Information"
              icon={Info}
              isExpanded={expandedSections.basic}
              onToggle={() => toggleSection("basic")}
            />
            {expandedSections.basic && (
              <div className="p-4 bg-white">
                <div className="row g-3">
                  <DetailItem label="Species" value={species} />
                  <DetailItem label="Gender" value={<GenderDisplay gender={gender} />} />
                  <DetailItem label="Stage" value={stage} />
                  <DetailItem label="Status" value={<StatusBadge status={status} />} />
                  <DetailItem label="Breed" value={breed} />
                  <DetailItem label="Age" value={calculateAge(birth_date)} />
                </div>
              </div>
            )}
          </div>

          {/* Breeding Information */}
          {(bull_code || bull_name || bull_breed || pregnancy?.is_pregnant || calved_count > 0) && (
            <div className="mb-2">
              <SectionHeader
                title="Breeding Information"
                icon={Heart}
                isExpanded={expandedSections.breeding}
                onToggle={() => toggleSection("breeding")}
              />
              {expandedSections.breeding && (
                <div className="p-4 bg-white">
                  <div className="row g-3">
                    <DetailItem label="Bull Code" value={bull_code} />
                    <DetailItem label="Bull Name" value={bull_name} />
                    <DetailItem label="Bull Breed" value={bull_breed} />
                    {pregnancy?.is_pregnant && pregnancy.expected_due_date && (
                      <DetailItem
                        label="Expected Due Date"
                        value={new Date(pregnancy.expected_due_date).toLocaleDateString()}
                        colSize="col-12"
                      />
                    )}
                    <DetailItem
                      label="Offspring Count"
                      value={calved_count > 0 ? `${calved_count} offspring${calved_count !== 1 ? 's' : ''}` : null}
                      colSize="col-12"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Production Statistics */}
          {(lifetime_milk > 0 || daily_average > 0) && (
            <div className="mb-0">
              <SectionHeader
                title="Milk Production Records"
                icon={Droplet}
                isExpanded={expandedSections.production}
                onToggle={() => toggleSection("production")}
              />
              {expandedSections.production && (
                <div className="p-4 bg-white">
                  <div className="row g-3">
                    <DetailItem
                      label="Daily Average"
                      value={daily_average > 0 ? `${daily_average} L/day` : null}
                      colSize="col-12 col-md-6"
                    />
                    <DetailItem
                      label="Lifetime Total"
                      value={lifetime_milk > 0 ? `${lifetime_milk.toLocaleString()} L` : null}
                      colSize="col-12 col-md-6"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailsCard;