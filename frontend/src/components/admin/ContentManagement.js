import React, { useState, useEffect } from 'react';
import styles from './AdminComponents.module.css';

const ContentManagement = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFeaturedRecipes();
    fetchBlogPosts();
  }, []);

  const fetchFeaturedRecipes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/featured-recipes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setFeaturedRecipes(data);
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/blog-posts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setBlogPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFeatureRecipe = async (recipeId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/recipes/${recipeId}/feature`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFeaturedRecipes();
    } catch (error) {
      console.error('Error featuring recipe:', error);
    }
  };

  const handleUnfeatureRecipe = async (recipeId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/recipes/${recipeId}/unfeature`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFeaturedRecipes();
    } catch (error) {
      console.error('Error unfeaturing recipe:', error);
    }
  };

  const handleEditBlogPost = async (postId) => {
    // Implement edit logic here
    console.log("Edit blog post:", postId);
  };

  const handleDeleteBlogPost = async (postId) => {
    // Implement delete logic here
    console.log("Delete blog post:", postId);
  };

  const filteredFeaturedRecipes = featuredRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.contentManagement}>
      <h2>Featured Recipes</h2>
      <input
        type="text"
        placeholder="Search content..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeaturedRecipes.map(recipe => (
            <tr key={recipe.id}>
              <td>{recipe.title}</td>
              <td>{recipe.author}</td>
              <td>
                <button onClick={() => handleUnfeatureRecipe(recipe.id)} className={styles.button}>Unfeature</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Blog Posts</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogPosts.map(post => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>
                <button onClick={() => handleEditBlogPost(post.id)} className={styles.button}>Edit</button>
                <button onClick={() => handleDeleteBlogPost(post.id)} className={styles.button}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentManagement;