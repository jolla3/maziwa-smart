import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Store } from 'lucide-react';
import sellerRoutes from '../routes/sellerRoutes';
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
          <div className="d-flex align-items-center gap-2">
            <Store size={24} style={{ color: '#10b981' }} />
            <h5 className="mb-0 fw-bold" style={{ color: '#0f172a', fontSize: '1.25rem' }}>
              Seller Portal
            </h5>
          </div>
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
        {sellerRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className="d-flex align-items-center text-decoration-none px-3 py-2 mb-1"
              style={({ isActive }) => ({
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? '#dcfce7' : 'transparent',
                color: isActive ? '#10b981' : '#64748b',
                fontWeight: isActive ? 600 : 500,
                borderRadius: '8px',
                borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent'
              })}
            >
              <Icon size={20} className="me-3" />
              <span style={{ fontSize: '0.9375rem' }}>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <SidebarFooter />
    </div>
  );
};

export default Sidebar;