import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminSecretary.css";

function AdminSecretary() {
  const [secretaries, setSecretaries] = useState([]);
  const [newSecretary, setNewSecretary] = useState({
    full_name: "",
    email: "",
    phone: "",
    schedule: "",
  });
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/secretaries")
      .then((response) => setSecretaries(response.data))
      .catch((error) => console.error("Error fetching secretaries:", error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/secretaries/${id}`)
      .then(() => setSecretaries(secretaries.filter((sec) => sec.id !== id)))
      .catch((error) => console.error("Error deleting secretary:", error));
  };

  const handleAddSecretary = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/secretaries", newSecretary)
      .then((response) => {
        setSecretaries([...secretaries, response.data]);
        setNewSecretary({ full_name: "", email: "", phone: "", schedule: "" });
        setIsOverlayOpen(false);
      })
      .catch((error) => console.error("Error adding secretary:", error));
  };

  return (
    <div className="admin-secretary">
      <div className="add-btn-container">
      <h5>Secretaries Management</h5><button className="add-btn" onClick={() => setIsOverlayOpen(true)}>Add Secretary</button>
      </div>

      <table className="secretary-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {secretaries.map((sec) => (
            <tr key={sec.id}>
              <td>{sec.full_name}</td>
              <td>{sec.email}</td>
              <td>{sec.phone}</td>
              <td>{sec.schedule}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(sec.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOverlayOpen && (
        <div className="overlay-container" onClick={() => setIsOverlayOpen(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Secretary</h2>
            <form onSubmit={handleAddSecretary} className="overlay-form">
              <input type="text" placeholder="Full Name" value={newSecretary.full_name} onChange={(e) => setNewSecretary({ ...newSecretary, full_name: e.target.value })} required />
              <input type="email" placeholder="Email" value={newSecretary.email} onChange={(e) => setNewSecretary({ ...newSecretary, email: e.target.value })} required />
              <input type="text" placeholder="Phone" value={newSecretary.phone} onChange={(e) => setNewSecretary({ ...newSecretary, phone: e.target.value })} required />
              <input type="text" placeholder="Schedule" value={newSecretary.schedule} onChange={(e) => setNewSecretary({ ...newSecretary, schedule: e.target.value })} required />
              <button type="submit" className="overlay-button">Add Secretary</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSecretary;
