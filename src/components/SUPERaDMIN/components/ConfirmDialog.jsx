// ============================================
// FILE: /src/superadmin/components/ConfirmDialog.jsx
// ============================================
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100 h-100" 
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.3)', zIndex: 1060 }} onClick={onCancel} />
      <div className="position-fixed top-50 start-50 translate-middle rounded p-4"
        style={{ zIndex: 1061, maxWidth: '400px', width: '90%', backgroundColor: '#ffffff', borderRadius: '16px' }}>
        <div className="text-center mb-3"><AlertTriangle size={48} style={{ color: '#f59e0b' }} /></div>
        <h5 className="text-center mb-2" style={{ color: '#0f172a', fontWeight: 700 }}>{title}</h5>
        <p className="text-center mb-4" style={{ color: '#64748b' }}>{message}</p>
        <div className="d-flex gap-2">
          <button className="btn flex-fill" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }} onClick={onCancel}>Cancel</button>
          <button className="btn flex-fill" style={{ backgroundColor: '#ef4444', color: '#ffffff' }} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;

