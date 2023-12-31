const Community = require("../models/Community");
const validator = require("validatorjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Member = require("../models/Member");
const { Snowflake } = require("@theinternetfolks/snowflake");
const Role = require("../models/Role");

require("dotenv").config();

exports.createCommunity = async (req, res) => {
  try {
    const { name } = req.body;

    const data = {
      name: name,
    };
    const rules = {
      name: "required|min:2",
    };
    let validation = new validator(data, rules, {
      "min.name": {
        string: "The :attribute be atleast :min characters.",
      },
      "required.name": {
        string: "The :attribute be atleast 2 characters.",
      },
    });
    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: name,
            message: "Name should be at least 2 characters.",
            code: "INVALID_INPUT",
          },
        ],
      });
    }
    const { id } = req.user.data;
    const generatedId = Snowflake.generate().toString();

    const alreadyExists = await Community.findOne({ name: name });
    if (alreadyExists) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: name,
            message: "Community with this name already exists.",
            code: "INVALID_INPUT",
          },
        ],
      });
    }
    const community = await Community.create({
      _id: generatedId,
      name,
      slug: name.toLowerCase(),
      owner: id,
    });
    //add member as communityadmin
    const adminRole = await Role.findOne({ name: "Community Admin" });
    console.log(adminRole._id);
    const communityAdminMember = await Member.create({
      _id: Snowflake.generate().toString(),
      community: generatedId,
      role: adminRole._id,
      user: id,
    });

    return res.status(400).json({
      status: true,
      content: {
        data: community,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "ERROR: while creating community.",
      errorMessage: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Community.find({})
      .populate({ path: "owner", select: "id name" })
      .exec(); //,{path:"id",select:"id name"}).exec(); 
    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: data.length,
          pages: Math.ceil(data.length / 10),
          page: 1,
        },
        data: data.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "ERROR: while getting all communities.",
      errorMessage: error.message,
    });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findOne({ slug: id });
    const data = await Member.find({ community: community._id }, { __v: false })
      .populate({ path: "role", select: "id name" })
      .populate({ path: "user", select: "id name" })
      .sort({ created_at: -1 })
      .exec();

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: data.length,
          pages: Math.ceil(data.length / 10),
          page: 1,
        },
        data: data.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "ERROR: while getting all members.",
      errorMessage: error.message,
    });
  }
};

exports.getOwnedCommunity = async (req, res) => {
  try {
    const id = req.user.data.id;

    const ownedCommunities = await Community.find(
      { owner: id },
      { __v: false }
    );

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: ownedCommunities.length,
          pages: Math.ceil(ownedCommunities.length / 10),
          page: 1,
        },
        data: ownedCommunities.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "ERROR: while getting owned communities.",
      errorMessage: error.message,
    });
  }
};

exports.getJoinedCommunities = async (req, res) => {
  try {
    const id = req.user.data.id;

    const joinedCommunities = await Member.find({ user: id });

    const communities = [];
    for (let i = 0; i < joinedCommunities.length; i++) {
      communities.push(
        await Community.findOne(
          { _id: joinedCommunities[i].community },
          { __v: false }
        )
          .populate({ path: "owner", select: "name id" })
          .exec()
      );
    }
    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: communities.length,
          pages: Math.ceil(communities.length / 10),
          page: 1,
        },
        data: communities.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "ERROR: while getting joined communities.",
      errorMessage: error.message,
    });
  }
};
