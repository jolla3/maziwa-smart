
// ============================================================================
// FILE: /src/components/sellerdashboard/ui/MenuItem.jsx
// ============================================================================
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import IconContainer from './IconContainer';

const MenuItem = ({ path, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className="d-flex align-items-center text-decoration-none px-3 py-2 mb-1 rounded"
      style={{
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? '#f0fdf4' : 'transparent',
        color: isActive ? '#10b981' : '#64748b',
        fontWeight: isActive ? 600 : 400,
        borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.color = '#0f172a';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#64748b';
        }
      }}
    >
      <IconContainer icon={icon} size={20} className="me-3" />
      <span style={{ fontSize: '0.9375rem' }}>{label}</span>
    </Link>
  );
};

export default MenuItem;

