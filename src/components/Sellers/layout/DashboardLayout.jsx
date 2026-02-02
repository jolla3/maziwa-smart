import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        
        <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: '#fafafa' }}>
          <div className="container-fluid p-4">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;