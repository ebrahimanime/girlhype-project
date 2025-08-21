'use client';

import React, { useState } from 'react';
import {
  FaHome,
  FaTv,
  FaStore,
  FaUsers,
  FaPlus,
  FaUserCircle,
  FaCommentDots,
  FaBell,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: 'Home', icon: <FaHome />, path: '/dashboard/home' },
    { label: 'Watch', icon: <FaTv />, path: '/dashboard/watch' },
    { label: 'Marketplace', icon: <FaStore />, path: '/dashboard/marketplace' },
    { label: 'Groups', icon: <FaUsers />, path: '/dashboard/groups' },
    { label: 'Create', icon: <FaPlus />, path: '/dashboard/create' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/dashboard/profile' },
    { label: 'Messenger', icon: <FaCommentDots />, path: '/dashboard/messenger' },
    { label: 'Notifications', icon: <FaBell />, path: '/dashboard/notifications' },
    { label: 'Logout', icon: <FaSignOutAlt />, path: '/dashboard/logout' },
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
