import React from 'react'
import './secretaryNavbar.css'
import SecretaryNavNotic from './SecretaryNavNotic'
import SecretaryNavmessage from './SecretaryNavmessage'

function SecretaryNavbar() {
  return (
    <div className='right-container'>
    <div className='nav-ul'>
        <SecretaryNavNotic />
        <SecretaryNavmessage />
    </div>
    </div>
  )
}

export default SecretaryNavbar
