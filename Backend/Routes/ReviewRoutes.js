const express=require('express')
const router=express.Router()
const {getReviews}=require('../Controllers/ReviewsController')
const {auth}=require('../Middleware/Auth')



router.post('/scrape-url',auth,getReviews)

module.exports=router