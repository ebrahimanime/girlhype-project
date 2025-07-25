'use client';

import React from 'react';
import { FaFacebookF, FaSearch, FaHome, FaTv, FaStore, FaUsers, FaPlus, FaBell, FaUserCircle, FaCommentDots, FaCaretDown } from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';
import Image from '../../public/Girlhype-Logo-removebg-preview.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      
      <div className="navbar-section left">
      
        <div className="search-bar">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search Facebook" />
        </div>
      </div>

      
      <div className="navbar-section center">
        <div className="nav-item"><FaHome className="icon" /><span>Home</span></div>
        <div className="nav-item"><FaTv className="icon" /><span>Watch</span></div>
        <div className="nav-item"><FaStore className="icon" /><span>Marketplace</span></div>
        <div className="nav-item"><FaUsers className="icon" /><span>Groups</span></div>
        <div className="nav-item"><FaPlus className="icon" /><span>Create</span></div>
      </div>

     
      <div className="navbar-section right">
        <div className="nav-item"><FaUserCircle className="icon" /><span>Profile</span></div>
        <div className="nav-item"><FaCommentDots className="icon" /><span>Messenger</span></div>
        <div className="nav-item"><FaBell className="icon" /><span>Notifications</span></div>
        <div className="nav-item"><FaCaretDown className="icon" /><span>More</span></div>
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: #fff;
          border-bottom: 1px solid #ccc;
          font-family: sans-serif;
        }
        .navbar-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .navbar-section.center .nav-item,
        .navbar-section.right .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.8rem;
          color: #444;
        }
        .icon {
          font-size: 1.5rem;
        }
        .facebook-logo {
          font-size: 2rem;
          color: #1877f2;
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: #f0f2f5;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }
        .search-bar input {
          border: none;
          background: transparent;
          margin-left: 0.5rem;
          outline: none;
        }
        .nav-item span {
          font-size: 0.7rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
