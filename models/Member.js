const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    _id:{
        type:String,
        require:true,
        unique:true
    },
    community:{
        type:String,
        require:true,
        ref:"Community"
    },
    user:{
        type:String,
        ref:"User",
        require:true
    },
    role:{
        type:String,
        ref:"Role",
        require:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
})

module.exports = mongoose.model("member",memberSchema);
