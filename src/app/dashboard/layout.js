'use client'
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Layout.module.css';


export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
