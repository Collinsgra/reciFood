import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminComponents.module.css';

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const categories = [
    'Soup',
    'Main Course',
    'Dessert',
    'Appetizer',
    'Salad',
    'Breakfast',
    'Snack'
  ];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
    
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/recipes`, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    
      setRecipes(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load recipes. Please try again later.';
      setError(errorMessage);
    
      // Handle unauthorized or forbidden access
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Access denied. Please ensure you have admin privileges and are logged in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeAction = async (recipeId, action) => {
    try {
      const token = localStorage.getItem('token');
    
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (action === 'delete') {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/admin/recipes/${recipeId}`,
          { headers }
        );
      } else {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/recipes/${recipeId}/${action}`,
          {},
          { headers }
        );
      }
    
      fetchRecipes();
    } catch (error) {
      console.error(`Error ${action} recipe:`, error);
      const errorMessage = error.response?.data?.message || `Failed to ${action} recipe. Please try again.`;
      alert(errorMessage);
    
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Access denied. Please ensure you have admin privileges and are logged in.');
      }
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    (recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.creatorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === '' || recipe.category === filterCategory)
  );

  if (loading) {
    return <div className={styles.loading}>Loading recipes...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <span>{error}</span>
        <button onClick={fetchRecipes} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.recipeManagement}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Creator</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map(recipe => (
              <tr key={recipe._id}>
                <td>{recipe.title}</td>
                <td>{recipe.category}</td>
                <td>{recipe.creatorName}</td>
                <td>{recipe.status || 'Pending'}</td>
                <td>
                  <div className={styles.actionButtons}>
                    {recipe.status !== 'approved' && (
                      <button 
                        onClick={() => handleRecipeAction(recipe._id, 'approve')}
                        className={`${styles.button} ${styles.approveButton}`}
                      >
                        Approve
                      </button>
                    )}
                    {recipe.status !== 'rejected' && (
                      <button 
                        onClick={() => handleRecipeAction(recipe._id, 'reject')}
                        className={`${styles.button} ${styles.rejectButton}`}
                      >
                        Reject
                      </button>
                    )}
                    <button 
                      onClick={() => handleRecipeAction(recipe._id, 'delete')}
                      className={`${styles.button} ${styles.deleteButton}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeManagement;