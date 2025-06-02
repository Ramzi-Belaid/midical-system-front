import React from 'react'
import './navbar.css'
import NavNotic from './Navnotic'
import NavAvatar from './NavAvatar'

function Navbar() {
  return (
    <div className='right-container'>
    <div className='nav-ul'>
        <NavNotic />
        <NavAvatar />
    </div>
    </div>
  )
}

export default Navbar
