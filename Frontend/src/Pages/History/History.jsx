// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./History.css";
// import { useParams, useNavigate } from "react-router-dom";

// const History = () => {
//   const { id } = useParams();
//   const [historyData, setHistoryData] = useState(null);
//   const storedToken = JSON.parse(localStorage.getItem("token"));
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!storedToken) {
//       // Redirect if there's no token
//       navigate("/");
//       return;
//     }

//     if (!id) {
//       // Redirect if the id is missing
//       navigate("/error");
//       return;
//     }

//     const fetchHistory = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:7000/api/users/getuserhistory/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${storedToken}`,
//             },
//           }
//         );
//         setHistoryData(response.data.data);
//         console.log("feed:", response.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     // Fetch history if id and token are available
//     fetchHistory();
//   }, [id, storedToken, navigate]);

//   // Ensure historyData is defined before destructuring
//   const {
//     summary = "No summary available",
//     keywords: { positive_keywords = [], negative_keywords = [] } = {},
//     sentiments: { Positive = 0, Negative = 0, Nuetral = 0 } = {},
//     avgRating
//   } = historyData || {}; // Provide default values if historyData is null

//   return (
//     <div style={{ minHeight: "82.5vh",padding:'20px' }}>
//       {historyData ? (
//         <>
//           <div className="section4-summary">
//             <h3>Summary</h3>
//             <p>{summary}</p>
//           </div>

//           <div className="section4-details">
//             <div className="section4-sentiments">
//               <h3>Positives Neutral Negatives</h3>
//               <div className="sentiment-box-wrapper">
//                 <div className="sentiment-box positive">
//                   <span>{(Positive/(Positive+Negative+Nuetral))*100 }%</span>
//                 </div>
//                 <div className="sentiment-box neutral">
//                   <span>{(Nuetral/(Positive+Negative+Nuetral))*100 }%</span>
//                 </div>
//                 <div className="sentiment-box negative">
//                   <span>{(Negative/(Positive+Negative+Nuetral))*100 }%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="section4-pros-cons">
//               <div className="pros">
//                 <h3>Pros</h3>
//                 {positive_keywords.length > 0
//                   ? positive_keywords.map((keyword, index) => (
//                       <span key={index} className="keyword-item">
//                         {keyword}
//                       </span>
//                     ))
//                   : "No pros available"}
//               </div>

//               <div className="cons">
//                 <h3>Cons</h3>
//                 {negative_keywords.length > 0
//                   ? negative_keywords.map((keyword, index) => (
//                       <span key={index} className="keyword-item">
//                         {keyword}
//                       </span>
//                     ))
//                   : "No cons available"}
//               </div>
//             </div>
//           </div>

//           <div className="section4-rating">
//             <h3>Average Rating</h3>
//             <div className="rating-value">
//               <span>{avgRating} / 5</span>
//             </div>
//           </div>
//         </>
//       ) : (
//         <p >Loading...</p>
//       )}
//     </div>
//   );
// };

// export default History;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import "./History.css";

const History = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState(null);
  const storedToken = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (!storedToken) {
      navigate("/");
      return;
    }

    if (!id) {
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
      } catch (err) {
        console.error("Error fetching history:", err);
        navigate("/error");
      }
    };

    fetchHistory();
  }, [id, storedToken, navigate]);

  if (!historyData) {
    return <p>Loading...</p>;
  }

  const {
    summary,
    keywords: { positive_keywords = [], negative_keywords = [] } = {},
    sentiments: { Positive = 0, Negative = 0, Nuetral = 0 } = {},
    avgRating,
  } = historyData;

  // Total sentiments for calculating percentages
  const totalSentiments = Positive + Negative + Nuetral || 1; // Prevent division by zero

  // Preparing data for Recharts
  const sentimentData = [
    { name: "Positive", value: (Positive / totalSentiments) * 100 },
    { name: "Neutral", value: (Nuetral / totalSentiments) * 100 },
    { name: "Negative", value: (Negative / totalSentiments) * 100 },
  ];

  // Donut Chart Colors
  const COLORS = ["#4caf50", "#ffc107", "#f44336"]; // Green, Yellow, Red

  return (
    <div className="history-container">
      {/* Summary Section */}
      <div className="history-summary">
        <h3>Summary</h3>
        <p>{summary || "No summary available"}</p>
      </div>

      <div className="middle-divv">

        {/* Donut Chart Section */}
        <div className="history-sentiments">
          <h3>Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60} // Inner radius for the hole
                fill="#8884d8"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                itemStyle={{
                  color: "white", // White text color
                }}
                formatter={(value, name) => [`${value.toFixed(2)}%`, name]} // Format percentage
                cursor={{ fill: "rgba(255, 255, 255, 0.2)" }} // Slightly visible cursor
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pros and Cons Section */}
        <div className="history-pros-cons">
          <div className="pros">
            <h3>Pros</h3>
            {positive_keywords.length > 0 ? (
              positive_keywords.map((keyword, index) => (
                <span key={index} className="keyword-item green-text">
                  {keyword}
                </span>
              ))
            ) : (
              <p>No pros available</p>
            )}
          </div>

          <div className="cons">
            <h3>Cons</h3>
            {negative_keywords.length > 0 ? (
              negative_keywords.map((keyword, index) => (
                <span key={index} className="keyword-item red-text">
                  {keyword}
                </span>
              ))
            ) : (
              <p>No cons available</p>
            )}
          </div>
        </div>
      </div>

      {/* Average Rating Section */}
      <div className="history-rating">
        <h3>Average Rating</h3>
        <div className="rating-value">
          <span>{avgRating ? avgRating.toFixed(2) : "N/A"} / 5</span>
        </div>
      </div>
    </div>
  );
};

export default History;
