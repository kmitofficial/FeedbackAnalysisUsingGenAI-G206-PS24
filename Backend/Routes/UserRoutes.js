const express=require('express')
const router=express.Router()
const {auth}=require('../Middleware/Auth')


//importing signup controller

const {sendOtp, signUp, login,getAllUserDetails,getUserHistory,getAllReviews,updateReview} =require('../Controllers/UserController')
const { storeHistory ,getHistory} = require('../Controllers/HistoryController')



//Sign Up Route

router.post('/signup',signUp)
router.post('/sendotp',sendOtp)
router.post('/login',login)
router.get('/profile',auth,getAllUserDetails)
router.post('/history',auth,storeHistory)
router.post('/gethistory',auth,getHistory)
router.get('/getuserhistory/:id',auth,getUserHistory)
router.post('/addreview',auth,updateReview)
router.get('/all-reviews',getAllReviews)




module.exports=router