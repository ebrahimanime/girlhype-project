'use client';

import React, { useState } from 'react';
import {
  FaHome, FaTv, FaStore, FaUsers, FaPlus,
  FaUserCircle, FaCommentDots, FaBell, FaSignOutAlt, FaBars
} from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: 'Home', icon: <FaHome />, path: '/home' },
    { label: 'Watch', icon: <FaTv />, path: '/watch' },
    { label: 'Marketplace', icon: <FaStore />, path: '/marketplace' },
    { label: 'Groups', icon: <FaUsers />, path: '/groups' },
    { label: 'Create', icon: <FaPlus />, path: '/create' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/profile' },
    { label: 'Messenger', icon: <FaCommentDots />, path: '/messenger' },
    { label: 'Notifications', icon: <FaBell />, path: '/notifications' },
    { label: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        {isOpen && <h2 className={styles.title}>Menu</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className={styles.toggle}>
          <FaBars />
        </button>
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item, index) => (
          <Link href={item.path} key={index} className={styles.menuItem}>
            <span className={styles.icon}>{item.icon}</span>
            {isOpen && <span className={styles.label}>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;