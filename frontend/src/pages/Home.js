// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import RecipeCard from '../components/RecipeCard';
// import { useNavigate } from 'react-router-dom';
// import styles from './Home.module.css';

// const Home = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchRecipes();
//   }, []);

//   const fetchRecipes = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
//       console.log('Fetched recipes:', response.data);
//       setRecipes(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching recipes:', error.response?.data || error.message);
//       setError('Failed to load recipes. Please try again later.');
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className={styles.loading}>Loading recipes...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.home}>
//       <h1>Welcome to ReciFOOD</h1>
//       {recipes.length === 0 ? (
//         <p>No recipes found. Be the first to add a recipe!</p>
//       ) : (
//         <div className={styles.recipeGrid}>
//           {recipes.map((recipe) => (
//             <RecipeCard 
//               key={recipe._id} 
//               recipe={recipe} 
//               onCreatorClick={() => navigate(`/creator/${recipe.createdBy}`)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
      // Ensure we're setting an array, even if empty
      setRecipes(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error.response?.data || error.message);
      setError('Failed to load recipes. Please try again later.');
      setRecipes([]); // Ensure recipes is always an array
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading recipes...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Ensure recipes is always treated as an array
  const recipesList = Array.isArray(recipes) ? recipes : [];

  return (
    <div className={styles.home}>
      <h1>Welcome to Recipe App</h1>
      {recipesList.length === 0 ? (
        <p>No recipes found. Be the first to add a recipe!</p>
      ) : (
        <div className={styles.recipeGrid}>
          {recipesList.map((recipe) => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onCreatorClick={() => navigate(`/creator/${recipe.createdBy}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;