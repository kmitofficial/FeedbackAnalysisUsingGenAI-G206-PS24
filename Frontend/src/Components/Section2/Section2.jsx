import React from 'react'
import './Section2.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChartBar, faComments, faGlobe } from '@fortawesome/free-solid-svg-icons';


const Section2 = () => {
    return (
       
            <section id="features">
                 <div className="container">
      <h1 className="title">
        Our Main Features
      </h1>
      <div className="features-grid">
        <div className="feature-item">
          {/* Replacing the i element with FontAwesomeIcon */}
          <FontAwesomeIcon icon={faSearch} style={{ color: 'white' }} className="icon" />
          <h2>Real-time Analysis</h2>
          <p>Get instant feedback analysis with accurate sentiment and review aggregation.</p>
        </div>

        <div className="feature-item">
          <FontAwesomeIcon icon={faChartBar} style={{ color: 'white' }} className="icon" />
          <h2>Data Visualization</h2>
          <p>Visualize feedback with beautiful charts and graphs for easier insights.</p>
        </div>

        <div className="feature-item">
          <FontAwesomeIcon icon={faComments} style={{ color: 'white' }} className="icon" />
          <h2>Key Phrase Extraction</h2>
          <p>Automatically extract the most important key phrases from any text to quickly summarize and gain insights.</p>
        </div>

        <div className="feature-item">
          <FontAwesomeIcon icon={faGlobe} style={{ color: 'white' }} className="icon" />
          <h2>Sentiment Analysis</h2>
          <p>Understand the sentiment behind customer reviews with cutting-edge AI models.</p>
        </div>
      </div>
    </div>
            </section>
       
    )
}

export default Section2
