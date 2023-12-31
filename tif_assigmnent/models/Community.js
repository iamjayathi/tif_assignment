const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
    _id:{
        type:String,
        require:true,
        unique:true
    },
    name:{
        type:String,
    },
    slug:{
        type:String
    },
    owner:{
        type:String,
        ref:"User"
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    }

    
})

module.exports = mongoose.model("community",communitySchema);
