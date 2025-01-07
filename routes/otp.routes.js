const { createOtp, verifyOtpClient } = require("../controllers/otp.controller");

const router = require("express").Router();

router.post("/", createOtp);
router.post("/verifyclient", verifyOtpClient);

module.exports = router;
