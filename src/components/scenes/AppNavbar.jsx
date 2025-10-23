import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
       <div className="homepage">
   
         {/* Navbar */}
         <nav className="navbar navbar-expand-lg custom-navbar sticky-top shadow-sm">
           <div className="container">
             <Link className="navbar-brand fw-bold" to="/">
               <i className="bi bi-droplet-half me-2"></i> MaziwaSmart
             </Link>
             <button
               className="navbar-toggler"
               type="button"
               data-bs-toggle="collapse"
               data-bs-target="#navContent"
             >
               <span className="navbar-toggler-icon"></span>
             </button>
   
             <div className="collapse navbar-collapse justify-content-end" id="navContent">
               <ul className="navbar-nav">
                 <li className="nav-item">
                   <a className="nav-link" href="#about">About</a>
                 </li>
                 <li className="nav-item">
                   <a className="nav-link" href="#features">Features</a>
                 </li>
                 <li className="nav-item">
                   <Link className="nav-link" to="/login">Login</Link>
                 </li>
               </ul>
             </div>
           </div>
         </nav>
         </div>
  );
};

export default Navbar;
