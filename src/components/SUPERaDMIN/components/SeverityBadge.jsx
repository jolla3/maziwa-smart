// ============================================
// FILE: /src/superadmin/components/SeverityBadge.jsx
// ============================================
import React from 'react';

const SeverityBadge = ({ level }) => {
  const styles = {
    low: { backgroundColor: '#eff6ff', color: '#3b82f6' },
    medium: { backgroundColor: '#fffbeb', color: '#f59e0b' },
    high: { backgroundColor: '#fef2f2', color: '#ef4444' },
    critical: { backgroundColor: '#fef2f2', color: '#dc2626' }
  };
  const s = styles[level] || { backgroundColor: '#f1f5f9', color: '#64748b' };

  return <span className="badge" style={{ ...s, fontWeight: 500 }}>{level}</span>;
};

export default SeverityBadge;
