import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Topbar = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="topbar d-flex justify-content-between align-items-center p-3 shadow-sm">
      <h3 className="m-0">MaziwaSmart Admin</h3>
      <button className="btn btn-outline-secondary" onClick={toggleDarkMode}>
        {isDarkMode ? <FaSun /> : <FaMoon />} {isDarkMode ? ' Light Mode' : ' Dark Mode'}
      </button>
    </header>
  );
};

export default Topbar;
