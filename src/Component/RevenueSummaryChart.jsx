import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import "./revenueSummaryChart.css";
import { FaSackDollar } from "react-icons/fa6";


function RevenueSummaryChart() {
  const [timeFrame, setTimeFrame] = useState("Years"); 
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/revenueData`);
        setData(response.data[timeFrame]); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h5> <FaSackDollar /> Revenue Summary</h5>

        {/* زر تحديد الإطار الزمني داخل h5 */}
        <div className="time-selector">
          <h5 
            className="time-selector-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {timeFrame} <FaChevronDown />
          </h5>

          {dropdownOpen && (
            <div className="time-Dropdowne">
              {["Day", "Week", "Years"].map((frame) => (
                <button 
                  key={frame} 
                  className={`time-option ${timeFrame === frame ? "active" : ""}`} 
                  onClick={() => {
                    setTimeFrame(frame);
                    setDropdownOpen(false);
                  }}
                >
                  {frame}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data}>
          <XAxis dataKey={timeFrame === "Day" ? "hour" : timeFrame === "Week" ? "day" : "month"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Income" stroke="#4CAF50" strokeWidth={2} />
          <Line type="monotone" dataKey="Expense" stroke="#f7b801" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueSummaryChart;
