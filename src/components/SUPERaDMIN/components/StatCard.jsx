// ============================================
// FILE: /src/superadmin/components/StatCard.jsx
// ============================================
import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = 'primary', subtitle }) => {
  const colors = {
    primary: '#10b981',
    secondary: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  const c = colors[color] || colors.primary;

  return (
    <div className="card h-100" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="rounded p-2 me-3" style={{ backgroundColor: `${c}15` }}>
            {Icon && <Icon size={24} style={{ color: c }} />}
          </div>
          <div>
            <div className="small" style={{ color: '#64748b' }}>{label}</div>
            <h3 className="mb-0" style={{ color: '#0f172a', fontWeight: 700 }}>{value}</h3>
            {subtitle && <div className="small mt-1" style={{ color: '#64748b' }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
