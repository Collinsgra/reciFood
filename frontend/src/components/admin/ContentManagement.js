import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Star, StarOff } from 'lucide-react';
import styles from './AdminComponents.module.css';
import BlogPostForm from './BlogPostForm';
import Modal from '../Modal';

const ContentManagement = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [recipesResponse, blogsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/featured-recipes`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/blogs`, { headers })
      ]);

      setFeaturedRecipes(recipesResponse.data);
      setBlogs(blogsResponse.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error.response?.data?.message || 'Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleFeatureRecipe = async (recipeId, featured) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = featured ? 'unfeature' : 'feature';
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/recipes/${recipeId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchContent();
    } catch (error) {
      console.error('Error updating recipe feature status:', error);
      setError(error.response?.data?.message || 'Failed to update recipe feature status.');
    }
  };

  const handleBlogSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      if (editingBlog) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/blogs/${editingBlog._id}`,
          formData,
          { headers }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/blogs`,
          formData,
          { headers }
        );
      }
      
      setShowBlogForm(false);
      setEditingBlog(null);
      fetchContent();
    } catch (error) {
      console.error('Error saving blog:', error);
      setError(error.response?.data?.message || 'Failed to save blog post.');
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/admin/blogs/${blogToDelete._id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setDeleteModalOpen(false);
        setBlogToDelete(null);
        fetchContent();
      } catch (error) {
        console.error('Error deleting blog:', error);
        setError(error.response?.data?.message || 'Failed to delete blog post.');
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading content...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchContent} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.contentManagement}>
      <div className={styles.section}>
        <h2>Featured Recipes</h2>
        <div className={styles.recipeGrid}>
          {featuredRecipes.length === 0 ? (
            <p>No featured recipes found.</p>
          ) : (
            featuredRecipes.map(recipe => (
              <div key={recipe._id} className={styles.recipeCard}>
                {recipe.picture && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}${recipe.picture}`}
                    alt={recipe.title}
                  />
                )}
                <div className={styles.recipeContent}>
                  <h3>{recipe.title}</h3>
                  <button
                    onClick={() => handleFeatureRecipe(recipe._id, true)}
                    className={styles.featureButton}
                  >
                    <StarOff size={16} />
                    Remove from Featured
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Blog Posts</h2>
          <button
            onClick={() => {
              setEditingBlog(null);
              setShowBlogForm(true);
            }}
            className={styles.createButton}
          >
            <Plus size={16} />
            Create New Blog Post
          </button>
        </div>

        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.blogGrid}>
          {filteredBlogs.length === 0 ? (
            <p>No blog posts found.</p>
          ) : (
            filteredBlogs.map(blog => (
              <div key={blog._id} className={styles.blogCard}>
                {blog.picture && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}${blog.picture}`}
                    alt={blog.title}
                  />
                )}
                <div className={styles.blogContent}>
                  <h3>{blog.title}</h3>
                  <p>{blog.content.substring(0, 100)}...</p>
                  <div className={styles.blogMeta}>
                    <span>By {blog.author.name}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.blogActions}>
                    <button
                      onClick={() => {
                        setEditingBlog(blog);
                        setShowBlogForm(true);
                      }}
                      className={styles.editButton}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className={styles.deleteButton}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showBlogForm && (
        <BlogPostForm
          onSubmit={handleBlogSubmit}
          onCancel={() => {
            setShowBlogForm(false);
            setEditingBlog(null);
          }}
          initialData={editingBlog}
        />
      )}

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this blog post?</p>
        <div className={styles.modalActions}>
          <button onClick={handleDeleteConfirm} className={styles.deleteButton}>
            Delete
          </button>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ContentManagement;