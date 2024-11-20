import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios

import './Section5.css';

const Section5 = () => {
  const [reviews, setReviews] = useState([]);  // State to store reviews

  useEffect(() => {
    // Fetch reviews from the backend when the component mounts
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/users/all-reviews');
        setReviews(response.data.reviews);  // Update state with fetched reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();  // Call the function to fetch reviews
  }, []);  // Empty dependency array ensures the effect runs only once when the component mounts

  // Function to render stars based on rating (one yellow star and one gray star)
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="star filled">⭐</span>); // Yellow star for filled
      }
    }
    return stars;
  };

  return (
    <div className="reviews-container">
      <h1 className="title">What Our Users Say</h1>
      <p className="p">
      Hear what our users have to say about how our feedback analysis tool has transformed their decision-making and improved their experiences!
      </p>
      <div className="reviews-grid">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div className="review-item" key={review._id}>
               <div className="img">
                <img src={review.userId.image} alt="User Profile" />
                <div className="infoo">
                  <p><b>{review.userId.username}</b></p>
                  <p style={{fontSize:'14px'}}>{review.userId.email}</p>
                </div>
              </div>
              <p className="description">{review.review}</p>
              <div className="rating">
                {review.rating}.0
                {renderStars(review.rating)} {/* Render the stars based on the rating */}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default Section5;