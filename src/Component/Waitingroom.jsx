import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './waitingroom.css';
import { MdAirlineSeatLegroomReduced } from "react-icons/md";
import { LiaMaleSolid } from "react-icons/lia";
import { HiOutlineUsers } from "react-icons/hi";
import { LiaFemaleSolid } from "react-icons/lia";
import { MdOutlineChildFriendly } from "react-icons/md";



function Waitingroom() {
  const [salesData, setSalesData] = useState({});
  const [patients, setPatients] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [newSaleName, setNewSaleName] = useState('');
  const secretaryToken = localStorage.getItem('secretaryToken');

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/User/Secratry/getAllSale', {
        headers: { Authorization: `Bearer ${secretaryToken}` },
      });

      const groupedBySpec = {};
      response.data.allSale.forEach((sale) => {
        if (!groupedBySpec[sale.specialization]) {
          groupedBySpec[sale.specialization] = [];
        }
        groupedBySpec[sale.specialization].push(sale);
      });

      setSalesData(groupedBySpec);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/User/Secratry/getAllPatientsalle', {
        headers: { Authorization: `Bearer ${secretaryToken}` },
      });
      setPatients(response.data.allPatient);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchPatients();
  }, []);

  const handleAddSale = async () => {
    if (!newSaleName || !selectedSpec) return;

    try {
      await axios.post(
        'http://localhost:3000/api/v1/User/Secratry/addSale',
        {
          namesale: newSaleName,
          specialization: selectedSpec,
        },
        {
          headers: { Authorization: `Bearer ${secretaryToken}` },
        }
      );
      setNewSaleName('');
      fetchSales(); // reload after adding
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  const renderSales = () => {
    if (!selectedSpec) return null;
    const specSales = salesData[selectedSpec] || [];

    return (
      <>
        <div className="add-sale">
          <input
            type="text"
            placeholder="New Sale Name"
            value={newSaleName}
            onChange={(e) => setNewSaleName(e.target.value)}
          />
          <button onClick={handleAddSale}>Add Sale</button>
        </div>

        <div className="sales-container">
          {specSales.map((sale) => {
            const sallePatients = patients.filter(
              (p) => p.specialization === selectedSpec && p.salle === sale.namesale
            );

            const males = sallePatients.filter((p) => p.gender === 'Male').length;
            const females = sallePatients.filter((p) => p.gender === 'Female').length;
            const children = sallePatients.filter((p) => p.gender === 'Child').length;

            return (
              <div key={sale._id} className="sale-box">
  <h6 >{sale.namesale}:</h6>
  <div className="patient-info">
    <div className="info-box total">
      <HiOutlineUsers className="iconnn" />
      <p>Total: {sallePatients.length}</p>
    </div>
    <div className="info-box males">
      <LiaMaleSolid className="iconnn" />
      <p>Males: {males}</p>
    </div>
    <div className="info-box females">
      <LiaFemaleSolid className="iconnn" />
      <p>Females: {females}</p>
    </div>
    <div className="info-box children">
      <MdOutlineChildFriendly className="iconnn" />
      <p>Children: {children}</p>
    </div>
  </div>
</div>

            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="waitingroom">
      <h5>Choose a Specialization:</h5>
      <div className="specializations">
        {Object.keys(salesData).map((specName) => (
          <button  key={specName} onClick={() => setSelectedSpec(specName)}>
            <div className='specName'>{specName}</div><div className='spacecount'><MdAirlineSeatLegroomReduced className='iconn' />({salesData[specName].length} Rooms)</div>
          </button>
        ))}
      </div>

      {selectedSpec && <h5>{selectedSpec} Waiting Rooms:</h5>}
      {renderSales()}
    </div>
  );
}

export default Waitingroom;
