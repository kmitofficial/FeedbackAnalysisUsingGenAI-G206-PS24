const express=require('express')
const app=express()
require('dotenv').config()
const cors = require('cors');


//Importing router
const UserRouter=require('./Routes/UserRoutes')
const ReviewRouter=require('./Routes/ReviewRoutes')
const ProductRouter=require('./Routes/ProductsRoutes')

const PORT=process.env.PORT


//middlewares
app.use(express.json())
//cross origin
app.use(cors());

app.use("/api/users",UserRouter)
app.use('/api/reviews',ReviewRouter)
app.use("/api/products",ProductRouter)


//db function
const Db=require('./Config/Db')

Db()

app.listen(PORT,()=>{
    console.log("Server Started at port",PORT)
})


