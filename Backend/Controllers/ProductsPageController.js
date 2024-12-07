const History=require('../Models/HistoryModel')

const getAllProducts=async (req, res) => {    

    try {
       const products=await History.find({});

        res.json({
            success:true,
            message:"got reviews!",
            data:products
        });
    } catch (error) {
        console.error("Error getting products", error.message);
        res.json({
            success:false,
            message:"Error getting reviews!"
        })
    }
};


module.exports={getAllProducts}