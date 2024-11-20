import React from 'react'
import './Loader.css'

const Loader = () => {
  return (
    <div >
      <div className='loaderr' >
      <h1 style={{color:'whitesmoke'}}>Analyzing<span class="dots"><span>.</span><span>.</span><span>.</span></span></h1>

        <p >Please wait it may take few minutes</p>
      </div>
    </div>
  )
}

export default Loader
