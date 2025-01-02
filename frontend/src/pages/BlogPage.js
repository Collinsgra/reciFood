import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import styles from './BlogPage.module.css';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`);
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading blogs...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.blogPage}>
      <div className={styles.blogHeader}>
        <h1>Food & Recipe Blog</h1>
        <p>Discover cooking tips, recipes, and culinary stories from our community</p>
      </div>

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
              <div className={styles.blogMeta}>
                <span>
                  <User size={16} />
                  {blog.author.name}
                </span>
                <span>
                  <Calendar size={16} />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/blogs/${blog._id}`} className={styles.readMoreButton}>
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;