const { createOtp } = require("../controllers/otp.controller");

const router = require("express").Router();

router.post("/", createOtp);

module.exports = router;
