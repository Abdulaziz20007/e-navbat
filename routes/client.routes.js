const {
  addClient,
  getAll,
  getById,
  updateById,
  deleteById,
} = require("../controllers/client.controller");

const router = require("express").Router();

router.post("/", addClient);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", updateById);
router.delete("/:id", deleteById);

module.exports = router;
