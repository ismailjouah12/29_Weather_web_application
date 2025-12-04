import React, { useState } from "react";
import { useUserContext } from "../UserContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';




function AboutUs() {

  const {user} = useUserContext();

  const [formData, setFormData] = useState({
    fullname: user.name,
    email: user.email,
    title: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending...", formData);

    // ---- TODO: send to your backend email route ----
    // axios.post("/send-feedback", formData)

    alert("Thank you! Your feedback has been sent.");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-3 text-center">Contact us</h3>

      <form onSubmit={handleSubmit} className="card card-body p-4 border rounded-3 shadow-lg bg-secondary">

        {/* Fullname */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="fullname"
            value={formData.fullname}
           // onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            //onChange={handleChange}
            required
          />
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Message */}
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Send Feedback
        </button>
      </form>
    </div>
  );
}




export default function About() {
const {token} = useUserContext();



  return (
  <div>
    <div className="container card card-body bg-white m-5 p-4 rounded shadow">
      <h2>About WeatherApp</h2>
      <p>
        WeatherApp is a simple and intuitive application that provides users with accurate and up-to-date weather information for locations around the world. Whether you're planning your day or preparing for a trip, WeatherApp has you covered.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Current weather conditions including temperature, humidity, and wind speed.</li>
        <li>7-day weather forecasts to help you plan ahead.</li>
        <li>Search functionality to find weather information for any city.</li>
        <li>User profiles to save favorite locations and view search history.</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>
        WeatherApp is built using modern web technologies including React for the frontend, Bootstrap for styling, and Axios for API requests. The application fetches data from reliable weather APIs to ensure accuracy.
      </p>
      <h3>Contact</h3>
      <p>
        For any questions or feedback, please contact us at <a>exmple@gmail.com</a> <p> We hope you enjoy using WeatherApp!</p> </p>
    </div>
    {token ? 
    <AboutUs/> : <p className="alert alert-info">login in order to contact us</p>
    }
  </div>
  );
}