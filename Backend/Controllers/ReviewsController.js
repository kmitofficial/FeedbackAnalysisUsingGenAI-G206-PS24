const axios=require('axios')
 
const getReviews=async (req, res) => {
    const { url } = req.body;

    console.log(req.body)

    if (!url) {
        return res.send({ error: 'URL is required' });
    }

    try {
        // Send the URL to Flask for scraping
        const flaskResponse = await axios.post('http://192.168.38.237:5000/reviews', { url });

        console.log("flask:----->",flaskResponse.data)

        // Get the scraped data from Flask
        const scrapedData = flaskResponse.data;

        // Return the scraped data to the client (or store/process it in your DB)
        res.json({
            success:true,
            message:"got reviews!",
            data:scrapedData
        });
    } catch (error) {
        console.error("Error scraping URL:", error.message);
        res.json({
            success:false,
            message:"Error getting reviews!"
        })
    }
};


module.exports={getReviews}