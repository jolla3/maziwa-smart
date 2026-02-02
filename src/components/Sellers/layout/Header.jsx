import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, ShoppingBag } from 'lucide-react';
import sellerRoutes from '../routes/sellerRoutes';

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
      
      <div className="d-flex align-items-center gap-2">
        <h6 className="mb-0" style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>
          {currentRoute?.label || 'Dashboard'}
        </h6>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <button 
          className="btn btn-link p-0 position-relative" 
          style={{ color: '#64748b' }}
          onClick={() => navigate('/notifications')}
        >
          <Bell size={20} />
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
            style={{ backgroundColor: '#ef4444', fontSize: '0.65rem' }}
          >
            3
          </span>
        </button>
        
        <button 
          className="btn btn-link p-0 position-relative" 
          style={{ color: '#64748b' }}
          onClick={() => navigate('/slr.drb/my-listings')}
        >
          <ShoppingBag size={20} />
        </button>
        
        <div 
          className="d-flex align-items-center justify-content-center rounded-circle fw-bold" 
          style={{ 
            width: '40px', 
            height: '40px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/slr.drb/settings')}
        >
          S
        </div>
      </div>
    </div>
  );
};

export default Header;