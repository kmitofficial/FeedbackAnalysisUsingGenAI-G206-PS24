import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css";
import { useParams, useNavigate } from "react-router-dom";

const History = () => {
  const { id } = useParams();
  const [historyData, setHistoryData] = useState(null);
  const storedToken = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!storedToken) {
      // Redirect if there's no token
      navigate("/");
      return;
    }

    if (!id) {
      // Redirect if the id is missing
      navigate("/error");
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/getuserhistory/${id}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setHistoryData(response.data.data);
        console.log("feed:", response.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Fetch history if id and token are available
    fetchHistory();
  }, [id, storedToken, navigate]);

  // Ensure historyData is defined before destructuring
  const {
    summary = "No summary available",
    keywords: { positive_keywords = [], negative_keywords = [] } = {},
    sentiments: { Positive = 0, Negative = 0, Nuetral = 0 } = {},
    avgRating
  } = historyData || {}; // Provide default values if historyData is null

  return (
    <div style={{ minHeight: "82.5vh",padding:'20px' }}>
      {historyData ? (
        <>
          <div className="section4-summary">
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>

          <div className="section4-details">
            <div className="section4-sentiments">
              <h3>Positives Neutral Negatives</h3>
              <div className="sentiment-box-wrapper">
                <div className="sentiment-box positive">
                  <span>{(Positive/(Positive+Negative+Nuetral))*100 }%</span>
                </div>
                <div className="sentiment-box neutral">
                  <span>{(Nuetral/(Positive+Negative+Nuetral))*100 }%</span>
                </div>
                <div className="sentiment-box negative">
                  <span>{(Negative/(Positive+Negative+Nuetral))*100 }%</span>
                </div>
              </div>
            </div>

            <div className="section4-pros-cons">
              <div className="pros">
                <h3>Pros</h3>
                {positive_keywords.length > 0
                  ? positive_keywords.map((keyword, index) => (
                      <span key={index} className="keyword-item">
                        {keyword}
                      </span>
                    ))
                  : "No pros available"}
              </div>

              <div className="cons">
                <h3>Cons</h3>
                {negative_keywords.length > 0
                  ? negative_keywords.map((keyword, index) => (
                      <span key={index} className="keyword-item">
                        {keyword}
                      </span>
                    ))
                  : "No cons available"}
              </div>
            </div>
          </div>

          <div className="section4-rating">
            <h3>Average Rating</h3>
            <div className="rating-value">
              <span>{avgRating} / 5</span>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default History;
