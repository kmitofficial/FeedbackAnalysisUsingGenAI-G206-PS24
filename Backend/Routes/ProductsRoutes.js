const express=require('express')
const router=express.Router()
const {getAllProducts}=require('../Controllers/ProductsPageController')
const {auth}=require('../Middleware/Auth')



router.get('/products',auth,getAllProducts)

module.exports=router