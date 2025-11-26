// ============================================
// FILE: /src/superadmin/components/JSONDiffViewer.jsx
// ============================================
import React from 'react';

const JSONDiffViewer = ({ before, after }) => (
  <div className="row g-3">
    <div className="col-md-6">
      <h6 className="mb-2" style={{ color: '#64748b' }}>Before</h6>
      <pre className="p-3 rounded small" style={{ backgroundColor: '#fafafa', border: '1px solid #e2e8f0', maxHeight: '400px', overflow: 'auto', color: '#0f172a' }}>
        {JSON.stringify(before, null, 2)}
      </pre>
    </div>
    <div className="col-md-6">
      <h6 className="mb-2" style={{ color: '#64748b' }}>After</h6>
      <pre className="p-3 rounded small" style={{ backgroundColor: '#fafafa', border: '1px solid #e2e8f0', maxHeight: '400px', overflow: 'auto', color: '#0f172a' }}>
        {JSON.stringify(after, null, 2)}
      </pre>
    </div>
  </div>
);

export default JSONDiffViewer;
