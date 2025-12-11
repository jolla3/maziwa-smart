
// ============================================================================
// FILE: /src/components/sellerdashboard/layout/Header.jsx
// ============================================================================
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { sellerRoutes } from '../routes/sellerRoutes';

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  
  const getCurrentRoute = () => {
    const path = location.pathname.split('/').pop();
    return sellerRoutes.find(route => route.path === path);
  };

  const currentRoute = getCurrentRoute();

  return (
    <div className="bg-white border-bottom px-4 py-3 d-flex align-items-center" style={{ borderColor: '#e2e8f0' }}>
      <button 
        className="btn btn-link p-0 me-3"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        style={{ color: '#64748b' }}
      >
        <Menu size={24} />
      </button>
      
      <nav aria-label="breadcrumb" className="mb-0">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/slr.drb/dashboard" className="text-decoration-none" style={{ color: '#64748b' }}>
              Seller
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page" style={{ color: '#0f172a', fontWeight: 600 }}>
            {currentRoute?.label || 'Dashboard'}
          </li>
        </ol>
      </nav>

      <div className="ms-auto d-flex align-items-center gap-3">
        <button className="btn btn-link p-0" style={{ color: '#64748b' }}>
          <Bell size={20} />
        </button>
        <div 
          className="d-flex align-items-center justify-content-center rounded-circle fw-bold" 
          style={{ 
            width: '40px', 
            height: '40px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: '0.875rem'
          }}
        >
          S
        </div>
      </div>
    </div>
  );
};

export default Header;
