'use client';

import React from 'react';
import {
  FaSearch,
  FaHome,
  FaTv,
  FaStore,
  FaUsers,
  FaPlus,
  FaBell,
  FaUserCircle,
  FaCommentDots,
  FaCaretDown
} from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
     
      <div className={`${styles.navbarSection} ${styles.left}`}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.icon} />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className={`${styles.navbarSection} ${styles.center}`}>
        <div className={`${styles.navItem} ${styles.home}`}>
          <FaHome className={styles.icon} />
          <span>Home</span>
        </div>
        <div className={`${styles.navItem} ${styles.watch}`}>
          <FaTv className={styles.icon} />
          <span>Watch</span>
        </div>
        <div className={`${styles.navItem} ${styles.marketplace}`}>
          <FaStore className={styles.icon} />
          <span>Marketplace</span>
        </div>
        <div className={`${styles.navItem} ${styles.groups}`}>
          <FaUsers className={styles.icon} />
          <span>Groups</span>
        </div>
        <div className={`${styles.navItem} ${styles.create}`}>
          <FaPlus className={styles.icon} />
          <span>Create</span>
        </div>
      </div>

      
      <div className={`${styles.navbarSection} ${styles.right}`}>
        <div className={`${styles.navItem} ${styles.profile}`}>
          <FaUserCircle className={styles.icon} />
          <span>Profile</span>
        </div>
        <div className={`${styles.navItem} ${styles.messenger}`}>
          <FaCommentDots className={styles.icon} />
          <span>Messenger</span>
        </div>
        <div className={`${styles.navItem} ${styles.notifications}`}>
          <FaBell className={styles.icon} />
          <span>Notifications</span>
        </div>
        <div className={`${styles.navItem} ${styles.more}`}>
          <FaCaretDown className={styles.icon} />
          <span>More</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

