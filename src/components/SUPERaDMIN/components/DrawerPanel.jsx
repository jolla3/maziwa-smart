
// ============================================
// FILE: /src/superadmin/components/DrawerPanel.jsx
// ============================================
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const DrawerPanel = ({ open, onClose, title, children }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100 h-100" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1050 }} onClick={onClose} />
      <div className="position-fixed top-0 end-0 h-100 shadow-lg"
        style={{ width: '100%', maxWidth: '600px', zIndex: 1051, overflowY: 'auto', backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
        <div className="border-bottom p-3 d-flex justify-content-between align-items-center sticky-top" style={{ backgroundColor: '#ffffff' }}>
          <h5 className="mb-0" style={{ color: '#0f172a', fontWeight: 700 }}>{title}</h5>
          <button className="btn btn-link p-0" style={{ color: '#64748b' }} onClick={onClose}><X size={24} /></button>
        </div>
        <div className="p-4" style={{ backgroundColor: '#ffffff' }}>{children}</div>
      </div>
    </>
  );
};

export default DrawerPanel;
