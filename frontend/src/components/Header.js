import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import styles from './Header.module.css';
import MobileMenu from './MobileMenu';

const Header = ({ isLoggedIn, isAdmin, onLogout, user, toggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          {isMobile ? (
            <button 
              className={styles.menuButton} 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          ) : (
            (isAdmin || isLoggedIn) && (
              <button 
                className={styles.menuButton} 
                onClick={toggleSidebar}
                aria-label="Toggle sidebar menu"
              >
                <Menu size={24} />
              </button>
            )
          )}
          <Link to="/" className={styles.logoContainer}>
            <span className={styles.appName}>Recipe App</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className={styles.desktopNav}>
            <Link to="/">Home</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            {isLoggedIn && !isAdmin && <Link to="/my-recipes">My Recipes</Link>}
            {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
          </nav>
        )}

        <div className={styles.rightSection}>
          {isLoggedIn ? (
            <>
              <Link 
                to={isAdmin ? "/admin/profile" : "/profile"} 
                className={styles.profileLink}
                title={user?.name || 'Profile'}
              >
                <div className={styles.avatar}>
                  <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                </div>
              </Link>
              {!isMobile && (
                <button onClick={onLogout} className={styles.logoutButton}>
                  Logout
                </button>
              )}
            </>
          ) : (
            !isMobile && (
              <Link to="/login" className={styles.loginButton}>
                Login
              </Link>
            )
          )}
        </div>
      </header>
      {isMobile && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={toggleMobileMenu}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onLogout={onLogout}
        />
      )}
    </>
  );
};

export default Header;