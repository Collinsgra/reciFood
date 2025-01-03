import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import styles from './Profile.module.css';
import RecipeForm from '../components/RecipeForm';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserRecipes();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUser(data);
      setEditedUser(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedUser)
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      setUser(editedUser);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
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
      setError('Failed to create recipe. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchUserProfile} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <p>Profile not found. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <span>{user.name[0].toUpperCase()}</span>
          </div>
          <div className={styles.userInfo}>
            <h1>{user.name}</h1>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>
        <button onClick={handleEditToggle} className={styles.editButton}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      ) : (
        <div className={styles.profileContent}>
          <h2>Your Recipes</h2>
          <button onClick={() => setShowForm(!showForm)} className={styles.addRecipeButton}>
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
      )}
    </div>
  );
};

export default Profile;