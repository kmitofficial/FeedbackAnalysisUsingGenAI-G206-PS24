import React from 'react';
import './Nav.css';
import { TiThMenu } from "react-icons/ti";
import { Link } from 'react-router-dom'
import { Logout } from '../../Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast'
import { FaRegCircleUser } from "react-icons/fa6";
const Nav = ({ setShowLogin, setShowDnav }) => {

  const token = useSelector((state) => state.auth.token); // Get token from Redux
  const dispatch = useDispatch();


  const handleLogout = () => {
    dispatch(Logout()); // Call the logout action
    localStorage.removeItem('token'); // Remove token from localStorage
    toast.success("Logged out Succesfully!")
  };

  return (
    <div className='navbar'>
      <span onClick={() => setShowDnav(true)}><TiThMenu /></span>
      <a href="#main">      <div className="logo"><img height={80} width={80} src="https://thumbs.dreamstime.com/b/fa-letter-logo-design-simple-modern-monogram-abstract-alphabet-vector-323515344.jpg" alt="" /></div>
      </a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>

      </ul>
      {
        token ? <div className='profile-icon' style={{ fontSize: '45px', paddingRight: '100px' }}><FaRegCircleUser />
          <div className="hover-div">
            <Link to='/profile'><p className='hover-div-p'>Profile</p></Link>
            <Link to='/dashboard'><p  className='hover-div-p'>Dashboard</p></Link>
            <Link to='/products'><p  className='hover-div-p'>Products</p></Link>
            <p  className='hover-div-p' onClick={handleLogout}>Logout</p>
          </div>
        </div>
          : <button onClick={() => setShowLogin(true)}>Login</button>

      }
    </div>
  );
};

export default Nav;
