const express = require("express")
const router = express.Router()

const {signin,signup,getMe} = require("../controllers/User");

router.post("/signup",signup);
router.post("/signin",signin);
router.get("/me",getMe);

module.exports = router;