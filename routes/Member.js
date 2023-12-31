const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth");
const {addMember,
    removeMember} = require("../controllers/Member");

router.post("/",auth,addMember);
router.delete("/:id",auth,removeMember);

module.exports = router;
