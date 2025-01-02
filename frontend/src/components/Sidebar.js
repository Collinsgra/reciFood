import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, User, Utensils, ShoppingBag, Grid, FileText, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar, user, onLogout }) => {
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Utensils, label: "My Recipes", path: "/my-recipes" },
    { icon: FileText, label: "My Articles", path: "/my-articles" },
    { icon: ShoppingBag, label: "Shopping List", path: "/shopping-list" },
    { icon: Grid, label: "Categories", path: "/categories" },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      <button 
        className={styles.menuButton} 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
      
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <button onClick={toggleSidebar} className={styles.closeButton}>
            <X size={24} />
          </button>
          <Link to="/profile" className={styles.userProfile} onClick={handleLinkClick}>
            <div className={styles.userInfo}>
              <img src={user.avatar || "/placeholder.svg"} alt="" className={styles.avatar} />
              <div className={styles.userText}>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
            <User className={styles.profileIcon} size={20} />
          </Link>
        </div>
        
        <nav className={styles.sidebarContent}>
          <ul className={styles.desktopMenu}>
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link to={item.path} onClick={handleLinkClick}>
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.mobileMenu}>
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link to={item.path} onClick={handleLinkClick}>
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={onLogout} className={styles.logoutButton}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

