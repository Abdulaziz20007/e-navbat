const {
  addSpecialist,
  getAll,
  getById,
  updateById,
  deleteById,
} = require("../controllers/specialist.controller");

const router = require("express").Router();

router.post("/", addSpecialist);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", updateById);
router.delete("/:id", deleteById);

module.exports = router;
