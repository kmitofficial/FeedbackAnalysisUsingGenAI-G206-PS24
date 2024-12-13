const Quiz=require('../Models/QuizModel')

const getAllQuiz=async (req, res) => {    

    try {
       const quiz=await Quiz.find({});

        res.json({
            success:true,
            message:"got quiz!",
            data:quiz
        });
    } catch (error) {
        console.error("Error getting quiz", error.message);
        res.json({
            success:false,
            message:"Error getting quiz!"
        })
    }
};


const PostAllQuiz=async (req, res) => { 
    const data=req.body;   

    try {
       const z=await Quiz.insertMany(data);

        res.json({
            success:true,
            message:"created quiz!",
            data:z
        });
    } catch (error) {
        console.error("Error posting quiz", error.message);
        res.json({
            success:false,
            message:"Error posting quiz!"
        })
    }
};


module.exports={getAllQuiz,PostAllQuiz}