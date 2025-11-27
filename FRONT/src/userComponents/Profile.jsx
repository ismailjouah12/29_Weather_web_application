import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Profile() {

 const  { user } = useUserContext();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    axiosClient.put('/user/profile', form)
      .then(({ data }) => {
        setUser(data.user);
        setEditMode(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      });

  };


  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>

      <h2 className="text-center mb-4 fw-bold text-primary">Your Profile</h2>

      <div className="card p-4 shadow-lg">

        {/* ---------- VIEW MODE ---------- */}
        {!editMode && (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Country:</strong> {user.country}</p>

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        )}

        {/* ---------- EDIT MODE ---------- */}
        {editMode && (
          <>
            <div className="mb-3">
              <label className="form-label fw-bold">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Country</label>
              <input
                type="text"
                name="country"
                className="form-control"
                value={form.country}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-3 mt-3">
              <button className="btn btn-success w-50" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary w-50"
                onClick={() => {
                  setForm(user);
                  setEditMode(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
