const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req,res,next)=>{
    try {
        
        const token =req.body.access_token || req.cookies.access_token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: access_token,
                        message: "Not signed in.",
                        code: "UNAUTHORISED_ACCESS"
                    }
                ]
            })
        }

        const payload =await jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"ERROR: authorizing. Sign In please. => " +error.message 
        });
    }
}

