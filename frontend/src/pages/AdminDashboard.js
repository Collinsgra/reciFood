import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardOverview from '../components/admin/DashboardOverview';
import UserManagement from '../components/admin/UserManagement';
import RecipeManagement from '../components/admin/RecipeManagement';
import ContentManagement from '../components/admin/ContentManagement';
import AnalyticsReports from '../components/admin/AnalyticsReports';
import CommentManagement from '../components/admin/CommentManagement';
import NotificationsMessaging from '../components/admin/NotificationsMessaging';
import AppSettings from '../components/admin/AppSettings';
import AdminProfile from '../components/admin/AdminProfile';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  return (
    <div className={styles.adminDashboard}>
      <div className={styles.content}>
        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="recipes" element={<RecipeManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="analytics" element={<AnalyticsReports />} />
          <Route path="comments" element={<CommentManagement />} />
          <Route path="notifications" element={<NotificationsMessaging />} />
          <Route path="settings" element={<AppSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;