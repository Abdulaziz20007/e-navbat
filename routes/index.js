const clientRouter = require("./client.routes");
const specialistRouter = require("./specialistt.routes");
const adminRouter = require("./admin.routes");
const router = require("express").Router();

router.use("/client", clientRouter);
router.use("/specialist", specialistRouter);
router.use("/admin", adminRouter);

module.exports = router;
