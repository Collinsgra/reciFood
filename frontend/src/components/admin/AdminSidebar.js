import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Utensils, FileText, BarChart2, MessageSquare, Bell, Settings, User } from 'lucide-react';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Utensils, label: "Recipe Management", path: "/admin/recipes" },
    { icon: FileText, label: "Content Management", path: "/admin/content" },
    { icon: BarChart2, label: "Analytics", path: "/admin/analytics" },
    { icon: MessageSquare, label: "Comments", path: "/admin/comments" },
    { icon: Bell, label: "Notifications", path: "/admin/notifications" },
    { icon: Settings, label: "App Settings", path: "/admin/settings" },
    { icon: User, label: "Admin Profile", path: "/admin/profile" },
  ];

  return (
    <div className={styles.adminSidebar}>
      <div className={styles.logo}>
        <h2>Recipe Admin</h2>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link key={item.label} to={item.path} className={styles.navItem}>
            <item.icon className={styles.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;