import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import styles from './UserBlogPost.module.css';

const UserBlogPost = ({ blog, onDelete }) => {
  return (
    <div className={styles.blogPost}>
      <div className={styles.imageContainer}>
        {blog.picture ? (
          <img src={`${process.env.REACT_APP_API_URL}${blog.picture}`} alt={blog.title} />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <div className={styles.content}>
        <h2>{blog.title}</h2>
        <p>{blog.content.substring(0, 100)}...</p>
        <div className={styles.tags}>
          {blog.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        <Link to={`/edit-blog/${blog._id}`} className={styles.editButton}>
          <Edit size={16} />
          Edit
        </Link>
        <button onClick={() => onDelete(blog._id)} className={styles.deleteButton}>
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserBlogPost;