const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const userRoutes = require("./routes/User");
const memberRoutes = require("./routes/Member");
const communityRoutes = require("./routes/Community");
const roleRoutes = require("./routes/Role");
const {dbConnect} = require("./config/database");
const PORT = process.env.PORT || 4000;

dbConnect();

app.use(express.json());
app.use(cookieParser());


app.use("/v1/auth",userRoutes);
app.use("/v1/community",communityRoutes);
app.use("/v1/role",roleRoutes);
app.use("/v1/member",memberRoutes);

app.get("/",(req,res)=>{
    res.send("<h1>This is the default route.</h1>");  
})

app.listen(PORT,(req,res)=>{
    console.log("App is running successfully at Port:",PORT);
})





// // const Validator = require("validatorjs");
// // let validation = new Validator({
// //   name: 'abc',
// //   email: 'not@ress.com'
// // }, {
// //   name: 'min:3',
// //   email: 'required|email'
// // },{
// //     min:{
// //         string:`The :attribute is :min short.`
// //     },
// //     email:'Email format is pow is invalid'
// // });

// // validation.fails(); // true
// // validation.passes(); // false
// // let key = Object.keys(validation.errors.errors)
// // Error messages
// // console.log(Object.keys(validation.errors.errors)[0]); // 'The email format is invalid.'
// // console.log(validation.passes());
// // validation.errors.get('email');
// const mongoose = require( 'mongoose');
// // const { normalize } = require('path');
// let normalize = import('normalize-mongoose');
// // const normalize = require("normalize-mongoose");

// const personSchema = mongoose.Schema({
//     name: String,
//     age: Number,
//     email: String,
//     password: { type: String, private: true },
// });

// personSchema.plugin(normalize);

// const Person = mongoose.model('Person', personSchema);
// const someone = new Person( {
//   // id:1234,
//   name: 'Abraham',
//   age: 33,
//   email: 'abranhe@example.com',
//   password: 'my_awesome_password',
// });
// console.log(someone);