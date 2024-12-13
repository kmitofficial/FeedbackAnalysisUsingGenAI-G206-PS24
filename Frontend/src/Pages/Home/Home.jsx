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
import Dropnav from '../../Components/Dropnav/Dropnav'


const Home = () => {
    
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
            <div className={`${showLogin ? "cover" : ""}`}></div>  {/*this div is used for diabling pointer 
            events on website when login or signup components are shown */}

            <div id='home'>
                <div className="dnav">
                <Dropnav showDnav={showDnav} setShowDnav={setShowDnav}></Dropnav> {/*showDnav to show Dropnav in small devices setShoDnav for deciding wether to show Dropnav or Not */}
                </div>
                <Nav setShowLogin={setShowLogin} setShowDnav={setShowDnav}></Nav>
                {/** here same setShowLogin to show Login comp */}

                <Section1 ></Section1>
                <Section0></Section0>

                <Section2></Section2>
                <Section3 setShowSection4={setShowSection4} setReviews={setReviews} setLoading={setLoading}></Section3>
                 {/**setShowSection4 is to show Section4 visible ans setReviews to store summarry result of particular product */}

                {!showSection4 && <Section4 showReview={showReview} reviews={reviews} loading={loading} setLoading={setLoading}></Section4>}
                  {/*Section4 is visible only when ShowSection4 is true and ShowSection will be true when reviews result is got. */}

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
