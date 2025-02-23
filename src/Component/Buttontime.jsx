import React, { useState, useEffect } from "react";
import axios from "axios";
import "./buttontime.css";
import { IoIosArrowDown } from "react-icons/io";

function Buttontime({ id, onUpdateTimeFrame }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Day");

  const timeFrameMap = {
    Day: "Today",
    Week: "Last Week", // تم التغيير هنا
    Years: "Last Year",
  };
  

  const handleSelect = async (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    const newTimeFrame = timeFrameMap[option];

    try {
      // جلب البيانات الحالية
      const response = await axios.get(`http://localhost:5000/dashboardStats/${id}`);
      const existingData = response.data;

      // تحديث البيانات
      await axios.put(`http://localhost:5000/dashboardStats/${id}`, {
        ...existingData,
        timeFrame: newTimeFrame,
      });

      // تحديث الواجهة
      onUpdateTimeFrame(id, newTimeFrame);
    } catch (error) {
      console.error("Error updating timeFrame:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".timepicker-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="timepicker-container">
      <button className="timepicker-btn" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption} <IoIosArrowDown />
      </button>

      {isOpen && (
        <div className="timepicker-dropdown">
          {["Day", "Week", "Years"].map((option) => (
            <button key={option} onClick={() => handleSelect(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Buttontime;
