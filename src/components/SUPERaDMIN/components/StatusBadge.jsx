// ============================================
// FILE: /src/superadmin/components/StatusBadge.jsx
// ============================================
import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    open: { backgroundColor: '#fef2f2', color: '#ef4444' },
    reviewing: { backgroundColor: '#fffbeb', color: '#f59e0b' },
    closed: { backgroundColor: '#ecfdf5', color: '#10b981' }
  };
  const s = styles[status] || { backgroundColor: '#f1f5f9', color: '#64748b' };

  return <span className="badge" style={{ ...s, fontWeight: 500 }}>{status}</span>;
};

export default StatusBadge;
