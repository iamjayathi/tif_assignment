const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    _id:{
        type:String,
        require: true,
        unique: true
    },
    name:{
        type:String,
        require:true,
        default:null
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

module.exports = mongoose.model("role",roleSchema);
