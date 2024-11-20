import React, { useState, useEffect } from "react";
import './Dashboard.css'; // Import the separate CSS file
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate=useNavigate()
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Storedtoken = JSON.parse(localStorage.getItem("token"));
  
  if(!Storedtoken)
  {
    navigate('/')
  }
  
  useEffect(() => {
    // Fetch feedback history when the component is mounted
    const fetchFeedbackHistory = async () => {
      try {
        if (!Storedtoken) {
          throw new Error("No authentication token found");
        }

        // API call with Authorization header
        const response = await axios.get("http://localhost:7000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${Storedtoken}`,
          },
        });
        setFeedbackHistory(response.data.userDetails.reviews); // Assuming the API response contains a 'history' array
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError("Failed to fetch feedback history");
        setLoading(false);
      }
    };

    fetchFeedbackHistory();
  }, [Storedtoken]); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="dashboard-container">
      {/* Left Div */}
      <div className="left-div">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',gap:'2rem' }}>
          <h2>No of Feedback Generated <br /> So Far</h2>
          <p className="value">{feedbackHistory.length}</p>
        </div>
      </div>

      {/* Right Div */}
      <div className="right-div">
        <h2>Feedback History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          
          <ul className="history-list">
            <div style={{padding:'10px',display:'flex',backgroundColor:'black'}}>
              <p style={{fontSize:'18px',fontWeight:'bold',color:'#02c9c9'}}>Feedback Id</p>
            </div>
            {feedbackHistory.map((z,i)=>{

              return <div className="history-uls" key={i}>
                   <p>{z}</p>
                   <Link to={`/dashboard/history/${z}`}><button>View Feedback</button></Link>
              </div>
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
