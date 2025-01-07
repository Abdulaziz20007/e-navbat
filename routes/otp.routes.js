const {
  createOtp,
  verifyOtpClient,
  deleteOtpById,
} = require("../controllers/otp.controller");

const router = require("express").Router();

router.post("/", createOtp);
router.post("/verifyclient", verifyOtpClient);
router.delete("/delete/:id", deleteOtpById);

module.exports = router;
