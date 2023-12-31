const mongoose = require("mongoose");
require("dotenv").config();


exports.dbConnect = async (req,res) =>{
    try {
        
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connection with DB successful.")
    } catch (error) {
        console.log("ERROR: connecting to Database")
    }
}