const mongoose=require('mongoose')
require('dotenv').config()



const ConnectDb=async()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Db connected!")
    })
    .catch((err)=>{
        console.log("Error connecting to db",err)
    })
}

module.exports=ConnectDb