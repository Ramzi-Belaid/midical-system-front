import React from 'react';

function SecretaryUserinfo() {
  const fullName = localStorage.getItem('fullName');

  return (
    <div className='Userinfo'>
      <h5 style={{ fontSize: "18px", color: "black" }}>Good Morning{fullName ? `, ${fullName}` : ''}!</h5>
      <span style={{ fontSize: "16px", color: "#555" }}>I hope you're in a good mood</span>
    </div>
  );
}

export default SecretaryUserinfo;
