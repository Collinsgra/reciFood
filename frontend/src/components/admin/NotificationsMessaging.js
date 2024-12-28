import React, { useState } from 'react';
import styles from './AdminComponents.module.css';

const NotificationsMessaging = () => {
  const [notificationType, setNotificationType] = useState('all');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationContent, setNotificationContent] = useState('');

  const handleSendNotification = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: notificationType,
          title: notificationTitle,
          content: notificationContent
        })
      });
      alert('Notification sent successfully');
      setNotificationTitle('');
      setNotificationContent('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

  return (
    <div className={styles.notificationsMessaging}>
      <h2>Send Notification</h2>
      <select
        value={notificationType}
        onChange={(e) => setNotificationType(e.target.value)}
      >
        <option value="all">All Users</option>
        <option value="admin">Admins</option>
        <option value="contributor">Contributors</option>
        <option value="user">Regular Users</option>
      </select>
      <input
        type="text"
        placeholder="Notification Title"
        value={notificationTitle}
        onChange={(e) => setNotificationTitle(e.target.value)}
      />
      <textarea
        placeholder="Notification Content"
        value={notificationContent}
        onChange={(e) => setNotificationContent(e.target.value)}
      />
      <button onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default NotificationsMessaging;