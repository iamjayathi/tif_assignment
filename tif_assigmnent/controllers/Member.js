const Community = require("../models/Community");
const Member = require("../models/Member");
const Role = require("../models/Role");
const User = require("../models/User");
const {Snowflake} = require("@theinternetfolks/snowflake");


exports.addMember = async (req,res)=>{
    try {
        
        const id = req.user.data.id;
        const {community,user,role} = req.body;

        const communityExist = await Community.findOne({_id:community});
        if(!communityExist){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        param: "community",
                        message: "Community not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
        }

        const roleExists = await Role.findOne({_id:role});
        if(!roleExists){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        param: "role",
                        message: "Role not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
        }

        const userExists = await User.findOne({_id:user});
        if(!userExists){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        param: "user",
                        message: "User not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
        }

        const alreadyMember = await Member.findOne({user:user,community:community});
        if(alreadyMember){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        message: "User is already added in the community.",
                        code: "RESOURCE_EXISTS"
                    }
                ]
            })
        }
        const admin = await Member.find({_id:id,community:community,role:"Community Admin"});
        if(!admin){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        message: "You are not authorized to perform this action.",
                        code: "NOT_ALLOWED_ACCESS"
                    }
                ]
            })
        }

        const isPresent = await Member.findOne({_id:user, community:community});

        if(isPresent){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        message: "User is already added in the community.",
                        code: "RESOURCE_EXISTS"
                    }
                ]
            })
        }

        const generatedId = Snowflake.generate().toString();

        const addedMember  = await Member.create({_id:generatedId,user:user,role:role,community:community});
        // console.log(addedMember);

        return res.status(200).json({
            status: true,
            content: {
                data:addedMember
        }
    })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "ERROR: while adding member.",
            errorMessage: error.message,
          });
    }
}

exports.removeMember = async (req,res)=>{
    try {
        const removeId = req.params.id;
        const {id} = req.user.data;

        const adminRole = await Role.findOne({name:"Community Admin"});
        console.log("here");

        const modRole = await Role.findOne({name:"Community Moderator"});
        const ownedCommunities=[];
        if(adminRole){
            ownedCommunities.push(await Member.find({user:id,role:adminRole._id}));
            if(ownedCommunities.length>0){
                await Member.findByIdAndDelete({_id:removeId.toString(),community:ownedCommunities[0].community});
                return res.status(200).json({
                    status:true
                });
            }
        }   
        if(modRole){
            ownedCommunities.push(await Member.find({user:id,role:modRole._id}));
            await Member.findByIdAndDelete({_id:removeId.toString(),community:ownedCommunities[0].community});
            return res.status(200).json({
                status:true
            });
        }


        return res.status(  200).json({
            status: false,
            errors: [
              {
                message: "Member not found.",
                code: "RESOURCE_NOT_FOUND"
              }
            ]
          })


    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while removing member.",
            errorMessage: error.message,
          });
    }
}
