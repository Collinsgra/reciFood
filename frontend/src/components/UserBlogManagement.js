import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import styles from './UserBlogManagement.module.css';
import BlogPostForm from '../components/admin/BlogPostForm';
import Modal from './Modal';

const UserBlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  // Update the fetchUserBlogs function to use the correct endpoint
  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/user/blogs`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      setError('Failed to load your blogs. Please try again later.');
      setLoading(false);
    }
  };


  const handleCreateBlog = async (formData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setShowForm(false);
      fetchUserBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Failed to create blog. Please try again.');
    }
  };

  const handleUpdateBlog = async (formData) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/blogs/${editingBlog._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      setEditingBlog(null);
      fetchUserBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Failed to update blog. Please try again.');
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/blogs/${blogToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchUserBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog. Please try again.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading your blogs...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.userBlogManagement}>
      <div className={styles.header}>
        <h1>My Articles</h1>
        <button onClick={() => setShowForm(true)} className={styles.createButton}>
          <Plus size={16} />
          Create New Article
        </button>
      </div>

      {blogs.length === 0 ? (
        <p className={styles.emptyState}>You haven't created any articles yet.</p>
      ) : (
        <div className={styles.blogGrid}>
          {blogs.map(blog => (
            <article key={blog._id} className={styles.blogCard}>
              {blog.picture && (
                <div className={styles.blogImage}>
                  <img 
                    src={`${process.env.REACT_APP_API_URL}${blog.picture}`}
                    alt={blog.title}
                  />
                </div>
              )}
              <div className={styles.blogContent}>
                <h2>{blog.title}</h2>
                <p>{blog.content.substring(0, 150)}...</p>
                <div className={styles.blogActions}>
                  <button 
                    onClick={() => setEditingBlog(blog)}
                    className={styles.editButton}
                  >
                    <Edit2 size={16} />
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
            </article>
          ))}
        </div>
      )}

      {(showForm || editingBlog) && (
        <BlogPostForm
          onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
          onCancel={() => {
            setShowForm(false);
            setEditingBlog(null);
          }}
          initialData={editingBlog}
        />
      )}

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this article?</p>
        <div className={styles.modalActions}>
          <button 
            onClick={handleDeleteConfirm}
            className={styles.deleteButton}
          >
            Delete
          </button>
          <button 
            onClick={() => setShowDeleteModal(false)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserBlogManagement;