import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Events() {
  const { user } = useUserContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // New state for tab view

  const getIconUrl = (icon) => {
    if (!icon) return "https://cdn.weatherapi.com/weather/64x64/day/113.png";
    return icon.startsWith("//") ? `https:${icon}` : icon;
  };
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    description: ''
  });

  // Fetch all events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    setError(null);
    axiosClient.get('/user/events')
      .then(({ data }) => {
        setEvents(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch events');
        setLoading(false);
      });
  };

  // Filter events based on active tab
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    if (activeTab === 'upcoming') return eventDate >= now;
    if (activeTab === 'past') return eventDate < now;
    return true;
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      date: '',
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.date || !formData.description) {
      setError('All fields are required');
      return;
    }

    axiosClient.post('/user/events', formData)
      .then(() => {
        setMessage('Event created successfully!');
        resetForm();
        fetchEvents();
        setTimeout(() => setMessage(null), 3000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to create event');
      });
  };

  // Update event
  const handleUpdateEvent = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.date || !formData.description) {
      setError('All fields are required');
      return;
    }

    axiosClient.put(`/user/events/${editingId}`, formData)
      .then(() => {
        setMessage('Event updated successfully!');
        resetForm();
        fetchEvents();
        setTimeout(() => setMessage(null), 3000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to update event');
      });
  };

  // Delete event
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      axiosClient.delete(`/user/events/${eventId}`)
        .then(() => {
          setMessage('Event deleted successfully!');
          fetchEvents();
          setTimeout(() => setMessage(null), 3000);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to delete event');
        });
    }
  };

  // Edit event
  const handleEditEvent = (event) => {
    setFormData({
      title: event.title,
      location: event.location,
      date: event.date,
      description: event.description
    });
    setEditingId(event.id || event._id);
    setShowForm(true);
    setShowDetails(false);
  };

  // View event details
  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
    setShowForm(false);
  };

  // Close details
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEvent(null);
  };

  return (
    <div className="container py-5">
      {/* Header with Gradient Background */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="p-4 p-lg-5 rounded-4 shadow-sm border-0 mb-4" 
               style={{ 
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
               }}>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold text-white mb-3">
                  <i className="bi bi-calendar2-event me-3"></i>
                  My Events
                </h1>
                <p className="lead text-white-50 mb-0">
                  Manage your upcoming events and activities
                </p>
              </div>
              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <button 
                  className="btn btn-light btn-lg shadow-sm fw-bold px-4 py-3 rounded-pill"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  disabled={events.length >= 5}
                  title={events.length >= 5 ? "Maximum 5 events allowed" : ""}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-5">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-calendar2-week fs-3 text-primary"></i>
              </div>
              <h3 className="fw-bold">{events.length}</h3>
              <p className="text-muted mb-0">Total Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-arrow-up-circle fs-3 text-success"></i>
              </div>
              <h3 className="fw-bold">{events.filter(e => new Date(e.date) >= new Date()).length}</h3>
              <p className="text-muted mb-0">Upcoming Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-geo-alt fs-3 text-info"></i>
              </div>
              <h3 className="fw-bold">
                {[...new Set(events.map(e => e.location))].length}
              </h3>
              <p className="text-muted mb-0">Unique Locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm border-0" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill fs-4 me-3"></i>
            <span className="fw-medium">{message}</span>
          </div>
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill mb-4" id="eventTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''} rounded-pill px-4 py-2`}
                onClick={() => setActiveTab('upcoming')}
              >
                <i className="bi bi-clock me-2"></i>
                Upcoming Events
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'past' ? 'active' : ''} rounded-pill px-4 py-2`}
                onClick={() => setActiveTab('past')}
              >
                <i className="bi bi-archive me-2"></i>
                Past Events
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'all' ? 'active' : ''} rounded-pill px-4 py-2`}
                onClick={() => setActiveTab('all')}
              >
                <i className="bi bi-list-ul me-2"></i>
                All Events
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-gradient-primary text-white py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-calendar-plus me-2"></i>
                    {editingId ? 'Update Event' : 'Create New Event'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-light rounded-circle"
                    onClick={resetForm}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="card-body p-4 p-lg-5">
                <form onSubmit={editingId ? handleUpdateEvent : handleAddEvent}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                          type="text"
                          className="form-control border-2 border-primary-subtle rounded-3"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Event Title"
                          required
                        />
                        <label className="text-muted">
                          <i className="bi bi-card-heading me-2"></i>
                          Event Title *
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                          type="text"
                          className="form-control border-2 border-primary-subtle rounded-3"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Location"
                          required
                        />
                        <label className="text-muted">
                          <i className="bi bi-geo-alt me-2"></i>
                          Location *
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                          type="datetime-local"
                          className="form-control border-2 border-primary-subtle rounded-3"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                        />
                        <label className="text-muted">
                          <i className="bi bi-calendar-date me-2"></i>
                          Date & Time *
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating">
                        <textarea 
                          className="form-control border-2 border-primary-subtle rounded-3"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Description"
                          style={{ height: '120px' }}
                          required
                        ></textarea>
                        <label className="text-muted">
                          <i className="bi bi-text-paragraph me-2"></i>
                          Description *
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-flex gap-3">
                        <button type="submit" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm">
                          <i className={`bi ${editingId ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                          {editingId ? 'Update Event' : 'Create Event'}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill"
                          onClick={resetForm}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Section */}
      {showDetails && selectedEvent && (
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-gradient-info text-white py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-info-circle me-2"></i>
                    Event Details
                  </h5>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-light rounded-circle"
                    onClick={closeDetails}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="card-body p-4 p-lg-5">
                <div className="row g-4">
                  <div className="col-md-8">
                    <div className="mb-4">
                      <h2 className="fw-bold text-primary">{selectedEvent.title}</h2>
                      <p className="lead text-muted">{selectedEvent.description}</p>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="card border-0 bg-light p-3 rounded-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                              <i className="bi bi-geo-alt fs-4 text-primary"></i>
                            </div>
                            <div>
                              <p className="text-muted small mb-0">Location</p>
                              <p className="fw-bold mb-0">{selectedEvent.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="card border-0 bg-light p-3 rounded-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                              <i className="bi bi-calendar-date fs-4 text-warning"></i>
                            </div>
                            <div>
                              <p className="text-muted small mb-0">Date & Time</p>
                              <p className="fw-bold mb-0">
                                {new Date(selectedEvent.date).toLocaleString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 text-center">
                      <div className="mb-3">
                        <img 
                          src={getIconUrl(selectedEvent.forecast_icon)} 
                          width={80} 
                          alt="Weather"
                          className="mb-3"
                        />
                      </div>
                      <h3 className="fw-bold text-primary mb-2">
                        {selectedEvent.forecast_temperature} °C
                      </h3>
                      <p className="text-muted mb-0">Forecasted Temperature</p>
                      <div className="mt-4 pt-3 border-top">
                        <small className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Weather forecast for event location
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex gap-3 pt-4 mt-2 border-top">
                      <button 
                        className="btn btn-warning btn-lg px-4 py-2 rounded-pill"
                        onClick={() => handleEditEvent(selectedEvent)}
                      >
                        <i className="bi bi-pencil-square me-2"></i>
                        Edit Event
                      </button>
                      <button 
                        className="btn btn-danger btn-lg px-4 py-2 rounded-pill"
                        onClick={() => {
                          handleDeleteEvent(selectedEvent.id || selectedEvent._id);
                          closeDetails();
                        }}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Delete Event
                      </button>
                      <button 
                        className="btn btn-outline-secondary btn-lg px-4 py-2 rounded-pill"
                        onClick={closeDetails}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5 my-5">
          <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your events...</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && filteredEvents.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredEvents.slice(0, 6).map((event) => {
            const isUpcoming = new Date(event.date) >= new Date();
            return (
              <div key={event.id || event._id} className="col">
                <div className={`card h-100 border-0 shadow-sm hover-shadow transition-all ${isUpcoming ? 'border-top border-4 border-primary' : 'border-top border-4 border-secondary'}`}
                     style={{ 
                       cursor: 'pointer',
                       transition: 'transform 0.3s, box-shadow 0.3s'
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)' }>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className={`badge ${isUpcoming ? 'bg-primary' : 'bg-secondary'} rounded-pill px-3 py-2 mb-2`}>
                          <i className={`bi ${isUpcoming ? 'bi-clock' : 'bi-check-circle'} me-1`}></i>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                        <h5 className="card-title fw-bold text-dark mb-1">{event.title}</h5>
                        <p className="text-muted small mb-3">
                          <i className="bi bi-calendar-event me-1"></i>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-end">
                        <div className="d-flex align-items-center justify-content-end mb-2">
                          <span className="fw-bold text-primary fs-5 me-2">
                            {event.forecast_temperature} °C
                          </span>
                          <img 
                            src={getIconUrl(event.forecast_icon)} 
                            width={40} 
                            alt="Weather"
                            className="rounded-circle bg-light p-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-muted small mb-1">
                        <i className="bi bi-geo-alt me-1"></i>
                        Location
                      </p>
                      <p className="fw-medium mb-0">{event.location}</p>
                    </div>

                    <p className="card-text text-muted">
                      {event.description.substring(0, 80)}
                      {event.description.length > 80 ? '...' : ''}
                    </p>
                  </div>
                  <div className="card-footer bg-white border-top-0 pt-0 pb-4 px-4">
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm flex-fill rounded-pill"
                        onClick={() => handleViewDetails(event)}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm rounded-circle"
                        onClick={() => handleEditEvent(event)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm rounded-circle"
                        onClick={() => handleDeleteEvent(event.id || event._id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
    </div>
  );
}