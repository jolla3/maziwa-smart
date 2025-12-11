
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
      className={`bg-dark text-white d-flex flex-column ${isOpen ? '' : 'd-none d-lg-flex'}`}
      style={{ 
        width: isOpen ? '250px' : '0',
        transition: 'width 0.3s ease',
        minHeight: '100vh'
      }}
    >
      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold">Seller Portal</h5>
          <button 
            className="btn btn-link text-white d-lg-none p-0"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-grow-1 overflow-auto py-3">
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
