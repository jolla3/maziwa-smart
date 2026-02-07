// ============================================
// FILE: /src/superadmin/components/PageHeader.jsx
// ============================================
import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => (
  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
    <div>
      <h2 className="mb-1" style={{ color: '#0f172a', fontWeight: 800 }}>{title}</h2>
      {subtitle && <p className="mb-0" style={{ color: '#64748b' }}>{subtitle}</p>}
    </div>
    {actions && <div className="d-flex gap-2">{actions}</div>}
  </div>
);

export default PageHeader;