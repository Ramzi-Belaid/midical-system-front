import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminDoctor.css";

function AdminDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    full_name: "",
    specialization: "",
    location: "",
    email: "",
    phone: "",
    experience: "",
    recommendation: "",
    patients: "",
    online_availability: false,
    services: [{ name: "", price: "" }],
  });
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/doctors/${id}`)
      .then(() => setDoctors(doctors.filter((doctor) => doctor.id !== id)))
      .catch((error) => console.error("Error deleting doctor:", error));
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/doctors", newDoctor)
      .then((response) => {
        setDoctors([...doctors, response.data]);
        setNewDoctor({
          full_name: "",
          specialization: "",
          location: "",
          email: "",
          phone: "",
          experience: "",
          recommendation: "",
          patients: "",
          online_availability: false,
          services: [{ name: "", price: "" }],
        });
        setIsOverlayOpen(false);
      })
      .catch((error) => console.error("Error adding doctor:", error));
  };

  const handleServiceChange = (index, key, value) => {
    const updatedServices = [...newDoctor.services];
    updatedServices[index][key] = value;
    setNewDoctor({ ...newDoctor, services: updatedServices });
  };

  const addServiceField = () => {
    setNewDoctor({ ...newDoctor, services: [...newDoctor.services, { name: "", price: "" }] });
  };

  return (
    <div className="admin-doctor-container">
      <div className="add-btn-container"><h5>Doctors Management:</h5><button className="add-btn" onClick={() => setIsOverlayOpen(true)}>Add Doctor</button></div>
      

      <table className="doctor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Location</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.full_name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.address}</td>
              <td>{doctor.email}</td>
              <td>{doctor.phone}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(doctor.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOverlayOpen && (
        <div className="overlay-container" onClick={() => setIsOverlayOpen(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Doctor</h2>
            <form onSubmit={handleAddDoctor} className="overlay-form">
              <input type="text" placeholder="Full Name" value={newDoctor.full_name} onChange={(e) => setNewDoctor({ ...newDoctor, full_name: e.target.value })} required />
              <input type="text" placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} required />
              <input type="text" placeholder="Location" value={newDoctor.location} onChange={(e) => setNewDoctor({ ...newDoctor, location: e.target.value })} required />
              <input type="email" placeholder="Email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} required />
              <input type="text" placeholder="Phone" value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} required />
              <input type="number" placeholder="Years of Experience" value={newDoctor.experience} onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })} required />
              <h6>Services end Prices</h6>
              {newDoctor.services.map((service, index) => (
                <div key={index}>
                  <input type="text" placeholder="Service Name" value={service.name} onChange={(e) => handleServiceChange(index, "name", e.target.value)} required />
                  <input type="number" placeholder="Price $" value={service.price} onChange={(e) => handleServiceChange(index, "price", e.target.value)} required />
                </div>
              ))}
              <button type="button" onClick={addServiceField}>+ Add Service</button>

              <button type="submit" className="overlay-button">Add Doctor</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDoctor;
