import './addmedicine.css'
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Addmedicine() {
    const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a drug name");

    axios.post("http://localhost:5000/drugs", { name, dosage })
      .then(() => {
        alert("Drug added successfully!");
        navigate("/prescription"); // الانتقال إلى صفحة الوصفة بعد الإضافة
      })
      .catch(() => alert("Error adding drug"));
  };
  return (
    
    <div className='Addmedicine'>
        <h5 className='h5'>Add New Drug :</h5>
      <form  className='Form'onSubmit={handleSubmit}>
        <label className='Label'>Drug Name:</label>
        <input className='Inp' type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <label className='Label'>Dosage (optional):</label>
        <input className='Inp' type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} />
        
        <button type="submit" className='btnn'>Add Drug</button>
      </form>
        <button className='btnn' onClick={() => navigate("/prescription")}>Back to Prescription</button>
    </div>
  )
}

export default Addmedicine