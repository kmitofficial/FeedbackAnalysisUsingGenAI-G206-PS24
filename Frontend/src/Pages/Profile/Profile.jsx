import React, { useEffect, useState } from 'react';
import './Profile.css'; // Import CSS for styling
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import toast for notifications

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null); // State to store user details
  const [loading, setLoading] = useState(true); // State to handle loading
  const [rating, setRating] = useState(''); // State for rating input
  const [review, setReview] = useState(''); // State for review input
  const storedToken = JSON.parse(localStorage.getItem('token')); // Use token from Redux or localStorage

  // Fetch user profile details from backend API
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!storedToken) {
        return navigate('/'); // Redirect to login if token is not found
      }

      try {
        const response = await axios.get('http://localhost:7000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${storedToken}`, // Pass token in Authorization header
          },
        });
        setUserDetails(response.data.userDetails); // Set the user data from API
        console.log(response.data);
        setLoading(false); // Turn off loading
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to fetch user details.');
        setLoading(false); // Turn off loading in case of error
        navigate('/'); // Redirect to login page on failure
      }
    };

    fetchUserDetails();
  }, [storedToken, navigate]);

  // Handle review form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !review) {
      return toast.error('Both rating and review are required.');
    }

    try {
      const response = await axios.post(
        'http://localhost:7000/api/users/addreview',
        { rating, review },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      toast.success(response.data.message);
      setRating('');
      setReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review.');
    }
  };

  // If the data is still loading, show a loading indicator
  if (loading) {
    return <p>Loading profile...</p>;
  }

  // If user details are not available, return null or an error message
  if (!userDetails) {
    return <p>Profile data not available.</p>;
  }

  return (
    <div>
      {/* Profile Container */}
      <div className="profile-container">
        <img className="profile-image" src={userDetails.image} alt={`${userDetails.username}'s profile`} />
        <h2 className="profile-username">{userDetails.username}</h2>
        <div className="profile-details">
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Role:</strong> {userDetails.role}
          </p>
          <p>
            <strong>Date Joined:</strong> {userDetails.createdAt.split('T')[0].split('-').reverse().join('-')}
          </p>
        </div>
        
      </div>

      {/* Form Container */}
      <div className="review-form-container">
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Submit Your Review</h3>
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
          <label htmlFor="review">Review:</label>
          <textarea
            id="review"
            name="review"
            rows="4"
            maxLength={500}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
