import React, { useState, useEffect } from 'react';
import styles from './AdminComponents.module.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      await fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      await fetchUsers(); // Refresh user list
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button 
          onClick={fetchUsers} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.userManagement}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={styles.select}
                  >
                    <option value="user">User</option>
                    <option value="contributor">Contributor</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      onClick={() => handleUserAction(user._id, 'suspend')}
                      className={`${styles.button} ${styles.suspendButton}`}
                    >
                      Suspend
                    </button>
                    <button 
                      onClick={() => handleUserAction(user._id, 'delete')}
                      className={`${styles.button} ${styles.deleteButton}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;