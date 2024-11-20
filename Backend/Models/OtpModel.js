const mongoose=require('mongoose')
const mailSender = require('../Utils/mailSender')

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})


//pre save middleware to send email otp to user before saving otp model in db!

async function sendverificationEmail(email,otp)
{
    try {
        const mailResponse=await mailSender(email,"Verification of email from Feedback Analysis:",otp)
        console.log("Otp sent Successfully!",mailResponse)
    } catch (error) {
        console.log("error while sending email of otp! in otp model file")
        throw error
    }
}

otpSchema.pre("save",async function(next)
{
     await sendverificationEmail(this.email,this.otp)
     next()
})


module.exports=mongoose.model("Otp",otpSchema)



