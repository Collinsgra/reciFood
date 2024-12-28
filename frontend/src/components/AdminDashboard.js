import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRecipes();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <h1>Admin Dashboard</h1>
      <section className={styles.users}>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.name} - {user.email}</li>
          ))}
        </ul>
      </section>
      <section className={styles.recipes}>
        <h2>Recipes</h2>
        <ul>
          {recipes.map(recipe => (
            <li key={recipe._id}>{recipe.title} - by {recipe.createdBy.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;