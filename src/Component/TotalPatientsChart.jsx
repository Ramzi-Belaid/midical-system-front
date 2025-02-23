import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUsers } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import "./revenueSummaryChart.css";

function TotalPatientsChart() {
  const [selectedTime, setSelectedTime] = useState("Day");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/patientsData");
        setData(response.data[selectedTime]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedTime]);

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setDropdownOpen(false);
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h5><FaUsers /> Total Patients</h5>

        {/* زر اختيار الفترات الزمنية */}
        <div className="dropdown-container">
          <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {selectedTime} <IoIosArrowDown />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu-patients">
              <button onClick={() => handleSelectTime("Day")} className={selectedTime === "Day" ? "active" : ""}>Day</button>
              <button onClick={() => handleSelectTime("Week")} className={selectedTime === "Week" ? "active" : ""}>Week</button>
              <button onClick={() => handleSelectTime("Years")} className={selectedTime === "Years" ? "active" : ""}>Years</button>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data}>
          <XAxis dataKey={selectedTime === "Day" ? "hour" : selectedTime === "Week" ? "day" : "month"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Male" fill="#007bff" />
          <Bar dataKey="Female" fill="#4CAF50" />
          <Bar dataKey="Child" fill="#f7b801" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TotalPatientsChart;
