const {
  addAdmin,
  getAll,
  getById,
  updateById,
  deleteById,
} = require("../controllers/admin.controller");

const router = require("express").Router();

router.post("/", addAdmin);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", updateById);
router.delete("/:id", deleteById);

module.exports = router;