import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "./axiosClient.js";
import { useUserContext } from "./UserContext.jsx";
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user, setUser, token, setToken } = useUserContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Give context time to restore user from localStorage
    const timer = setTimeout(() => {
      if (!user || user.name !== 'admin') {
        navigate('/');
      } else {
        setIsCheckingAuth(false);
        fetchUsers();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient.get('/users')
      .then(({ data }) => {
        setUsers(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axiosClient.delete(`/users/${userId}`)
        .then(() => {
          setMessage('User deleted successfully!');
          fetchUsers();
          setTimeout(() => setMessage(null), 3000);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to delete user');
        });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate('../login');
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="container mt-5">
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.name !== 'admin') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Users are not allowed to access the dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Manage Users</p>
        </div>
        <div className="col-md-4 text-end">
          <button 
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}


    

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Users List</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted">No users found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id || u._id}>
                      <td>{u.id || u._id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(u.id || u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}