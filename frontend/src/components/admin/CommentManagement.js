import React, { useState, useEffect } from 'react';
import styles from './AdminComponents.module.css';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/comments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCommentAction = async (commentId, action) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/comments/${commentId}/${action}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchComments(); // Refresh comment list
    } catch (error) {
      console.error(`Error ${action} comment:`, error);
    }
  };

  const filteredComments = comments.filter(comment =>
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.commentManagement}>
      <input
        type="text"
        placeholder="Search comments..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Content</th>
            <th>Recipe</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComments.map(comment => (
            <tr key={comment.id}>
              <td>{comment.author}</td>
              <td>{comment.content}</td>
              <td>{comment.recipe}</td>
              <td>{new Date(comment.date).toLocaleString()}</td>
              <td>
                <button onClick={() => handleCommentAction(comment.id, 'approve')}>Approve</button>
                <button onClick={() => handleCommentAction(comment.id, 'delete')}>Delete</button>
                <button onClick={() => handleCommentAction(comment.id, 'edit')}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentManagement;