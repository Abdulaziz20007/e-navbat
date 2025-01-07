const router = require("express").Router();
const clientRouter = require("./client.routes");
const specialistRouter = require("./specialistt.routes");
const adminRouter = require("./admin.routes");
const otpRouter = require("./otp.routes");

router.use("/client", clientRouter);
router.use("/specialist", specialistRouter);
router.use("/admin", adminRouter);
router.use("/otp", otpRouter);

module.exports = router;
