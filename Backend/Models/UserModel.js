const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
     username:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true
     },
     role:{
        enum:['Seller','Buyer','Admin'],
        type:String,
        required:true
     },
     image:{
      type:String
     },
     reviews:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:'History'
      }
     ]
},{
   timestamps:true
})

module.exports=mongoose.model('User',UserSchema)