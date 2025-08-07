import React, { useState } from 'react';
import { FaTachometerAlt, FaUsers, FaTruck, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Sidebar = ({ darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        darkMode ? "sidebar-dark" : ""
      }`}
    >
      <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
        <h5 className="m-0">{collapsed ? "MS" : "MaziwaSmart"}</h5>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
      </div>
      <ul className="nav flex-column p-2">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <FaTachometerAlt className="me-2" />
            {!collapsed && "Dashboard"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admindashboard/view-farmers" className="nav-link">
            <FaUsers className="me-2" />
            {!collapsed && "Farmers"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admindashboard/view-porters" className="nav-link">
            <FaTruck className="me-2" />
            {!collapsed && "Porters"}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
