import React from 'react'
import './header.css'
 import Navbar from './Navbar'
 import Userinfo from './Userinfo'
 


function Header() {
  return (
    <header id="header" className="header">
      <Userinfo />
      <Navbar /> 
    </header>
  )
}

export default Header
