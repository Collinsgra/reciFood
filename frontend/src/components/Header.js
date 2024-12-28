import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../assets/logo.png';

const Header = ({ isLoggedIn, isAdmin, onLogout, toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        
      </button>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Recipe App Logo" className={styles.logo} />
        <div className={styles.appName}>Recipe App</div>
      </div>
      <button className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/about" onClick={toggleMenu}>About</Link>
        <Link to="/contact" onClick={toggleMenu}>Contact</Link>
        {isLoggedIn && <Link to="/profile" onClick={toggleMenu}>Profile</Link>}
        {isAdmin && <Link to="/admin" onClick={toggleMenu}>Admin Dashboard</Link>}
        {isLoggedIn ? (
          <button onClick={() => { onLogout(); toggleMenu(); }}>Logout</button>
        ) : (
          <Link to="/login" onClick={toggleMenu}>Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;