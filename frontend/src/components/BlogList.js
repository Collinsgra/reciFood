import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, PenLine } from 'lucide-react';
import axios from 'axios';
import styles from './BlogList.module.css';
import BlogPostForm from './admin/BlogPostForm';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs. Please try again later.');
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
      setShowCreateForm(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Failed to create blog post. Please try again.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading blogs...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.blogListContainer}>
      <div className={styles.blogHeader}>
        <h1>Blog Posts</h1>
        <button 
          className={styles.createButton}
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={16} />
          Create New Post
        </button>
      </div>

      <div className={styles.blogGrid}>
        {blogs.map(blog => (
          <article key={blog._id} className={styles.blogCard}>
            {blog.picture && (
              <img 
                src={`${process.env.REACT_APP_API_URL}${blog.picture}`}
                alt={blog.title}
                className={styles.blogImage}
              />
            )}
            <div className={styles.blogContent}>
              <h2>{blog.title}</h2>
              <p>{blog.content.substring(0, 150)}...</p>
              <div className={styles.blogMeta}>
                <span>By {blog.author.name}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <Link to={`/blog/${blog._id}`} className={styles.readMoreButton}>
                <PenLine size={16} />
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>

      {showCreateForm && (
        <BlogPostForm
          onSubmit={handleCreateBlog}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default BlogList;