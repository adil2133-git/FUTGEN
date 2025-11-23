import React from 'react'
import { NavLink } from 'react-router-dom'

function Navlink() {
  return (
    <div>
            <NavLink to={'/'}></NavLink>
            <NavLink to={'login'}></NavLink>
            <NavLink to={'signup'}></NavLink>
            <NavLink to={'product'}></NavLink>
            <NavLink to={'cart'}></NavLink>
            <NavLink to={'checkout'}></NavLink>
            <NavLink to={'categories'}></NavLink>
            <NavLink to={'category'}></NavLink>
            <NavLink to={'about'}></NavLink>
            <NavLink to={'contact'}></NavLink>  
    </div>
  )
}

export default Navlink