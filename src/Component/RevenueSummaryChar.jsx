import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import "./revenueSummaryChart.css";

function RevenueSummaryChart({ specialization }) {
  const [timeFrame, setTimeFrame] = useState("week");
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/User/doctors/Dashbord/RevenueSummary?filter=${timeFrame}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("doctorToken")}` },
          }
        );

        console.log("Fetched Data:", response.data);

        if (Array.isArray(response.data.revenueData) && response.data.revenueData.length > 0) {
          setData(response.data.revenueData);
        } else {
          setData([]); // تجنب وضع `null` أو `undefined`
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  // تحديد مفتاح X بناءً على الإطار الزمني
  const xAxisKey = "day"; // البيانات المتوفرة حاليًا تحتوي على "day" فقط

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h5>
          <FaSackDollar /> Revenue Summary
        </h5>

        <div className="time-selector">
          <h5 className="time-selector-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {timeFrame.toUpperCase()} <FaChevronDown />
          </h5>

          {dropdownOpen && (
            <div className="time-Dropdowne">
              {["day", "week", "year"].map((frame) => (
                <button
                  key={frame}
                  className={`time-option ${timeFrame === frame ? "active" : ""}`}
                  onClick={() => {
                    setTimeFrame(frame);
                    setDropdownOpen(false);
                  }}
                >
                  {frame.toUpperCase()}
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
          <LineChart data={data} key={timeFrame}> {/* 🔥 إجبار إعادة التصيير عند تغيير الفلتر */}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Income" stroke="#4CAF50" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default RevenueSummaryChart;
