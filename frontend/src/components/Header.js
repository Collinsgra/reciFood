import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import styles from './Header.module.css';
import MobileMenu from './MobileMenu';
import logo from '../assets/logo.png';

const Header = ({ isLoggedIn, isAdmin, onLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src={logo} alt="Recipe App Logo" className={styles.logo} />
            <span className={styles.appName}>Recipe App</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link to="/">Home</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {isLoggedIn && !isAdmin && <Link to="/my-recipes">My Recipes</Link>}
          {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
          {isLoggedIn ? (
            <button onClick={onLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>

        {/* Mobile Header Icons */}
        <div className={styles.mobileIcons}>
          {isLoggedIn && (
            <Link 
              to={isAdmin ? "/admin/profile" : "/profile"} 
              className={styles.profileIcon}
              title={user?.name || 'Profile'}
            >
              <div className={styles.avatar}>
                <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            </Link>
          )}
          <button className={styles.menuButton} onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
    </>
  );
};

export default Header;