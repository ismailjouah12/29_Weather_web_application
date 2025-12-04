import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Profile() {
  const { user,setUser,token, setToken, activePage, setActivePage } = useUserContext();

  const [editingField, setEditingField] = useState(null); 
  const [value, setValue] = useState("");

  const startEditing = (field) => {
    setEditingField(field);
    setValue(field === "password" ? "" : user[field]);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setValue("");
  };

  const saveField = () => {
  let endpoint = "";
  let payload = {};

  if (editingField === "name") {
    endpoint = "/profile/name";
    payload = { new_name: value }; // assuming name endpoint expects "name"
  } else if (editingField === "email") {
    endpoint = "/profile/email";
    payload = { new_email: value }; // match Laravel validation
  } else if (editingField === "password") {
    endpoint = "/profile/password";
    payload = {
      new_password: value,
      new_password_confirmation: value // required for 'confirmed' validation
    };
  }

  axiosClient
    .put(endpoint, payload)
    .then(({ data }) => {
      setUser(data.user);
      cancelEditing();
    })
    .catch((err) => {
      if (err.response && err.response.data.errors) {
        console.error("Validation errors:", err.response.data.errors);
      } else {
        console.error("Error updating profile:", err);
      }
    });
};



  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4 fw-bold text-dark">Profile</h2>

      <div className="card p-4 shadow-lg">

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label fw-bold">Name</label>
          {editingField === "name" ? (
            <>
              <input
                type="text"
                className="form-control"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="mt-2 d-flex gap-2">
                <button className="btn btn-success w-50" onClick={saveField}>Save</button>
                <button className="btn btn-secondary w-50" onClick={cancelEditing}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p>{user?.name}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={() => startEditing("name")}>
                Change
              </button>
            </>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label fw-bold">Email</label>
          {editingField === "email" ? (
            <>
              <input
                type="email"
                className="form-control"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="mt-2 d-flex gap-2">
                <button className="btn btn-success w-50" onClick={saveField}>Save</button>
                <button className="btn btn-secondary w-50" onClick={cancelEditing}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p>{user?.email}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={() => startEditing("email")}>
                Change
              </button>
            </>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label fw-bold">Password</label>
          {editingField === "password" ? (
            <>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="mt-2 d-flex gap-2">
                <button className="btn btn-success w-50" onClick={saveField}>Save</button>
                <button className="btn btn-secondary w-50" onClick={cancelEditing}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p>*********</p>
              <button className="btn btn-outline-primary btn-sm" onClick={() => startEditing("password")}>
                Change
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
