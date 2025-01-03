import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose, isLoggedIn, isAdmin, onLogout }) => {
  const renderAdminMenu = () => (
    <nav className={styles.nav}>
      <Link to="/" onClick={onClose}>Home</Link>
      <Link to="/blogs" onClick={onClose}>Blogs</Link>
      <Link to="/admin" onClick={onClose}>Dashboard</Link>
      <Link to="/admin/users" onClick={onClose}>User Management</Link>
      <Link to="/admin/recipes" onClick={onClose}>Recipe Management</Link>
      <Link to="/admin/content" onClick={onClose}>Content Management</Link>
      <Link to="/admin/analytics" onClick={onClose}>Analytics</Link>
      <Link to="/admin/comments" onClick={onClose}>Comments</Link>
      <Link to="/admin/notifications" onClick={onClose}>Notifications</Link>
      <Link to="/admin/settings" onClick={onClose}>App Settings</Link>
      <Link to="/admin/profile" onClick={onClose}>Admin Profile</Link>
      <button onClick={() => { onLogout(); onClose(); }} className={styles.logoutButton}>
        <LogOut size={20} />
        Logout
      </button>
    </nav>
  );

  const renderUserMenu = () => (
    <nav className={styles.nav}>
      <Link to="/" onClick={onClose}>Home</Link>
      <Link to="/blogs" onClick={onClose}>Blogs</Link>
      <Link to="/about" onClick={onClose}>About</Link>
      <Link to="/contact" onClick={onClose}>Contact</Link>
      <Link to="/my-recipes" onClick={onClose}>My Recipes</Link>
      <Link to="/my-articles" onClick={onClose}>My Articles</Link>
      <Link to="/profile" onClick={onClose}>Account</Link>
      <button onClick={() => { onLogout(); onClose(); }} className={styles.logoutButton}>
        <LogOut size={20} />
        Logout
      </button>
    </nav>
  );

  const renderGuestMenu = () => (
    <nav className={styles.nav}>
      <Link to="/" onClick={onClose}>Home</Link>
      <Link to="/blogs" onClick={onClose}>Blogs</Link>
      <Link to="/about" onClick={onClose}>About</Link>
      <Link to="/contact" onClick={onClose}>Contact</Link>
      <Link to="/login" onClick={onClose}>Login</Link>
    </nav>
  );

  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
      {isAdmin ? renderAdminMenu() : isLoggedIn ? renderUserMenu() : renderGuestMenu()}
    </div>
  );
};

export default MobileMenu;