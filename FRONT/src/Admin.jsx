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
  const [message, setMessage] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedUserEvents, setSelectedUserEvents] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalEvents: 0,
    avgEventsPerUser: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Give context time to restore user from localStorage
    const timer = setTimeout(() => {
      if (!user || user.name !== 'admin') {
        navigate('/');
      } else {
        setIsCheckingAuth(false);
        fetchUsers();
        fetchStats();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient.get('/admin/users')
      .then(({ data }) => {
        const usersArray = Object.values(data.users || {});
        setUsers(usersArray);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      });
  };

  const fetchStats = async () => {
    try {
      
      const response = await axiosClient.get('/admin/users'); //fetching the users from the database
      const usersArray = Object.values(response.data.users || {});
      
      // Calculate stats
      const totalUsers = usersArray.length;
      
      // Get events for all users to calculate total events
      let totalEvents = 0;
      const eventPromises = usersArray.map(user => 
        axiosClient.get(`/admin/users/${user.id}/events`)
          .then(res => {
            const events = res.data.events || [];
            totalEvents += events.length;
            return events.length;
          })
          .catch(() => 0)
      );
      
      await Promise.all(eventPromises);
      
      const avgEventsPerUser = totalUsers > 0 ? (totalEvents / totalUsers).toFixed(1) : 0;
      const activeToday = usersArray.length; // This would come from backend
      
      setStats({
        totalUsers,
        activeToday,
        totalEvents,
        avgEventsPerUser
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      axiosClient.delete(`/admin/users/${userId}`)
        .then(() => {
          setMessage({ type: 'success', text: 'User deleted successfully!' });
          fetchUsers();
          fetchStats();
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

  // Filter users based on search term
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Checking admin privileges...</p>
        </div>
      </div>
    );
  }

  if (!user || user.name !== 'admin') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card border-0 shadow-lg rounded-4" style={{ maxWidth: '500px' }}>
          <div className="card-body p-5 text-center">
            <div className="mb-4">
              <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-shield-exclamation fs-2 text-danger"></i>
              </div>
              <h4 className="fw-bold text-dark mb-3">Access Denied</h4>
              <p className="text-muted mb-4">
                Only administrators can access this dashboard.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="btn btn-primary btn-lg px-4 py-2 rounded-pill"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">

      <div className="row mb-4">
        <div className="col-12">
          <div className="p-4 p-lg-5 rounded-4 shadow-sm border-0 mb-4" 
               style={{ 
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
               }}>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold text-white mb-3">
                  <i className="bi bi-shield-lock me-3"></i>
                  Admin Dashboard
                </h1>
                <p className="lead text-white-50 mb-0">
                  Manage users, monitor activities, and view statistics
                </p>
              </div>
              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <div className="d-flex flex-column flex-lg-row gap-3 align-items-center align-items-lg-end">
                  <div className="text-white text-center text-lg-start">
                    <p className="mb-1">Logged in as</p>
                    <h5 className="fw-bold mb-0">{user?.name}</h5>
                  </div>
                  <button 
                    className="btn btn-light btn-lg px-4 py-2 rounded-pill shadow-sm fw-bold"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} 
                      alert-dismissible fade show rounded-3 shadow-sm border-0 mb-4`} 
             role="alert">
          <div className="d-flex align-items-center">
            <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle'} 
                        fs-4 me-3`}></i>
            <span className="fw-medium">{message.text}</span>
          </div>
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row mb-5">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <i className="bi bi-people fs-3 text-primary"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                  <p className="text-muted mb-0">Total Users</p>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-success">
                  <i className="bi bi-arrow-up me-1"></i>
                  Registered users
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <i className="bi bi-activity fs-3 text-success"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{stats.activeToday}</h3>
                  <p className="text-muted mb-0">Active Today</p>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-info">
                  <i className="bi bi-eye me-1"></i>
                  Currently active
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <i className="bi bi-calendar-event fs-3 text-warning"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{stats.totalEvents}</h3>
                  <p className="text-muted mb-0">Total Events</p>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-warning">
                  <i className="bi bi-calendar-plus me-1"></i>
                  All user events
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                  <i className="bi bi-bar-chart fs-3 text-info"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{stats.avgEventsPerUser}</h3>
                  <p className="text-muted mb-0">Avg Events/User</p>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-primary">
                  <i className="bi bi-graph-up me-1"></i>
                  Average per user
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h5 className="fw-bold mb-0">Users Management</h5>
                  <p className="text-muted mb-0">Manage all registered users</p>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-gradient-primary text-white py-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-people-fill fs-3 me-3"></i>
                <div>
                  <h4 className="fw-bold mb-0">Registered Users</h4>
                  <p className="mb-0 opacity-75">
                    {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-people" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
                  </div>
                  <h5 className="text-muted mb-3">
                    {searchTerm ? 'No users found' : 'No users registered yet'}
                  </h5>
                  {searchTerm && (
                    <button 
                      className="btn btn-outline-secondary rounded-pill"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id || u._id} className="align-middle">
                          <td className="ps-4 fw-medium">{u.id || u._id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" 
                                   style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-0">{u.name}</h6>
                                <small className="text-muted">User</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-envelope text-muted me-2"></i>
                              {u.email}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                              <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                              Active
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                onClick={() => handleShowEvents(u.id || u._id, u.name)} 
                                className="btn btn-outline-info btn-sm rounded-pill px-3"
                                title="View Events"
                              >
                                <i className="bi bi-calendar3 me-1"></i>
                                Events
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                onClick={() => handleDeleteUser(u.id || u._id, u.name)}
                                title="Delete User"
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="card-footer bg-light border-top py-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {filteredUsers.length} of {users.length} users
                </small>
                <small className="text-muted">
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Admin privileges active
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Modal */}
      {selectedUserEvents && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="modal-header bg-gradient-info text-white py-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar-event fs-3 me-3"></i>
                  <div>
                    <h4 className="fw-bold mb-0">Events for {selectedUserEvents.userName}</h4>
                    <p className="mb-0 opacity-75">
                      {selectedUserEvents.events.length} event{selectedUserEvents.events.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={handleCloseEvents}
                ></button>
              </div>
              <div className="modal-body p-4">
                {eventsLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading events...</p>
                  </div>
                ) : selectedUserEvents.events.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="bi bi-calendar-x" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
                    </div>
                    <h5 className="text-muted mb-3">No events found</h5>
                    <p className="text-muted">This user hasn't created any events yet.</p>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {selectedUserEvents.events.map((event) => (
                      <div key={event.id || event._id} className="col">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body">
                            <h6 className="fw-bold text-primary mb-2">{event.title}</h6>
                            <p className="text-muted small mb-3">
                              <i className="bi bi-geo-alt me-1"></i>
                              {event.location}
                            </p>
                            <p className="card-text small mb-3">
                              {event.description.substring(0, 100)}
                              {event.description.length > 100 ? '...' : ''}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(event.date).toLocaleDateString()}
                              </small>
                              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                ID: {event.id || event._id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light">
                <button 
                  type="button" 
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={handleCloseEvents}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add CSS for custom styles
const styles = `
  .bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .bg-gradient-info {
    background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  }
  .hover-lift:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
  .card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card:hover {
    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
  }
  .table > :not(caption) > * > * {
    padding: 1rem 1rem;
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}