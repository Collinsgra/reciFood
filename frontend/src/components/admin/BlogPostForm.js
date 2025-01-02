import React, { useState, useEffect } from 'react';
import { X, ImageIcon } from 'lucide-react';
import styles from './AdminComponents.module.css';

const BlogPostForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    picture: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        picture: null, // Reset picture on edit
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, picture: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)));
    if (formData.picture) {
      formDataToSend.append('picture', formData.picture);
    }
    onSubmit(formDataToSend);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onCancel}>
          <X size={24} />
        </button>
        <h2>{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageUpload}>
            <input
              type="file"
              id="blog-image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.imageInput}
            />
            <label htmlFor="blog-image" className={styles.imageLabel}>
              {formData.picture ? (
                <img 
                  src={URL.createObjectURL(formData.picture)} 
                  alt="Blog preview" 
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
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className={styles.textarea}
              rows={10}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="cooking, recipes, tips"
              className={styles.input}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {initialData ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostForm;