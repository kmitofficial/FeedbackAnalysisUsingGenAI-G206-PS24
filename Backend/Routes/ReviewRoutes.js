const express=require('express')
const router=express.Router()
const {getReviews}=require('../Controllers/ReviewsController')



router.post('/scrape-url',getReviews)

module.exports=router