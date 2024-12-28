import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import RecipeForm from '../components/RecipeForm';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserRecipes();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUser(data);
      setEditedUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch('/api/recipes/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserRecipes(data);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedUser)
      });
      if (response.ok) {
        setUser(editedUser);
        setIsEditing(false);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleRecipeSubmit = async (formData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/recipes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserRecipes([...userRecipes, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.profile}>
      <h1>User Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleEditToggle}>Edit Profile</button>
        </div>
      )}
      <h2>Your Recipes</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Recipe'}
      </button>
      {showForm && <RecipeForm onSubmit={handleRecipeSubmit} />}
      <div className={styles.recipeGrid}>
        {userRecipes.map((recipe) => (
          <div key={recipe._id} className={styles.recipeCard}>
            {recipe.picture && (
              <img
                src={`${process.env.REACT_APP_API_URL}${recipe.picture}`}
                alt={recipe.title}
                className={styles.recipeImage}
              />
            )}
            <h3>{recipe.title}</h3>
            <p>{recipe.description.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;