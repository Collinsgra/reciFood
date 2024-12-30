import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, Users, ChefHat, Timer, BarChart, Edit, Trash2 } from 'lucide-react';
import styles from './RecipeDetail.module.css';
import Modal from '../components/Modal';
import ShareMenu from '../components/ShareMenu';
import AuthorRecipes from '../components/AuthorRecipes';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [authorRecipes, setAuthorRecipes] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchRecipe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // First fetch the recipe
      const recipeResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/recipes/${id}`, 
        { headers }
      );

      const recipe = recipeResponse.data;
      setRecipe(recipe);

      // Fetch author's recipes
      if (recipe && recipe.createdBy) {
        try {
          const authorRecipesResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/recipes/creator/${recipe.createdBy}`, 
            { headers }
          );
          setAuthorRecipes(authorRecipesResponse.data.recipes || []);
        } catch (authorError) {
          console.error('Error fetching author recipes:', authorError);
          setAuthorRecipes([]);
        }
      } else {
        setAuthorRecipes([]);
      }

      // Check if the logged-in user is the owner
      const userId = localStorage.getItem('userId');
      setIsOwner(userId && recipe.createdBy === userId);

    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError(
        error.response?.data?.message || 
        'Failed to load recipe. Please try again later.'
      );
      setRecipe(null);
      setAuthorRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [id, fetchRecipe]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/recipes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/my-recipes', { state: { message: 'Recipe deleted successfully' } });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError(
        error.response?.data?.message || 
        'Failed to delete recipe. Please try again later.'
      );
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading recipe...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchRecipe} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Not Found</h2>
          <p>Recipe not found.</p>
          <Link to="/" className={styles.homeButton}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recipeDetail}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.subtitle}>Let's Cook</div>
          <h1>{recipe.title}</h1>
          {isOwner && (
            <div className={styles.ownerActions}>
              <Link to={`/edit-recipe/${recipe._id}`} className={styles.editButton}>
                <Edit size={16} />
                Edit Recipe
              </Link>
              <button onClick={handleDeleteClick} className={styles.deleteButton}>
                <Trash2 size={16} />
                Delete Recipe
              </button>
            </div>
          )}
        </div>
        {recipe.picture && (
          <img 
            src={`${process.env.REACT_APP_API_URL}${recipe.picture}`} 
            alt={recipe.title} 
            className={styles.heroImage}
          />
        )}
      </div>

      <div className={styles.recipeContent}>
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <ChefHat size={24} />
            <span>Cuisine</span>
            <strong>{recipe.category}</strong>
          </div>
          <div className={styles.metaItem}>
            <Users size={24} />
            <span>Servings</span>
            <strong>{recipe.servings} Persons</strong>
          </div>
          <div className={styles.metaItem}>
            <Timer size={24} />
            <span>Prep Time</span>
            <strong>{recipe.timeInMinutes} minutes</strong>
          </div>
          <div className={styles.metaItem}>
            <Clock size={24} />
            <span>Total Time</span>
            <strong>{recipe.timeInMinutes} minutes</strong>
          </div>
          <div className={styles.metaItem}>
            <BarChart size={24} />
            <span>Calories</span>
            <strong>{recipe.calories} kcal</strong>
          </div>
        </div>

        <p className={styles.description}>{recipe.description}</p>

        <div className={styles.mainContent}>
          <div className={styles.ingredientsSection}>
            <h2>Ingredients</h2>
            <ul className={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className={styles.cookingInstructions}>
            <h2>Cooking Instructions</h2>
            <div className={styles.instructions}>
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className={styles.instructionStep}>
                  <div className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</div>
                  <p>{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {recipe && recipe.createdBy && authorRecipes.length > 0 && (
          <AuthorRecipes recipes={authorRecipes} currentRecipeId={recipe._id} />
        )}
        <div className={styles.chefCard}>
          <div className={styles.chefInfo}>
            <h3>Recipe by</h3>
            <strong>{recipe.creatorName}</strong>
          </div>
          <ShareMenu 
            title={recipe.title}
            url={window.location.href}
          />
        </div>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this recipe?</p>
        <div className={styles.modalActions}>
          <button onClick={handleDeleteConfirm} className={styles.deleteButton}>
            Delete
          </button>
          <button onClick={() => setDeleteModalOpen(false)} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RecipeDetail;