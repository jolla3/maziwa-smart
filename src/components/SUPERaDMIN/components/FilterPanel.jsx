// ============================================
// FILE: /src/superadmin/components/FilterPanel.jsx
// ============================================
import React from 'react';
import { Filter, X } from 'lucide-react';

const FilterPanel = ({ filters, onChange, onClear }) => (
  <div className="card mb-3" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ color: '#0f172a', fontWeight: 600 }}>
          <Filter size={18} className="me-2" style={{ color: '#10b981' }} />Filters
        </h6>
        <button className="btn btn-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b' }} onClick={onClear}>
          <X size={16} className="me-1" />Clear
        </button>
      </div>
      <div className="row g-3">
        {filters.map((f, i) => (
          <div key={i} className="col-md-4">
            <label className="form-label small" style={{ color: '#64748b' }}>{f.label}</label>
            {f.type === 'select' ? (
              <select className="form-select" value={f.value || ''} onChange={(e) => onChange(f.key, e.target.value)}
                style={{ borderColor: '#e2e8f0', color: '#0f172a' }}>
                <option value="">All</option>
                {f.options?.map((o, j) => <option key={j} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input type={f.type || 'text'} className="form-control" value={f.value || ''} 
                onChange={(e) => onChange(f.key, e.target.value)} placeholder={f.placeholder}
                style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FilterPanel;
