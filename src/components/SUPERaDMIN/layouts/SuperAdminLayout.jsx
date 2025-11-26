
// ============================================
// FILE: /src/superadmin/layouts/SuperAdminLayout.jsx
// FIXED - No dark sidebar, use white/light colors
// ============================================
import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, FileText, History, 
  Settings, Users, Menu, X, LogOut, Activity
} from 'lucide-react';
import { AuthContext } from '../../PrivateComponents/AuthContext';

const SuperAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/spr.dmn/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/spr.dmn/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/spr.dmn/events', icon: FileText, label: 'Events' },
    { path: '/spr.dmn/audit', icon: History, label: 'Audit Logs' },
    { path: '/spr.dmn/config', icon: Settings, label: 'Configuration' },
    { path: '/spr.dmn/sessions', icon: Users, label: 'Sessions' },
        { path: '/spr.dmn/admin-approval', icon: Users, label: 'Seller Requests' }

  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      {sidebarOpen && (
        <aside className="d-flex flex-column border-end" 
          style={{ width: '250px', minWidth: '250px', backgroundColor: '#fafafa' }}>
          <div className="p-3 border-bottom">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Activity size={24} style={{ color: '#10b981' }} />
                <h5 className="mb-0" style={{ color: '#0f172a', fontWeight: 700 }}>SuperAdmin</h5>
              </div>
              <button className="btn btn-link d-lg-none p-0" style={{ color: '#0f172a' }}
                onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="py-3 flex-grow-1">
            {menuItems.map((item) => (
              <NavLink key={item.path} to={item.path}
                className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#10b981' : 'transparent',
                  color: isActive ? '#ffffff' : '#0f172a',
                  borderRadius: '0 8px 8px 0',
                  marginRight: '12px'
                })}>
                <item.icon size={20} />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-top">
            <div className="small mb-2" style={{ color: '#64748b' }}>{user?.email || 'Admin'}</div>
            <button className="btn btn-sm w-100" 
              style={{ backgroundColor: '#ffffff', border: '1px solid #10b981', color: '#10b981' }}
              onClick={handleLogout}>
              <LogOut size={16} className="me-2" />Logout
            </button>
          </div>
        </aside>
      )}

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <header className="border-bottom p-3" style={{ backgroundColor: '#ffffff' }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link p-0" style={{ color: '#0f172a' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <h6 className="mb-0" style={{ color: '#0f172a', fontWeight: 600 }}>System Monitoring</h6>
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#fafafa' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
