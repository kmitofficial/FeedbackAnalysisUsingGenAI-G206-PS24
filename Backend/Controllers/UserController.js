const User = require("../Models/UserModel")
const Otp = require("../Models/OtpModel")
const Review=require('../Models/RatingsModel')
const otpGenerator = require("otp-generator")
const History =require('../Models/HistoryModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mailSender=require('../Utils/mailSender')

//otp send function
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: "Email is required!"
            });
        }

        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.json({
                success: false,
                message: "User already exists!"
            });
        }

        // Generate a unique OTP
        let otp;
        let result;
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await Otp.findOne({ otp });
        } while (result);

        // Try to send the OTP email first
        const mailResponse = await mailSender(
            email,
            "Verification of email from Feedback Analysis:",
            otp
        );

        if (!mailResponse) {
            return res.json({
                success: false,
                message: "Could not send OTP email. Please try again."
            });
        }

        // Only save the OTP if email was sent successfully
        const otpPayload = { otp, email };
        const OtpBody = await Otp.create(otpPayload);

        return res.json({
            success: true,
            message: "OTP sent successfully!",
            otpId: OtpBody._id // Optional: for tracking
        });
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Something went wrong while sending OTP!"
        });
    }
};


//sign up
const signUp = async (req, res) => {
    try {
        // Fetch data from req.body
        const { username, email, password, cpassword, otp } = req.body;
       
        console.log(username, email, password, cpassword, otp);
        
        // Validate data
        if (!username || !email || !password || !cpassword || !otp) {
            return res.json({
                success: false,
                message: "All fields are required!"
            });
        }

        // Check if passwords match
        if (password !== cpassword) {
            return res.json({
                success: false,
                message: "Password and confirm password do not match!"
            });
        }

        // Find most recent OTP from the database
        const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        
        // Validate OTP
        if (!recentOtp) {
            return res.json({
                success: false,
                message: "OTP not found!"
            });
        }

        if (otp !== recentOtp.otp) {
            console.log("otp:", otp);
            console.log("recentOtp:", recentOtp.otp);
            return res.json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${username}`
        });

        // Return response
        return res.json({
            success: true,
            message: "User registration successful!",
            data: user
        });

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "User registration failed! Please try again later."
        });
    }
};


//login

const login = async (req, res) => {
     try {
        //get data from req.body
        const {email,password}=req.body

        //validate
        if(!email || !password)
        {
            return res.json({
                success:false,
                message:"User not exists!"
            })
        }

        //check if user not actually exists but trying to login
        const isExist=await User.findOne({email})

        if(!isExist)
        {
            return res.json({
                success:false,
                message:"User do not exist!"
            })
        }

        //password check
        if(!await bcrypt.compare(password,isExist.password))
            {
                return res.json({
                    success:false,
                    message:"Password do not match!"
                })
            }


        const payLoad={
            email:isExist.email,
            id:isExist._id,
        }

        const token=jwt.sign(payLoad,process.env.JWT_SECRET)
       
        //create cookie
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true
        }

        //undeifing password
        isExist.password=undefined

        //if all correct generate jwt token
        return res.cookie("token",token,options).json({
            success:true,
            message:"User Logged In successfully!",
            data:isExist,
            token:token
        })


     } catch (error) {
        return res.json({
            success:false,
            message:"Login failed! please try Again later!"
        })
     }
}


const getAllUserDetails = async (req, res) => {
    console.log("user",req.user)

    try {
        //get id
        const id = req.user.id;


        //validation and get user details
        const userDetails = await User.findById(id)
        //return response
        return res.json({
            success:true,
            message:'User Data Fetched Successfully',
            userDetails
        });
       
    }
    catch(error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
}


const getUserHistory = async (req, res) => {
    console.log("params:", req.params.id); // Log the entire params object
  
    try {
      const id = req.params.id;

  
      // Check if the history exists for the provided URL
      const existing = await History.findById(id);
  
      if (!existing) {
        return res.json({
          success: false,
          message: 'No reviews found!',
        });
      }
  
      return res.json({
        success: true,
        message: 'History of user fetched successfully!',
        data: existing, // Send the found history data
      });
    } catch (error) {
      console.error('Error fetching history:', error.message); // Log the error message
      return res.json({
        success: false,
        message: 'Something went wrong while fetching the history!',
      });
    }
  };



  const updateReview = async (req, res) => {
    try {
      const { rating, review } = req.body;
  
      // Validate input
      if (!rating || !review) {
        return res.json({ message: 'Rating and review are required.' });
      }
  
      // Check if the user already has a review
      const existingReview = await Review.findOne({ userId: req.user.id });
  
      if (existingReview) {
        // If the user already has a review, update it
        existingReview.rating = rating;
        existingReview.review = review;
  
        const updatedReview = await existingReview.save(); // Save the updated review
        return res.json({ message: 'Review updated successfully.', review: updatedReview });
      } else {
        // If no review exists, create a new one
        const newReview = new Review({
          userId: req.user.id, // User ID from the token
          rating,
          review,
        });
  
        const savedReview = await newReview.save(); // Save the new review
        return res.json({ message: 'Review added successfully.', review: savedReview });
      }
    } catch (error) {
      console.error('Error adding or updating review:', error);
      res.json({ message: 'Failed to add or update review.' });
    }
  };
  


  const getAllReviews = async (req, res) => {
    try {
      // Fetch reviews and populate userId, but exclude the password field
      const allReviews = await Review.find()
        .populate('userId', 'username email image')  // Include username, email, and image
        .exec();  // Use exec() to execute the query
      
      // Respond with reviews
      res.json({ reviews: allReviews });
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      res.status(500).json({ message: 'Failed to fetch all reviews.' });  // Return 500 error on failure
    }
  };

  

module.exports = { sendOtp, signUp, login,getAllUserDetails,getUserHistory,getAllReviews,updateReview}