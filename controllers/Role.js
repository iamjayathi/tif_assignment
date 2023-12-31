const Role = require("../models/Role");
// const snowflake = require("@theinternetfolks/snowflake");
// import { Snowflake } from "@theinternetfolks/snowflake";
const {Snowflake} = require("@theinternetfolks/snowflake");
exports.createRole = async (req,res)=>{
    try {
        const {name} = req.body;
        // console.log(name);
        if(!name || name.length < 2){
            return res.status(400).json({
                status:false,
                message:"ERROR: Missing sufficient details.",
                errors:[{
                    param:"name",
                    message:"Name should be at least 2 characters.",
                    code: "INVALID_INPUT"
                }]
            })
        }
        
        const generatedId = Snowflake.generate().toString();
        const createdRole = (await Role.create({_id:generatedId,name:name}));
            //{id:true, name:true, created_at:true, updated_at:true, _id:false, __v:false}));
        //.select({"id":1, "name":1, "created_at":1, "updated_at":1, "_id":0, "__v":0});

        res.status(200).json({
            status:true,
            content:{
                data:createdRole
            }
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"ERROR: while creating role.",
            errorMessage:error.message
        })
    }
}

exports.getAllRoles = async (req,res)=>{
    try {

        const allRoles = await Role.find({});
        if(!allRoles || allRoles.length === 0){
            return res.status(400).json({
                status:false,
                message:"No roles found."
            })
        }
        res.status(200).json({
            status:true,
            content:{
                meta:{
                    total: allRoles.length,
                    pages:Math.ceil(allRoles.length/10),
                    page:1
                },
                data:allRoles.slice(0,10)
            }
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"ERROR: while fetching roles.",
            errorMessage:error.message
        })
    }
}
