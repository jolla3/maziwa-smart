import React from 'react';

const Home = ({ darkMode }) => {
  return (
    <div className={`card ${darkMode ? 'bg-dark text-white' : ''}`}>
      <div className="card-body">
        <h2 className="card-title mb-3">Welcome to MaziwaSmart Admin Panel</h2>
        <p className="card-text">
          Use the sidebar to manage farmers, porters, and more. Switch between dark and light themes anytime.
        </p>
      </div>
    </div>
  )
}

export default Home;
