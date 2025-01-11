import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, User, FileText, Utensils, ShoppingBag, Grid, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar, user, onLogout }) => {
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "My Articles", path: "/my-articles" },
    { icon: Utensils, label: "My Recipes", path: "/my-recipes" },
  ];

  const handleLinkClick = () => {
    toggleSidebar();
  };

  return (
    <>
      <div className={`${styles.sidebarOverlay} ${isOpen ? styles.open : ''}`} onClick={toggleSidebar} />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button onClick={toggleSidebar} className={styles.closeButton}>
          <X size={24} />
        </button>
        
        <div className={styles.sidebarHeader}>
          <Link to="/profile" className={styles.userProfile} onClick={handleLinkClick}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className={styles.userText}>
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </div>
            </div>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.path} 
              onClick={handleLinkClick}
              className={styles.navItem}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;