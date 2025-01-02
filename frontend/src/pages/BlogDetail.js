import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import styles from './BlogDetail.module.css';
import ShareMenu from '../components/ShareMenu';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading blog post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/blogs" className={styles.backButton}>
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Not Found</h2>
          <p>Blog post not found.</p>
          <Link to="/blogs" className={styles.backButton}>
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.blogDetail}>
      <div className={styles.header}>
        <Link to="/blogs" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Back to Blogs</span>
        </Link>
        <ShareMenu 
          title={blog.title}
          url={window.location.href}
        />
      </div>

      {blog.picture && (
        <div className={styles.heroImage}>
          <img 
            src={`${process.env.REACT_APP_API_URL}${blog.picture}`}
            alt={blog.title}
          />
        </div>
      )}

      <div className={styles.content}>
        <h1>{blog.title}</h1>
        
        <div className={styles.metadata}>
          <div className={styles.author}>
            <User size={20} />
            <span>{blog.author.name}</span>
          </div>
          <div className={styles.date}>
            <Calendar size={20} />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className={styles.tags}>
            {blog.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div 
          className={styles.blogContent}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;