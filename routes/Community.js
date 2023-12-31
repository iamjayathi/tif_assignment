const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {createCommunity,
    getAll,
    getMembers,
    getOwnedCommunity,
    getJoinedCommunities} = require("../controllers/Community");

router.post("/",auth,createCommunity);
router.get("/",auth,getAll);
router.get("/:id/members",getMembers);
router.get("/me/owner",auth,getOwnedCommunity);
router.get("/me/member",auth,getJoinedCommunities);


module.exports = router;
