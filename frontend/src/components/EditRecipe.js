import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import axios from 'axios';
import styles from './EditRecipe.module.css';
import Modal from './Modal';

const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeInMinutes: '',
    servings: '',
    calories: '',
    category: '',
    ingredients: '',
    instructions: ''
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const recipe = response.data;
      setFormData({
        title: recipe.title,
        description: recipe.description,
        timeInMinutes: recipe.timeInMinutes,
        servings: recipe.servings,
        calories: recipe.calories,
        category: recipe.category,
        ingredients: recipe.ingredients.join('\n'),
        instructions: recipe.instructions.join('\n')
      });
      setPreviewUrl(recipe.picture ? `${process.env.REACT_APP_API_URL}${recipe.picture}` : null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Failed to load recipe. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'ingredients' || key === 'instructions') {
          formDataToSend.append(key, JSON.stringify(formData[key].split('\n')));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (image) {
        formDataToSend.append('picture', image);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/recipes/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Recipe updated successfully:', response.data);
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error updating recipe:', error.response?.data || error.message);
      setError('Failed to update recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading recipe...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButton}
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Edit Recipe</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageUpload}>
          <input
            type="file"
            id="recipe-image"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.imageInput}
          />
          <label htmlFor="recipe-image" className={styles.imageLabel}>
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Recipe preview" 
                className={styles.previewImage}
              />
            ) : (
              <div className={styles.placeholder}>
                <ImageIcon size={40} />
                <span>Add Photo</span>
              </div>
            )}
          </label>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="title"
            placeholder="Recipe title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <textarea
            name="description"
            placeholder="Recipe description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="number"
            name="timeInMinutes"
            placeholder="Time (In minutes)"
            value={formData.timeInMinutes}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="number"
            name="servings"
            placeholder="Servings (How many person)"
            value={formData.servings}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={formData.calories}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <textarea
            name="ingredients"
            placeholder="Ingredients (each line for one ingredient)"
            value={formData.ingredients}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <textarea
            name="instructions"
            placeholder="Instructions (each line for one step)"
            value={formData.instructions}
            onChange={handleInputChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Recipe'}
        </button>
      </form>

      <Modal isOpen={!!error} onClose={() => setError(null)}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)} className={styles.modalButton}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default EditRecipe;