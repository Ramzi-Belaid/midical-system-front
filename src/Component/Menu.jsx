import { useState, useEffect } from "react";
import axios from "axios";
import Totalpatients from "./Totalpatients";
import "./menu.css";
import RevenueSummaryChart from "./RevenueSummaryChart";
import TotalPatientsChart from "./TotalPatientsChart";

function Menu() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/dashboardStats")
      .then(res => setPatients(res.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="menu-container">
      <div className="top-container">
        <Totalpatients patients={patients} setPatients={setPatients} />
        <div className="dashboard-container">
        <div className="chart-box total-patients-chart">
        <TotalPatientsChart />
        </div>
        <div className="chart-box revenue-summary-chart">
        <RevenueSummaryChart />
        </div>
        </div>
        
      </div>
      </div>
  );
}

export default Menu;
