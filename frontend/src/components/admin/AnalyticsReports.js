import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import styles from './AdminComponents.module.css';

const AnalyticsReports = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const trafficResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/analytics/traffic`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const trafficData = await trafficResponse.json();
      setTrafficData(trafficData);

      const engagementResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/analytics/engagement`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const engagementData = await engagementResponse.json();
      setEngagementData(engagementData);

      const popularRecipesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/analytics/popular-recipes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const popularRecipesData = await popularRecipesResponse.json();
      setPopularRecipes(popularRecipesData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const handleExportData = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  return (
    <div className={styles.analyticsReports}>
      <button onClick={handleExportData}>Export Data</button>

      <div className={styles.card}>
        <h3>Traffic Overview</h3>
        <LineChart width={600} height={300} data={trafficData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
          <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" />
        </LineChart>
      </div>

      <div className={styles.card}>
        <h3>User Engagement</h3>
        <LineChart width={600} height={300} data={engagementData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#8884d8" />
          <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
          <Line type="monotone" dataKey="shares" stroke="#ffc658" />
        </LineChart>
      </div>

      <div className={styles.card}>
        <h3>Popular Recipes</h3>
        <ul>
          {popularRecipes.map(recipe => (
            <li key={recipe.id}>{recipe.title} - {recipe.views} views</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsReports;