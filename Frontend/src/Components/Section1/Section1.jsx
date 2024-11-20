import React from 'react'
import './Section1.css'
import Caurosel from '../Caurosel/Caurosel'
const Section1 = () => {
  return (
    <div className='section1 '>
            <div className="landing-page" id='main'>
                <div className="first">
                    <h1>Feedback Analysis</h1>
                    <p>Hey there! Whether you're a product seller looking to improve your offerings or a product buyer wanting to make informed purchasing decisions, our Feedback Analysis Tool is here to help!</p>
                </div>

                {/* <div className="landing-img">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOxs9ph3SeMl-qRELyJGvswIDiVo-ZLSPRxg&s" alt="" />
         </div> */}

                <div className="second">
                    <p>Get your instant reviews!</p>
                    <a href="#url" className='button'>
                    <button ><p>start</p><span>&#8594;</span></button>
                    </a>
                </div> 
            </div>
            <Caurosel></Caurosel>

        </div>
  )
}

export default Section1
