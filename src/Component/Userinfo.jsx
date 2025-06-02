import React from 'react';


function Userinfo() {
  const fullName = localStorage.getItem('fullName');

  return (
    <div className='Userinfo'>
      <h5 className="tata" style={{ fontSize: "18px", color: "black" }}>Good Morning{fullName ? `, ${fullName}` : ''}!</h5>
      <span style={{ fontSize: "16px", color: "#555" }}>I hope you're in a good mood</span>
    </div>
  );
}

export default Userinfo;
