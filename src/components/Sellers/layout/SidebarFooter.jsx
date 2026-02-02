import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const SidebarFooter = () => {
  return (
    <div className="p-4 border-top" style={{ borderColor: '#e2e8f0' }}>
      <Link 
        to="/"
        className="d-flex align-items-center text-decoration-none"
        style={{ color: '#64748b', fontSize: '0.875rem' }}
      >
        <Home size={18} className="me-2" />
        <span>Back to Store</span>
      </Link>
    </div>
  );
};

export default SidebarFooter;