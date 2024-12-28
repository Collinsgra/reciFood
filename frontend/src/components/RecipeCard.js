import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Flame, Calendar, User } from 'lucide-react';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe, onCreatorClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className={styles.recipeCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.recipeImageContainer}>
        {recipe.picture ? (
          <img 
            src={`${process.env.REACT_APP_API_URL}${recipe.picture}`} 
            alt={recipe.title} 
            className={styles.recipeImage}
          />
        ) : (
          <div className={styles.placeholderImage}>No Image</div>
        )}
        <div className={styles.recipeCategory}>{recipe.category}</div>
      </div>
      <div className={styles.recipeContent}>
        <h2>{recipe.title}</h2>
        <div className={styles.recipeMetaInfo}>
          <span><Clock size={16} /> {recipe.timeInMinutes} mins</span>
          <span><Users size={16} /> {recipe.servings} servings</span>
          <span><Flame size={16} /> {recipe.calories} cal</span>
        </div>
        <div className={styles.recipeCreator}>
          <User size={16} />
          <span 
            onClick={() => onCreatorClick(recipe.createdBy)}
            className={styles.creatorName}
          >
            {recipe.creatorName}
          </span>
        </div>
        <div className={styles.recipeDate}>
          <Calendar size={16} /> {formatDate(recipe.createdAt)}
        </div>
        <div className={`${styles.recipeDescription} ${isHovered ? styles.show : ''}`}>
          <p>{recipe.description}</p>
        </div>
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;