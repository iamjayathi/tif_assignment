const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true,
        unique: true
      },
    name:{
        type:String,
        require:true,
        default:null
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("users",userSchema);
