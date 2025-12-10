import React, { useState } from "react";
import { useUserContext } from "../UserContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function AboutUs() {
  const { user } = useUserContext();
  const [formData, setFormData] = useState({
    fullname: user.name,
    email: user.email,
    title: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Sending...", formData);
      
      // when the backend is set
      // axios.post("/send-feedback", formData)
      
      setSubmitStatus('success');
      setIsSubmitting(false);
      
      // Reset form but keep user data
      setFormData({
        ...formData,
        title: "",
        message: ""
      });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1000);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <div className="position-relative d-inline-block mb-4">
              <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-headset text-white fs-2"></i>
              </div>
            </div>
            <h1 className="fw-bold mb-3  text-primary">Get in Touch</h1>
            <p className=" lead mb-0 text-primary">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm border-0 mb-4" role="alert">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill fs-4 me-3"></i>
                <div>
                  <h6 className="fw-bold mb-1">Thank you for your feedback!</h6>
                  <p className="mb-0">Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={() => setSubmitStatus(null)}></button>
            </div>
          )}

          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-gradient-primary text-white py-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-chat-left-text fs-3 me-3"></i>
                <div>
                  <h4 className="fw-bold mb-0">Send Us Feedback</h4>
                  <p className="mb-0 opacity-75">We value your input to improve our service</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-lg-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Fullname */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-2 border-primary-subtle rounded-3"
                        name="fullname"
                        value={formData.fullname}
                        readOnly
                        id="fullname"
                      />
                      <label htmlFor="fullname" className="text-muted">
                        <i className="bi bi-person me-2"></i>
                        Full Name
                      </label>
                    </div>
                    <div className="form-text text-muted mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Pre-filled from your profile
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control border-2 border-primary-subtle rounded-3"
                        name="email"
                        value={formData.email}
                        readOnly
                        id="email"
                      />
                      <label htmlFor="email" className="text-muted">
                        <i className="bi bi-envelope me-2"></i>
                        Email Address
                      </label>
                    </div>
                    <div className="form-text text-muted mt-2">
                      <i className="bi bi-check-circle text-success me-1"></i>
                      Verified email
                    </div>
                  </div>

                  {/* Title */}
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-2 border-primary-subtle rounded-3"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Feedback Title"
                        required
                        id="title"
                      />
                      <label htmlFor="title" className="text-muted">
                        <i className="bi bi-card-heading me-2"></i>
                        Subject
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control border-2 border-primary-subtle rounded-3"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..."
                        rows="6"
                        required
                        id="message"
                        style={{ height: '150px' }}
                      />
                      <label htmlFor="message" className="text-muted">
                        <i className="bi bi-chat-dots me-2"></i>
                        Your Message
                      </label>
                    </div>
                    <div className="form-text text-muted mt-2">
                      <i className="bi bi-lightbulb me-1"></i>
                      Please provide detailed feedback to help us improve
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 py-3 rounded-pill shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Sending Your Feedback...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Send Feedback
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { token } = useUserContext();

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="p-5 rounded-4 shadow-sm border-0 mb-4" 
               style={{ 
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 position: 'relative',
                 overflow: 'hidden'
               }}>
            <div className="position-absolute top-0 end-0 opacity-25">
              <i className="bi bi-cloud-sun-fill text-white" style={{ fontSize: '10rem' }}></i>
            </div>
            <div className="position-relative z-1">
              <h1 className="display-4 fw-bold text-white mb-3">
                About WeatherApp
              </h1>
              <p className="lead text-white mb-4" style={{ maxWidth: '600px' }}>
                Your reliable companion for weather forecasting, planning, and staying prepared.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
                  <i className="bi bi-check-circle me-1"></i>
                  Accurate Forecasts
                </span>
                <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
                  <i className="bi bi-check-circle me-1"></i>
                  Real-time Updates
                </span>
                <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
                  <i className="bi bi-check-circle me-1"></i>
                  User-Friendly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
     
        <div className="container-fluid">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
            <div className="container-fluid card-body p-4 p-lg-5">
              <h2 className="fw-bold text-dark mb-4">
                <i className="bi bi-info-circle text-primary me-3"></i>
                Our Mission
              </h2>
              <p className="lead text-muted mb-4">
                WeatherApp is designed to provide users with accurate, up-to-date weather information 
                for locations around the world. Whether you're planning your day or preparing for a trip, 
                we make sure you're always prepared for what's coming.
              </p>

              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-cloud-sun fs-3 text-primary"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Real-time Weather Data</h5>
                      <p className="text-muted mb-0">
                        Get current conditions including temperature, humidity, wind speed, and precipitation.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <i className="bi bi-calendar-week fs-3 text-success"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">7-Day Forecast</h5>
                      <p className="text-muted mb-0">
                        Plan ahead with detailed 7-day forecasts and hourly breakdowns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="fw-bold text-dark mb-4">

                Key Features
              </h3>
              <div className="row g-4 mb-5">
                {[
                  { icon: 'bi-search', title: 'Global Search', desc: 'Find weather for any city worldwide' },
                  { icon: 'bi-heart', title: 'Favorites', desc: 'Save and access your favorite locations quickly' },
                  { icon: 'bi-clock-history', title: 'History', desc: 'View your search history for easy access' },
                  { icon: 'bi bi-calendar-event', title: 'Events', desc: 'Create eventes and get weather infos' },
                ].map((feature, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle bg-white p-2 me-3 shadow-sm">
                            <i className={`bi ${feature.icon} text-primary`}></i>
                          </div>
                          <h5 className="fw-bold mb-0">{feature.title}</h5>
                        </div>
                        <p className="text-muted mb-0">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="fw-bold text-dark mb-4">
                <i className="bi bi-cpu text-info me-3"></i>
                Technologies
              </h3>
              <p className="text-muted mb-4">
                WeatherApp is built using modern web technologies including React for the frontend, 
                Bootstrap for responsive styling, and Axios for API requests. We integrate with reliable 
                weather data providers to ensure accuracy and reliability.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  <i className="bi bi-react me-1"></i>
                  React
                </span>
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                  <i className="bi bi-bootstrap me-1"></i>
                  Bootstrap
                </span>
                <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2">
                  <i className="bi bi-lightning me-1"></i>
                  Axios
                </span>
                <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                  <i className="bi bi-cloud-arrow-up me-1"></i>
                  Laravel
                </span>
              </div>
            </div>
          </div>
        </div>
   
      {/* Conditional Contact Form */}
      {token ? (
        <AboutUs />
      ) : (
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-5 text-center">
                <div className="mb-4">
                  <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-person-check fs-2 text-info"></i>
                  </div>
                  <h4 className="fw-bold text-dark mb-3">Want to Contact Us?</h4>
                  <p className="text-muted mb-4">
                    Please log in to access our contact form and send us your feedback, questions, or suggestions.
                  </p>
                  <a href="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Log In to Continue
                  </a>
                </div>
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
`;

