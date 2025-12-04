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
  const [selectedUserEvents, setSelectedUserEvents] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);

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
    axiosClient.get('/admin/users')
      .then(({ data }) => {
        console.log(data)
        //JSON.parse(data.users);
        setUsers(Object.values(data.users));
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
          // Clear events if we're viewing the deleted user's events
          if (selectedUserEvents && selectedUserEvents.userId === userId) {
            setSelectedUserEvents(null);
          }
          setTimeout(() => setMessage(null), 3000);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to delete user');
        });
    }
  };

  const handleShowEvents = (userId, userName) => {
    setEventsLoading(true);
    axiosClient.get(`/admin/users/${userId}/events`)
      .then(({ data }) => {
        setSelectedUserEvents({
          userId,
          userName,
          events: data.events || []
        });
        setEventsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch events');
        setEventsLoading(false);
      });
  };

  const handleCloseEvents = () => {
    setSelectedUserEvents(null);
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

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Events Modal */}
      {selectedUserEvents && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  Events for {selectedUserEvents.userName}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={handleCloseEvents}
                ></button>
              </div>
              <div className="modal-body">
                {eventsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : selectedUserEvents.events.length === 0 ? (
                  <p className="text-center text-muted">No events found for this user</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Event ID</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUserEvents.events.map((event) => (
                          <tr key={event.id || event._id}>
                            <td>{event.id || event._id}</td>
                            <td>{event.title}</td>
                            <td>{event.description}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
                            <td>{event.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCloseEvents}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
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
                    <th>Events</th>
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
                        <button 
                          onClick={() => handleShowEvents(u.id || u._id, u.name)} 
                          className='btn btn-sm btn-outline-info'
                        >
                          Show Events
                        </button>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
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