import React, { useState, useEffect } from 'react';
import styles from './AdminComponents.module.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setProfile(prevProfile => ({
        ...prevProfile,
        name: data.name,
        email: data.email,
        twoFactorEnabled: data.twoFactorEnabled
      }));
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleTwoFactorToggle = () => {
    setProfile(prevProfile => ({
      ...prevProfile,
      twoFactorEnabled: !prevProfile.twoFactorEnabled
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating admin profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword
        })
      });
      alert('Password changed successfully');
      setProfile(prevProfile => ({
        ...prevProfile,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  return (
    <div className={styles.adminProfile}>
      <h2>Admin Profile</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={profile.name}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={profile.email}
        onChange={handleInputChange}
      />
      <button onClick={handleUpdateProfile}>Update Profile</button>

      <h3>Change Password</h3>
      <input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        value={profile.currentPassword}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={profile.newPassword}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm New Password"
        value={profile.confirmPassword}
        onChange={handleInputChange}
      />
      <button onClick={handleChangePassword}>Change Password</button>

      <div className={styles.twoFactor}>
        <h3>Two-Factor Authentication</h3>
        <label>
          <input
            type="checkbox"
            checked={profile.twoFactorEnabled}
            onChange={handleTwoFactorToggle}
          />
          {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
        </label>
      </div>
    </div>
  );
};

export default AdminProfile;

