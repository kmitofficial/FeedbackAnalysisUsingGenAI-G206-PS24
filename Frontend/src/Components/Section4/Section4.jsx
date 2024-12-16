// import React, { useEffect } from 'react';
// import './Section4.css';
// import Loader from '../Loader/Loader';
// import { useSelector, useDispatch } from 'react-redux';
// import { setLoading } from '../../Slices/authSlice';
// import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';

// const Section4 = ({ reviews }) => {
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (reviews && reviews.get_reviews) {
//       dispatch(setLoading(false)); // Once reviews are available, set loading to false
//     }
//   }, [reviews]);

//   const {
//     summary,
//     keywords: { positive_keywords, negative_keywords } = {}, // Default empty object if undefined
//     sentiments: { Positive = 0, Negative = 0, Nuetral = 0 } = {}, // Default empty object if undefined
//     get_reviews: { avgRating } = {},
//   } = reviews;

//   // Total sentiments for calculating percentages
//   const totalSentiments = Positive + Negative + Nuetral;

//   // Preparing data for Recharts
//   const sentimentData = [
//     { name: 'Positive', value: (Positive / totalSentiments) * 100 },
//     { name: 'Neutral', value: (Nuetral / totalSentiments) * 100 },
//     { name: 'Negative', value: (Negative / totalSentiments) * 100 },
//   ];

//   return (
//     <div id="review" className="section4-container">
//       {loading ? (
//         <Loader />
//       ) : (
//         <div className="section4-content">
//           <div className="section4-summary">
//             <h3>Summary</h3>
//             <p>{summary || 'No summary available'}</p>
//           </div>

//           <div className="section4-details">
//             <div className="section4-sentiments">
//               <h3>Sentiment Analysis</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={sentimentData} barSize={50}>
//                   <XAxis dataKey="name" stroke="#8884d8" />
//                   <YAxis tickFormatter={(value) => `${value}%`} />
//                   <Tooltip contentStyle={{
//                     backgroundColor: 'transparent', // Transparent background
//                     border: 'none', // No border
//                     boxShadow: 'none', // No shadow

//                   }}
//                     cursor={{ fill: 'white' }} />
//                   <Legend />
//                   <Bar dataKey="value" label={{ position: 'top', formatter: (value) => `${value.toFixed(2)}%` }}>
//                     <Cell fill="#4caf50" /> {/* Green for Positive */}
//                     <Cell fill="#ffc107" /> {/* Yellow for Neutral */}
//                     <Cell fill="#f44336" /> {/* Red for Negative */}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="section4-pros-cons">
//               <div className="pros">
//                 <h3>Pros</h3>
//                 {positive_keywords?.map((keyword, index) => (
//                   <span key={index} className="keyword-item">
//                     {keyword}
//                   </span>
//                 )) || 'No pros available'}
//               </div>

//               <div className="cons">
//                 <h3>Cons</h3>
//                 {negative_keywords?.map((keyword, index) => (
//                   <span key={index} className="keyword-item">
//                     {keyword}
//                   </span>
//                 )) || 'No cons available'}
//               </div>
//             </div>
//           </div>

//           <div className="section4-rating">
//             <h3>Average Rating</h3>
//             <div className="rating-value">
//               <span>
//                 {avgRating
//                   ? Number(avgRating).toFixed(2)
//                   : (
//                     reviews.get_reviews.rating.reduce(
//                       (acc, curr) => acc + curr,
//                       0
//                     ) / reviews.get_reviews.rating.length
//                   ).toFixed(2)}
//                 / 5
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Section4;


import React, { useEffect, useState } from 'react';
import './Section4.css';
import Loader from '../Loader/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../Slices/authSlice';
import MCQQuiz from '../McqQuiz/McqQuiz';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const Section4 = ({ reviews }) => {
  const [showQuiz, setShowQuiz] = useState(false)
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (reviews && reviews.get_reviews) {
      dispatch(setLoading(false)); // Once reviews are available, set loading to false
    }
  }, [reviews]);

  const {
    summary,
    keywords: { positive_keywords, negative_keywords } = {}, // Default empty object if undefined
    sentiments: { Positive = 0, Negative = 0, Nuetral = 0 } = {}, // Default empty object if undefined
    get_reviews: { avgRating } = {},
  } = reviews;

  // Total sentiments for calculating percentages
  const totalSentiments = Positive + Negative + Nuetral;

  // Preparing data for Recharts
  const sentimentData = [
    { name: 'Positive', value: (Positive / totalSentiments) * 100 },
    { name: 'Neutral', value: (Nuetral / totalSentiments) * 100 },
    { name: 'Negative', value: (Negative / totalSentiments) * 100 },
  ];

  // Donut Chart Colors
  const COLORS = ['#4caf50', '#ffc107', '#f44336']; // Green, Yellow, Red

  return (
    <div id="review" className="section4-container">

      <div className="qz">
          {
            showQuiz && <div >
              <MCQQuiz setShowQuiz={setShowQuiz} />
            </div>
          }
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
            {
              showQuiz ? <button style={{ width: 'max-content', fontSize: '17px', marginTop: '5px' }} onClick={() => setShowQuiz(false)}>End Quiz</button>
                : <button style={{ width: 'max-content', fontSize: '17px' }} onClick={() => setShowQuiz(true)}>Start Quiz</button>
            }
          </div>
        </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: "column", alignItems: "center", gap: '30px' }}>
          <Loader />
        </div>

      ) : (
        <div className="section4-content">
          <div className="section4-summary">
            <h3>Summary</h3>
            <p>{summary || 'No summary available'}</p>
          </div>

          <div className="section4-details">
            <div className="section4-sentiments">
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
                    label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip

                    itemStyle={{
                      color: 'white', // White text color
                    }}
                    formatter={(value, name) => [`${value.toFixed(2)}%`, name]} // Format percentage
                    cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }} // Slightly visible cursor
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

            </div>

            <div className="section4-pros-cons">
              <div className="pros">
                <h3 style={{ margin: '10px' }}>Pros</h3>
                {positive_keywords?.map((keyword, index) => (
                  <span key={index} className="keyword-item green-text">
                    {keyword}
                  </span>
                )) || 'No pros available'}
              </div>

              <div className="cons">
                <h3 style={{ margin: '10px' }}>Cons</h3>
                {negative_keywords?.map((keyword, index) => (
                  <span key={index} className="keyword-item red-text">
                    {keyword}
                  </span>
                )) || 'No cons available'}
              </div>
            </div>
          </div>

          <div className="section4-rating">
            <h3>Average Rating</h3>
            <div className="rating-value">
              <span>
                {avgRating
                  ? Number(avgRating).toFixed(2)
                  : (
                    reviews.get_reviews.rating.reduce(
                      (acc, curr) => acc + curr,
                      0
                    ) / reviews.get_reviews.rating.length
                  ).toFixed(2)}
                / 5
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section4;
