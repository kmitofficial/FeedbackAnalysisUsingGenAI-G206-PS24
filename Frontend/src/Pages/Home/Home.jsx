import React, { useState } from 'react'
import './Home.css'

import Nav from '../../Components/Nav/Nav'
import Section0 from '../../Components/Section0/Section0'
import Section1 from '../../Components/Section1/Section1'
import Section2 from '../../Components/Section2/Section2'
import Section3 from '../../Components/Section3/Section3'
import Section4 from '../../Components/Section4/Section4'
import Section5 from '../../Components/Section5/Section5'
import Section6 from '../../Components/Section6/Section6'
import Section7 from '../../Components/Section7/Section7'
import Section8 from '../../Components/Section8/Section8'
import Login from '../../Components/Login/Login'
import Signup from '../../Components/Signup/Signup'
import { useOutletContext } from 'react-router-dom';
import Dropnav from '../../Components/Dropnav/Dropnav'


const Home = () => {
    const context = useOutletContext()
    console.log(context)
    const [loading, setLoading] = useState(true);

    const [showReview,setShowReview]=useState(false)
    const [showLogin,setShowLogin]=useState(false)
  const [showSignup,setShowSignup]=useState(false)
  const [showDnav,setShowDnav]=useState(false)
  const [reviews,setReviews]=useState('')
  const [showSection4, setShowSection4] = useState(false); // State to control Section3 visibility


console.log("home:",reviews)

    return (
        <>
            <div className={`${showLogin ? "cover" : ""}`}></div>

            <div id='home'>
                <div className="dnav">
                <Dropnav showDnav={showDnav} setShowDnav={setShowDnav}></Dropnav>
                </div>
                <Nav setShowLogin={setShowLogin} setShowDnav={setShowDnav}></Nav>

                <Section1 ></Section1>
                <Section0></Section0>

                <Section2></Section2>
                <Section3 setShowSection4={setShowSection4} setReviews={setReviews} setLoading={setLoading}></Section3>
                {showSection4 && <Section4 showReview={showReview} reviews={reviews} loading={loading} setLoading={setLoading}></Section4>}
                <Section6></Section6>
                <Section7></Section7>
                <Section5></Section5>

                <Section8></Section8>
                {
                    showLogin && <div className="login">
                        <Login setShowLogin={setShowLogin} setShowSignup={setShowSignup}></Login>
                    </div>

                }

                {
                     showSignup && <div className="login">
                     <Signup setShowLogin={setShowLogin} setShowSignup={setShowSignup}></Signup>
                    </div>
                }
            
            </div>
        </>
    )
}

export default Home
