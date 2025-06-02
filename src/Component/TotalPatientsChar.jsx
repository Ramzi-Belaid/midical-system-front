import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUsers } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import "./revenueSummaryChart.css";

function TotalPatientsChart() { 
  const [selectedTime, setSelectedTime] = useState("week");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/User/doctors/Dashbord/TotalPatient?filter=${selectedTime}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("doctorToken")}` },
          }
        );

        console.log("Fetched Data:", response.data); // ✅ تحقق من البيانات
        setData(response.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTime]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h5><FaUsers /> Total Patients</h5>

        <div className="dropdown-container">
          <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {selectedTime.toUpperCase()} <IoIosArrowDown />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu-patients">
              {["day", "week", "year"].map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setDropdownOpen(false);
                  }}
                  className={selectedTime === time ? "active" : ""}
                >
                  {time.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={data}>
            <XAxis dataKey="month" /> {/* ✅ تحديث dataKey ليطابق البيانات */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Male" fill="#007bff" />
            <Bar dataKey="Female" fill="#4CAF50" />
            <Bar dataKey="Child" fill="#f7b801" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default TotalPatientsChart;
