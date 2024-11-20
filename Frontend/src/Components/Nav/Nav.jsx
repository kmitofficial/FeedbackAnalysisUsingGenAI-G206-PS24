import React from 'react';
import './Nav.css';
import { TiThMenu } from "react-icons/ti";
import {Link} from 'react-router-dom'
import { Logout } from '../../Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-hot-toast'
import { FaRegCircleUser } from "react-icons/fa6";
const Nav = ({setShowLogin,setShowDnav}) => {

  const token = useSelector((state) => state.auth.token); // Get token from Redux
  const dispatch = useDispatch();

  
  const handleLogout = () => {
    dispatch(Logout()); // Call the logout action
    localStorage.removeItem('token'); // Remove token from localStorage
    toast.success("Logged out Succesfully!")
  };

  return (
    <div className='navbar'>
      <span onClick={()=>setShowDnav(true)}><TiThMenu /></span>
         <a href="#main">      <div className="logo">LOGO</div>
         </a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>

      </ul>
      {
        token ? <div className='profile-icon' style={{ fontSize: '45px',paddingRight:'100px'}}><FaRegCircleUser/>
        <div className="hover-div">
        <Link to='/profile'><p>Profile</p></Link>
       <Link to='/dashboard'><p>Dashboard</p></Link>
        <p style={{cursor:'pointer'}} onClick={handleLogout}>Logout</p>
       </div>
        </div>:<button onClick={()=>setShowLogin(true)}>Login</button>

      }
    </div>
  );
};

export default Nav;
