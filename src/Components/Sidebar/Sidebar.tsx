import React from "react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="https://mind-empowered.org/logo192.png" alt="Logo" />
      </div>

      <div className={styles.menuItems}>
        <a href="/dashboard" className={styles.menuItem}>
          <div className={styles.dashboardIcon}></div>
          <div>Dashboard</div>
        </a>

        <a href="/members" className={styles.menuItem}>
          <div className={styles.membersIcon}></div>
          <div>Members</div>
        </a>

        <a href="/events" className={styles.menuItem}>
          <div className={styles.eventsIcon}></div>
          <div>Events</div>
        </a>

        <a href="/profile" className={styles.menuItem}>
          <div className={styles.profileIcon}></div>
          <div>Profile</div>
        </a>

        <a href="/feedback" className={styles.menuItem}>
          <div className={styles.feedbackIcon}></div>
          <div>Feedback</div>
        </a>
      </div>

      <button onClick={onLogout} className={styles.logoutItem}>
        <div className={styles.logoutIcon}></div>
        <div>Logout</div>
      </button>
    </div>
  );
};

export default Sidebar;
