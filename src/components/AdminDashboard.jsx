import React, { useState } from 'react';
import Sidebar from './AdminDashboard/Sidebar';
import Topbar from './AdminDashboard/Topbar';
import Home from './AdminDashboard/Home';
import { Outlet } from 'react-router-dom';
// import './AdminDashboard/dashboard.css'; // Import the custom styles

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Topbar */}
      <Topbar isDarkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Body */}
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar darkMode={darkMode} />

        {/* Main Content */}
        <main className="main-content p-4">
          {/* <Home darkMode={darkMode} /> */}
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
