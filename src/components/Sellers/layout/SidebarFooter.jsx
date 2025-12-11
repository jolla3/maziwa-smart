
// ============================================================================
// FILE: /src/components/sellerdashboard/layout/Sidebar.jsx
// ============================================================================
import React from 'react';
import { X } from 'lucide-react';
import { sellerRoutes } from '../routes/sellerRoutes';
import MenuItem from '../ui/MenuItem';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`d-flex flex-column ${isOpen ? '' : 'd-none d-lg-flex'}`}
      style={{ 
        width: isOpen ? '260px' : '0',
        transition: 'width 0.3s ease',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0'
      }}
    >
      <div className="p-4 border-bottom" style={{ borderColor: '#e2e8f0' }}>
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold" style={{ color: '#0f172a', fontSize: '1.25rem' }}>
            Seller Portal
          </h5>
          <button 
            className="btn btn-link d-lg-none p-0"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-grow-1 overflow-auto py-3 px-2">
        {sellerRoutes.map((route) => (
          <MenuItem 
            key={route.path}
            path={`/slr.drb/${route.path}`}
            icon={route.icon}
            label={route.label}
          />
        ))}
      </nav>

      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
