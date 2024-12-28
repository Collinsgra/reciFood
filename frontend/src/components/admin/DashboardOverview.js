import React, { useState, useEffect } from 'react';
import { Activity, Users, BookOpen } from 'lucide-react';
import styles from './AdminComponents.module.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    activeUsers: 0,
    mostViewedRecipes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button 
          onClick={fetchDashboardData} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardOverview}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>
            <BookOpen className={styles.icon} />
            Total Recipes
          </h3>
          <p className={styles.statNumber}>{stats.totalRecipes}</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <Users className={styles.icon} />
            Active Users
          </h3>
          <p className={styles.statNumber}>{stats.activeUsers}</p>
        </div>
        <div className={styles.statCard}>
          <h3>
            <Activity className={styles.icon} />
            Most Viewed Recipes
          </h3>
          <ul className={styles.recipeList}>
            {stats.mostViewedRecipes.map(recipe => (
              <li key={recipe._id}>
                {recipe.title} - {recipe.views} views
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;