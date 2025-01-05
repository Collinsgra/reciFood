import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Star, StarOff, Search, Filter } from 'lucide-react';
import styles from './AdminComponents.module.css';
import BlogPostForm from './BlogPostForm';
import Modal from '../Modal';

const ContentManagement = () => {
  const [content, setContent] = useState({
    recipes: [],
    blogs: [],
    featuredRecipes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('recipes');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const [recipesRes, blogsRes, featuredRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/recipes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/blogs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/featured-recipes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setContent({
        recipes: recipesRes.data,
        blogs: blogsRes.data,
        featuredRecipes: featuredRes.data
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (id, action, type) => {
    try {
      const endpoint = `${process.env.REACT_APP_API_URL}/api/admin/${type}/${id}/${action}`;
      await axios.put(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchContent();
    } catch (error) {
      console.error(`Error performing ${action} on ${type}:`, error);
      setError(`Failed to ${action} ${type}. Please try again.`);
    }
  };

  const handleDeleteClick = (item, type) => {
    setItemToDelete({ ...item, type });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/${itemToDelete.type}s/${itemToDelete._id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchContent();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleBlogSubmit = async (formData) => {
    try {
      if (editingBlog) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/blogs/${editingBlog._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/blogs`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      setShowBlogForm(false);
      setEditingBlog(null);
      fetchContent();
    } catch (error) {
      console.error('Error saving blog:', error);
      setError('Failed to save blog post. Please try again.');
    }
  };

  const filteredContent = {
    recipes: content.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'all' || recipe.status === filterType)
    ),
    blogs: content.blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  if (loading) return <div className={styles.loading}>Loading content...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.contentManagement}>
      <div className={styles.contentHeader}>
        <h1>Content Management</h1>
        <div className={styles.contentControls}>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterControl}>
            <Filter size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'recipes' ? styles.active : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'blogs' ? styles.active : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            Blog Posts
          </button>
        </div>

        {activeTab === 'recipes' ? (
          <div className={styles.recipesSection}>
            <div className={styles.contentGrid}>
              {filteredContent.recipes.map(recipe => (
                <div key={recipe._id} className={styles.contentCard}>
                  <div className={styles.cardImage}>
                    {recipe.picture ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${recipe.picture}`}
                        alt={recipe.title}
                      />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                    <div className={styles.cardStatus} data-status={recipe.status}>
                      {recipe.status}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{recipe.title}</h3>
                    <p>By {recipe.creatorName}</p>
                    <div className={styles.cardActions}>
                      <button
                        onClick={() => handleContentAction(recipe._id, 'approve', 'recipes')}
                        className={styles.approveButton}
                        disabled={recipe.status === 'approved'}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleContentAction(recipe._id, 'reject', 'recipes')}
                        className={styles.rejectButton}
                        disabled={recipe.status === 'rejected'}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleContentAction(recipe._id, recipe.featured ? 'unfeature' : 'feature', 'recipes')}
                        className={styles.featureButton}
                      >
                        {recipe.featured ? <StarOff size={20} /> : <Star size={20} />}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(recipe, 'recipe')}
                        className={styles.deleteButton}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.blogsSection}>
            <div className={styles.sectionHeader}>
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setShowBlogForm(true);
                }}
                className={styles.createButton}
              >
                <Plus size={20} />
                Create New Blog Post
              </button>
            </div>
            <div className={styles.contentGrid}>
              {filteredContent.blogs.map(blog => (
                <div key={blog._id} className={styles.contentCard}>
                  <div className={styles.cardImage}>
                    {blog.picture ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${blog.picture}`}
                        alt={blog.title}
                      />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{blog.title}</h3>
                    <p>By {blog.author.name}</p>
                    <div className={styles.cardActions}>
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setShowBlogForm(true);
                        }}
                        className={styles.editButton}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(blog, 'blog')}
                        className={styles.deleteButton}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        <p>Are you sure you want to delete this {itemToDelete?.type}?</p>
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