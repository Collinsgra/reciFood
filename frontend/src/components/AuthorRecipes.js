import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthorRecipes.module.css';

const AuthorRecipes = ({ recipes, currentRecipeId }) => {
  // Filter out the current recipe and limit to 3 recipes
  const otherRecipes = recipes
    .filter(recipe => recipe._id !== currentRecipeId)
    .slice(0, 3);

  if (otherRecipes.length === 0) {
    return null;
  }

  return (
    <div className={styles.authorRecipes}>
      <h3>More Recipes by this Author</h3>
      <div className={styles.recipeGrid}>
        {otherRecipes.map(recipe => (
          <Link to={`/recipe/${recipe._id}`} key={recipe._id} className={styles.recipeCard}>
            <div className={styles.imageContainer}>
              {recipe.picture ? (
                <img src={`${process.env.REACT_APP_API_URL}${recipe.picture}`} alt={recipe.title} />
              ) : (
                <div className={styles.placeholderImage}>No Image</div>
              )}
            </div>
            <h4>{recipe.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuthorRecipes;