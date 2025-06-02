import { useState } from "react";
import { FaUsers, FaDollarSign } from "react-icons/fa6";
import { IoCalendar } from "react-icons/io5";
import { TbActivity } from "react-icons/tb";
import { MdOutlineTrendingUp } from "react-icons/md";
import { IoIosTrendingDown } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import "./totalpatients.css";

const iconMap = {
  totalPatients: { icon: <FaUsers className="icon icon-patients" />, label: "Total Patients" },
  appointments: { icon: <IoCalendar className="icon icon-appointments" />, label: "Appointments" },
  revenueSummary: { icon: <TbActivity className="icon icon-active " />, label: "Revenue Summary" },
  pendingPayments: { icon: <FaDollarSign className="icon icon-revenue" />, label: "Pending Payments" },
};



function Totalpatient({ data, timeFrame, setTimeFrame }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);

console.log("Received Data:", data);

  if (!data || typeof data !== "object") {
    return <p>No data available.</p>;
  }

  return (
    <div className="total-patients-container">
      <div className="line">
        <h2 className="title">Overview:</h2>

        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">
          {timeFrame.toUpperCase()} <FaChevronDown className="dropdown-icon" />
        </button>

        {dropdownOpen && (
          <div className="timee-Dropdown">
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

      {/* عرض الإحصائيات */}
      <div className="stats-grid">
        {Object.entries(data).map(([key, value]) => {
          const iconData = iconMap[key] || { icon: <TbActivity className="icon icon-default" />, label: key };

          const count = value?.count ?? value?.total ?? 0;
          const percentage = value?.percentageChange !== undefined ? parseFloat(value.percentageChange) : null;
          const trend = percentage !== null && percentage > 0 ? "up" : "down";

          return (
            <div className="stat-card" key={key}>
              <div className="title">
                {iconData.icon}
                <h3>{iconData.label} {timeFrame.toLowerCase()}</h3>
              </div>
              
              <div className="stats-row">
                <p className="rrr">{count}</p>
                {percentage !== null ? (
                  <p className={`trend ${trend === "up" ? "positive" : "negative"}`} >
                    {trend === "up" ? <MdOutlineTrendingUp className="trend-icon" /> : <IoIosTrendingDown className="trend-icon" />}
                    {percentage}%
                  </p>
                ) : (
                  <p className="trend no-data">No Change</p>
                )}
              </div>
                <p style={{ height:"10px", display:"flex", justifyContent:"center", alignItems:"center", padding:"0px"}}>
                  {timeFrame.toLowerCase() === "day" ? "Today" : `Last ${timeFrame.toLowerCase()}`}
                </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Totalpatient;
