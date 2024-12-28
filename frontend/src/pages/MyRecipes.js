import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import styles from './MyRecipes.module.css';
import Modal from '../components/Modal';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const fetchUserRecipes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      setError('Failed to load your recipes. Please try again later.');
      setLoading(false);
    }
  };

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (recipeToDelete) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/recipes/${recipeToDelete._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.status === 200) {
          setRecipes(recipes.filter(recipe => recipe._id !== recipeToDelete._id));
          setSuccessMessage('Recipe deleted successfully');
        } else {
          throw new Error('Unexpected response status');
        }
      } catch (error) {
        console.error('Error deleting recipe:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to delete recipe. Please try again later.');
      } finally {
        setDeleteModalOpen(false);
        setRecipeToDelete(null);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading your recipes...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.myRecipes}>
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      <div className={styles.header}>
        <h1>My Recipes</h1>
        <Link to="/create-recipe" className={styles.createButton}>
          <PlusCircle size={16} />
          Create New Recipe
        </Link>
      </div>
      
      {recipes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't created any recipes yet.</p>
          <Link to="/create-recipe" className={styles.createButton}>
            <PlusCircle size={16} />
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className={styles.recipeGrid}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.recipeCard}>
              <div className={styles.recipeImage}>
                {recipe.picture ? (
                  <img 
                    src={`${process.env.REACT_APP_API_URL}${recipe.picture}`} 
                    alt={recipe.title}
                  />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.recipeContent}>
                <h2>{recipe.title}</h2>
                <p>{recipe.description.substring(0, 100)}...</p>
                <div className={styles.recipeInfo}>
                  <span>Created: {new Date(recipe.createdAt).toLocaleDateString()}</span>
                  <span>By: {recipe.creatorName}</span>
                </div>
                <div className={styles.recipeActions}>
                  <Link to={`/recipe/${recipe._id}`} className={styles.viewButton}>
                    View Recipe
                  </Link>
                  <Link to={`/edit-recipe/${recipe._id}`} className={styles.editButton}>
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button onClick={() => handleDeleteClick(recipe)} className={styles.deleteButton}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this recipe?</p>
        <div className={styles.modalActions}>
          <button onClick={handleDeleteConfirm} className={styles.deleteButton}>Delete</button>
          <button onClick={() => setDeleteModalOpen(false)} className={styles.cancelButton}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default MyRecipes;