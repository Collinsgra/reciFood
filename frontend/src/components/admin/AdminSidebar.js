import React from 'react';
import { Link } from 'react-router-dom';
import { X, LayoutDashboard, Users, Utensils, FileText, BarChart2, MessageSquare, Bell, Settings, User } from 'lucide-react';
import styles from './AdminSidebar.module.css';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Utensils, label: "Recipe Management", path: "/admin/recipes" },
    { icon: FileText, label: "Content Management", path: "/admin/content" },
    { icon: User, label: "Admin Profile", path: "/admin/profile" },
  ];

  const handleLinkClick = () => {
    toggleSidebar();
  };

  return (
    <>
      <div 
        className={`${styles.sidebarOverlay} ${isOpen ? styles.open : ''}`} 
        onClick={toggleSidebar}
      />
      <aside className={`${styles.adminSidebar} ${isOpen ? styles.open : ''}`}>
        <button onClick={toggleSidebar} className={styles.closeButton}>
          <X size={24} />
        </button>

        <div className={styles.logo}>
          <h2>Recipe Admin</h2>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={styles.navItem}
              onClick={handleLinkClick}
            >
              <item.icon className={styles.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;