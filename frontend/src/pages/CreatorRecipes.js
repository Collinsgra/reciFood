import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import styles from './CreatorRecipes.module.css';

const CreatorRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { creatorId } = useParams();

  useEffect(() => {
    fetchCreatorRecipes();
  }, [creatorId]);

  const fetchCreatorRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/creator/${creatorId}`);
      setRecipes(response.data.recipes);
      setCreator(response.data.creator);
    } catch (error) {
      console.error('Error fetching creator recipes:', error);
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading recipes...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.creatorRecipes}>
      <h1>Recipes by {creator?.name}</h1>
      {recipes.length === 0 ? (
        <p>No recipes found for this creator.</p>
      ) : (
        <div className={styles.recipeGrid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
      <Link to="/" className={styles.backButton}>Back to Home</Link>
    </div>
  );
};

export default CreatorRecipes;