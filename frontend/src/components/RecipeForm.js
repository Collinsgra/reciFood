import React, { useState } from 'react';
import axios from 'axios';
import styles from './RecipeForm.module.css';

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [picture, setPicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', JSON.stringify(ingredients.split('\n')));
    formData.append('instructions', JSON.stringify(instructions.split('\n')));
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/recipes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Recipe created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setIngredients('');
      setInstructions('');
      setPicture(null);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.recipeForm}>
      <h2>Create New Recipe</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="ingredients">Ingredients (one per line):</label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="instructions">Instructions (one per line):</label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="picture">Picture:</label>
        <input
          type="file"
          id="picture"
          onChange={(e) => setPicture(e.target.files[0])}
          accept="image/*"
        />
      </div>
      <button type="submit">Create Recipe</button>
    </form>
  );
};

export default RecipeForm;