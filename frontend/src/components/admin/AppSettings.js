import React, { useState, useEffect } from 'react';
import styles from './AdminComponents.module.css';

const AppSettings = () => {
  const [settings, setSettings] = useState({
    appName: '',
    logo: '',
    allowUserRegistration: true,
    enableComments: true,
    enableRatings: true
  });

  useEffect(() => {
    fetchAppSettings();
  }, []);

  const fetchAppSettings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/app-settings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching app settings:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: !prevSettings[name]
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/app-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving app settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div className={styles.appSettings}>
      <h2>App Settings</h2>
      <input
        type="text"
        name="appName"
        placeholder="App Name"
        value={settings.appName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="logo"
        placeholder="Logo URL"
        value={settings.logo}
        onChange={handleInputChange}
      />
      <div className={styles.settingItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.allowUserRegistration}
            onChange={() => handleCheckboxChange('allowUserRegistration')}
          />
          Allow User Registration
        </label>
      </div>
      <div className={styles.settingItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.enableComments}
            onChange={() => handleCheckboxChange('enableComments')}
          />
          Enable Comments
        </label>
      </div>
      <div className={styles.settingItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.enableRatings}
            onChange={() => handleCheckboxChange('enableRatings')}
          />
          Enable Ratings
        </label>
      </div>
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default AppSettings;