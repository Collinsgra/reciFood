import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, GitlabIcon as GitHub } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerHeading}>ReciFOOD</h3>
          <p>Discover, create, and share delicious recipes from around the world.</p>
        </div>
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/create-recipe">Create Recipes</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Connect With Us</h4>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHub size={20} /></a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} ReciFOOD. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

