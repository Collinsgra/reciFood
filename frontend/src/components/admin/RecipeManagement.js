import React, { useState, useEffect } from 'react';
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/recipes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeAction = async (recipeId, action) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/recipes/${recipeId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} recipe`);
      }

      await fetchRecipes(); // Refresh recipe list
    } catch (error) {
      console.error(`Error ${action} recipe:`, error);
      alert(`Failed to ${action} recipe. Please try again.`);
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
        {error}
        <button 
          onClick={fetchRecipes} 
          className={styles.retryButton}
        >
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
                <td>{recipe.status || 'Published'}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      onClick={() => handleRecipeAction(recipe._id, 'approve')}
                      className={`${styles.button} ${styles.approveButton}`}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleRecipeAction(recipe._id, 'reject')}
                      className={`${styles.button} ${styles.rejectButton}`}
                    >
                      Reject
                    </button>
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