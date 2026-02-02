import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, List, ClipboardCheck, Store, Eye, 
  MessageCircle, Clock, Menu, X, Home, Bell, ShoppingBag
} from 'lucide-react';

const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/slr.drb/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/slr.drb/my-listings', icon: List, label: 'My Listings' },
    { path: '/slr.drb/seller-approval', icon: ClipboardCheck, label: 'Approval' },
    { path: '/slr.drb/market', icon: Store, label: 'Market' },
    // { path: '/slr.drb/view-market', icon: Eye, label: 'Market View' },
    // { path: '/slr.drb/chatroom', icon: MessageCircle, label: 'Chat Room' },
    { path: '/slr.drb/recents', icon: Clock, label: 'Recent Chats' }
  ]

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
      {sidebarOpen && (
        <aside className="d-flex flex-column border-end" 
          style={{ width: '260px', minWidth: '260px', backgroundColor: '#ffffff' }}>
          <div className="p-4 border-bottom">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Store size={24} style={{ color: '#10b981' }} />
                <h5 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Seller Portal</h5>
              </div>
              <button className="btn btn-link d-lg-none p-0" style={{ color: '#64748b' }}
                onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="py-3 flex-grow-1 px-2">
            {menuItems.map((item) => (
              <NavLink key={item.path} to={item.path}
                className="d-flex align-items-center gap-3 px-3 py-2 mb-1 text-decoration-none rounded"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#dcfce7' : 'transparent',
                  color: isActive ? '#10b981' : '#64748b',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s'
                })}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-top">
            <button 
              onClick={() => navigate('/')}
              className="d-flex align-items-center gap-2 btn btn-link text-decoration-none p-0"
              style={{ color: '#64748b' }}
            >
              <Home size={18} />
              <span className="small">Back to Store</span>
            </button>
          </div>
        </aside>
      )}

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <header className="border-bottom p-3 bg-white">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link p-0" style={{ color: '#64748b' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            
            <div className="ms-auto d-flex align-items-center gap-3">
              <button className="btn btn-link p-0 position-relative" style={{ color: '#64748b' }}>
                <Bell size={20} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.65rem' }}>3</span>
              </button>
              
              <button className="btn btn-link p-0" style={{ color: '#64748b' }}>
                <ShoppingBag size={20} />
              </button>
              
              <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                style={{ 
                  width: '40px', height: '40px',
                  backgroundColor: '#10b981', color: '#ffffff',
                  fontSize: '0.875rem', cursor: 'pointer'
                }}>
                S
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#fafafa' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;