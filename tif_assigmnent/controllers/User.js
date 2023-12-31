const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {Snowflake} = require("@theinternetfolks/snowflake");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validatorjs");

function addError(errors,validation){
    let errorKeys = Object.keys(validation.errors.errors);

    for(let i=0;i<errorKeys.length;i++){
        let key = Object.keys(validation.errors.errors)[i];
        errors.push(
            {
                param:Object.keys(validation.errors.errors)[i],
                message:validation.errors.errors[key],
                code:"INVALID_INPUT"
            }
        )
    }
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let errors = [];
    const data = {
        name:name,
        email:email,
        password:password
      };
      const rules = {
        name:'required|min:2',
        email:'required|email',
        password:'min:6'
      }
      let validation = new validator(data,rules,{
        
        "required.name":{
            string:'The :attribute be atleast 2 characters.'
        },
        "min.name":{
            string:'The :attribute be atleast :min characters.'
        },
        "required.password":{
            string:'The :attribute be atleast 6 characters.'
        },
        "min.password":{
            string:'The :attribute be atleast :min characters.'
        },
        email:'Please provide a valid email address.'
    });

    if (validation.fails()) {
        addError(errors,validation);

      return res.status(400).json({
        status: false,
        errors,
      });
    }
    const userExists = await User.find({ email: email });
    if (userExists.length !== 0) {
      errors.push({
        param: "email",
        message: "User with this email address already exists.",
        code: "RESOURCE_EXISTS",
      });
      return res.status(400).json({
        status: false,
        errors,
      });
    }
    const generatedId =await Snowflake.generate().toString();
    const encryptedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      _id: generatedId,
      name,
      email,
      password: encryptedPass,
    });
    const payload = {
        data:{
            id: generatedId,
            name: name,
            email: email,
            created_at: user.created_at
        }
    };
    const access_token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.cookie("access_token",access_token,{
        expires:new Date(Date.now() + 3*24*60*60*1000),
        httpOnly:true
    }).status(200).json({
        status: true,
        content: payload,
        meta: {
            access_token: access_token
        }
    })
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "ERROR: while signing up.",
      errorMessage: error.message,
    });
  }
};

exports.signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      let errors=[];
      const data = {
        email:email,
        password:password
      };
      const rules = {
        email:'required|email',
        password:'required|min:6'
      }
      let validation = new validator(data,rules,{
        
        "required.password":{
            string:'The :attribute be atleast 6 characters.'
        },
        "min.password":{
            string:'The :attribute be atleast :min characters.'
        },
        email:'Please provide a valid email address.'
    });
        if(validation.fails()){
            addError(errors,validation);
            return res.status(400).json({
                status: false,
                errors,
            })
        }
        const user = await User.findOne({email:email});
        const doMatch  = await bcrypt.compare(password,user.password);
      if (!doMatch) {
        errors.push({
          param: "password",
          message: "The credentials you provided are invalid.",
          code: "INVALID_CREDENTIALS",
        });
      }
      if (errors.length) {
        return res.status(400).json({
          status: false,
          errors,
        });
      }

      const payload = {
          data:{
              id: user.id,
              name: user.name,
              email: user.email,
              created_at: user.created_at
          }
      };
      const access_token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
  
      res.cookie("access_token",access_token,{
          expires:new Date(Date.now() + 3*24*60*60*1000),
          httpOnly:true
      }).status(200).json({
          status: true,
          content: payload,
          meta: {
              access_token: access_token
          }
      })
      
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "ERROR: while signing in.",
        errorMessage: error.message
      });
    }
  };

exports.getMe = async(req,res)=>{
    try {
        
        const {access_token} = req.cookies || req.header("Authorization").replace("Bearer ","");
        if(!access_token)
        return res.status(401).json({
            status: false,
            errors: [
            {
                message: "You need to sign in to proceed.",
                code: "NOT_SIGNEDIN"
            }
            ]
        })
        const payload = await jwt.verify(access_token,process.env.JWT_SECRET);

        res.status(200).json({
            status: true,
            content: {data:payload.data}
        })
        

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while retrieving info.",
            errorMessage: error.message,
          });
    }
  }
