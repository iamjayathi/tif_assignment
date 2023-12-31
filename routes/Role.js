const express = require("express")
const router = express.Router()

const {createRole,
    getAllRoles} = require("../controllers/Role");

router.post("/",createRole);
router.get("/",getAllRoles);


module.exports = router;