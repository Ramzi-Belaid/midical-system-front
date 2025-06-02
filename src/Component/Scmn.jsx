import { useState, useEffect } from "react";
import axios from "axios";
import Totalpatients from "./Totalpatients";
import "./menu.css";
import RevenueSummaryChart from "./RevenueSummaryChart";
import TotalPatientsChart from "./TotalPatientsChart";

function Scmn() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("week");
  const [specialization, setSpecialization] = useState("ORL"); // التحكم في التخصص

  const token = localStorage.getItem("secretaryToken");

  useEffect(() => {
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(
        `http://localhost:3000/api/v1/User/Secratry/Dashbord?filter=${timeFrame}&type=patient&specialization=${specialization}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      });
  }, [timeFrame, specialization]); // تحديث عند تغيير التخصص أو الوقت

  return (
    <div className="menu-container">
      {/* قائمة اختيار التخصص */}
      <div className="dropdwon">
        
        <select
          id="specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="ORL">ORL</option>
          <option value="Ophthalmology">Ophthalmology</option>
        </select>
      </div>

      <div className="top-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <Totalpatients data={data} timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        )}

        <div className="dashboard-container">
          <div className="chart-box total-patients-chart">
            <TotalPatientsChart specialization={specialization} />
          </div>
          <div className="chart-box revenue-summary-chart">
            <RevenueSummaryChart specialization={specialization} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scmn;
