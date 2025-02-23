import { FaUsers } from "react-icons/fa6";
import { IoCalendar } from "react-icons/io5";
import { TbActivity } from "react-icons/tb";
import { FaDollarSign } from "react-icons/fa6";
import { MdOutlineTrendingUp } from "react-icons/md";
import { IoIosTrendingDown } from "react-icons/io";
import Buttontime from "./Buttontime";
import "./totalpatients.css";

// أيقونات البطاقات
const iconMap = {
  FaUsers: { icon: <FaUsers className="icon icon-patients" />, class: "patients" },
  IoCalendar: { icon: <IoCalendar className="icon icon-appointments" />, class: "appointments" },
  TbActivity: { icon: <TbActivity className="icon icon-active" />, class: "active" },
  FaDollarSign: { icon: <FaDollarSign className="icon icon-revenue" />, class: "revenue" },
};

function Totalpatients({ patients, setPatients }) {
  // تحديث البطاقة عند تغيير الوقت
  const updateTimeFrame = (id, newTimeFrame) => {
    setPatients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, timeFrame: newTimeFrame } : item))
    );
  };

  return (
    <div className="total-patients-container">
      <h2 className="title">Overview:</h2>
      <div className="stats-grid">
        {patients.map((item) => {
          const iconData = iconMap[item.icon] || { icon: <FaUsers className="icon" />, class: "default" };

          return (
            <div className="stat-card" key={item.id}>
              <div className="title">
                {iconData.icon}
                <h3>{item.title}</h3>
                <Buttontime id={item.id} onUpdateTimeFrame={updateTimeFrame} />
              </div>

              <div className="stats-row">
                <p className="rrr">{item.value ?? 0}</p>
                <p className={`trend ${iconData.class}`}>
                  {item.trend === "up" ? <MdOutlineTrendingUp className="trend-icon" /> : <IoIosTrendingDown className="trend-icon" />}
                  {item.percentage}%
                </p>
              </div>

              {/* زر اختيار المدة الزمنية */}
              

              {/* الفترة الزمنية */}
              <p className="time-frame">{item.timeFrame}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Totalpatients;
