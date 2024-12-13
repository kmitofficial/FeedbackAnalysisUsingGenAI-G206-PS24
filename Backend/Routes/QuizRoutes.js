const express=require('express')
const router=express.Router()
const {getAllQuiz,PostAllQuiz}=require('../Controllers/QuizController')

router.post('/postquiz',PostAllQuiz);
router.get('/getquiz',getAllQuiz);

module.exports=router