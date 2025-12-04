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

    axiosClient.put(`/events/${editingId}`, formData)
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
      axiosClient.delete(`/events/${eventId}`)
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
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="mb-1">My Events</h1>
          <p className="text-muted">Manage your upcoming events</p>
        </div>
        <div className="col-md-4 text-end">
          <button 
            className="btn btn-success btn-lg"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add New Event
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}



      {/* Form Section */}
      {showForm && (
        <div className="card shadow-lg mb-4 border-0">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{editingId ? 'Update Event' : 'Create New Event'}</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={editingId ? handleUpdateEvent : handleAddEvent}>
              <div className="mb-3">
                <label className="form-label fw-bold">Event Title *</label>
                <input 
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Location *</label>
                <input 
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Date *</label>
                <input 
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Description *</label>
                <textarea 
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  {editingId ? 'Update Event' : 'Create Event'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Section */}
      {showDetails && selectedEvent && (
        <div className="card shadow-lg mb-4 border-0">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Event Details</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={closeDetails}
            ></button>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small">Title</label>
                <p className="fw-bold fs-5">{selectedEvent.title}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small">Location</label>
                <p className="fw-bold fs-5">{selectedEvent.location}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small">Date & Time</label>
                <p className="fw-bold fs-5">
                  {new Date(selectedEvent.date).toLocaleString()}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label text-muted small">Description</label>
                <p className="fs-5">{selectedEvent.description}</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-warning"
                onClick={() => handleEditEvent(selectedEvent)}
              >
                Edit Event
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  handleDeleteEvent(selectedEvent.id || selectedEvent._id);
                  closeDetails();
                }}
              >
                Delete Event
              </button>
              <button 
                className="btn btn-secondary"
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Events List */}
      {!loading && events.length > 0 && (
        <div className="row">
          {events.map((event) => (
            <div key={event.id || event._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100 border-0 transition-all" style={{ cursor: 'pointer' }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{event.title}</h5>
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt"></i> {event.location}
                  </p>
                  <p className="card-text small">
                    <i className="bi bi-calendar-event"></i> {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="card-text">
                    {event.description.substring(0, 100)}
                    {event.description.length > 100 ? '...' : ''}
                  </p>
                </div>
                <div className="card-footer bg-white border-top pt-3 d-flex gap-2 justify-content-between">
                  <button 
                    className="btn btn-sm btn-info text-white flex-grow-1"
                    onClick={() => handleViewDetails(event)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEditEvent(event)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteEvent(event.id || event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#ccc' }}></i>
          </div>
          <h5 className="text-muted">No events yet</h5>
          <p className="text-muted mb-4">Create your first event to get started</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            Create First Event
          </button>
        </div>
      )}
    </div>
  );
}