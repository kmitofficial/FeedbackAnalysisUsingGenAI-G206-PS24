const History = require('../Models/HistoryModel');
const User = require('../Models/UserModel');

// Function to store user review history
const storeHistory = async (req, res) => {
  try {
    const id = req.user.id; // Assuming the user is authenticated and the ID is attached to the request
    const { url, reviews } = req.body; // Extract URL and reviews (structured data) from the request body

    // Validation: Ensure both URL and reviews are provided
    if (!url || !reviews) {
      return res.json({
        success: false,
        message: 'URL and reviews are required to store the history!',
      });
    }

    // Check if the user exists
    const userExists = await User.findById(id);
    if (!userExists) {
      return res.json({
        success: false,
        message: 'User not found, cannot store history!',
      });
    }

    // Check if the history for this URL already exists in the database
    const existingHistory = await History.findOne({ url });
    if (existingHistory) {
      return res.json({
        success: true,
        message: 'History already exists for this URL!',
        data: existingHistory,
      });
    }

    // Extracting necessary data from reviews
    const { summary, keywords, sentiments, get_reviews } = reviews;
    const { positive_keywords, negative_keywords } = keywords; // Extract keywords
    const { Positive, Negative, Nuetral } = sentiments;
    const { avgRating } = get_reviews;

    // Create a new history record with keywords
    const HistoryUser = await History.create({
      summary,
      url,
      keywords: {
        positive_keywords, // Store positive keywords
        negative_keywords, // Store negative keywords
      },
      sentiments: {
        Positive,
        Negative,
        Nuetral,
      },

      avgRating, // Added the average rating
    });

    // Add the newly created history to the user's reviews array
    const updateUserReviewArr = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          reviews: HistoryUser._id, // Push the newly created history to the user's review array
        },
      },
      { new: true } // Optionally return the updated user
    );

    return res.json({
      success: true,
      message: 'History stored successfully!',
      data: HistoryUser,
      updatedReviwesArray: updateUserReviewArr,
    });

  } catch (error) {
    console.error('Error storing history:', error.message);
    return res.json({
      success: false,
      message: 'Something went wrong while storing the user history!',
    });
  }
};

// Function to get user review history by URL
const getHistory = async (req, res) => {
  try {
    const { url } = req.body; // URL is sent in the request body

    const userId = req.user.id; // Get the user ID from the request

    if (!url) {
      return res.json({
        success: false,
        message: 'URL is required to fetch the history!',
      });
    }

    // Check if the history exists for the provided URL
    const existingHistory = await History.findOne({ url });

    if (!existingHistory) {
      return res.json({
        success: false,
        message: 'No history found for this URL!',
      });
    }

    // Find the user document
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found!',
      });
    }

    // Check if the history ID is already in the reviews array
    if (!user.reviews.includes(existingHistory._id)) {
      user.reviews.push(existingHistory._id); // Add history ID to reviews array
      await user.save(); // Save the updated user document
    }

    // Prepare the response to match frontend format
    const response = {
      summary: existingHistory.summary,
      keywords: {
        positive_keywords: existingHistory.keywords.positive_keywords,
        negative_keywords: existingHistory.keywords.negative_keywords,
      },
      sentiments: {
        Positive: existingHistory.sentiments.Positive,
        Negative: existingHistory.sentiments.Negative,
        Nuetral: existingHistory.sentiments.Nuetral,
      },
      get_reviews: {
        avgRating: existingHistory.avgRating, // Send avgRating instead of ratings array
      },
    };
    

    return res.json({
      success: true,
      message: 'History fetched and added to user reviews successfully!',
      data: response, // Send the formatted response data
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.json({
      success: false,
      message: 'Something went wrong while fetching the history!',
    });
  }
};


module.exports = { storeHistory, getHistory };
