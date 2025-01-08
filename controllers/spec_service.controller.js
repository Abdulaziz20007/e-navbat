const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addSpecService = async (req, res) => {
  try {
    const { spec_id, service_id, spec_service_price } = req.body;

    const newSpecService = await pool.query(
      `INSERT INTO spec_service (spec_id, service_id, spec_service_price)
      VALUES ($1, $2, $3) RETURNING *`,
      [spec_id, service_id, spec_service_price]
    );
    res.status(201).send(newSpecService.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const specServices = await pool.query(`
      SELECT ss.*, s.service_name, sp.first_name as specialist_name 
      FROM spec_service ss 
      JOIN service s ON s.id = ss.service_id
      JOIN specialists sp ON sp.id = ss.spec_id
    `);
    res.status(200).send(specServices.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const specService = await pool.query(
      `SELECT ss.*, s.service_name, sp.first_name as specialist_name 
      FROM spec_service ss 
      JOIN service s ON s.id = ss.service_id
      JOIN specialists sp ON sp.id = ss.spec_id
      WHERE ss.id = $1`,
      [id]
    );
    res.status(200).send(specService.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldSpecService = (
      await pool.query(`SELECT * FROM spec_service WHERE id = $1`, [id])
    ).rows[0];

    if (!oldSpecService) {
      return res.status(404).send({ msg: "Specialist service topilmadi" });
    }
    const { spec_id, service_id, spec_service_price } = req.body;

    const updatedSpecService = await pool.query(
      `UPDATE spec_service SET spec_id = $1, service_id = $2, spec_service_price = $3
      WHERE id = $4 RETURNING *`,
      [
        spec_id || oldSpecService.spec_id,
        service_id || oldSpecService.service_id,
        spec_service_price || oldSpecService.spec_service_price,
        id,
      ]
    );

    res.status(200).send(updatedSpecService.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const specService = (
      await pool.query(`SELECT * FROM spec_service WHERE id = $1`, [id])
    ).rows[0];
    if (!specService) {
      return res.status(404).send({ msg: "Specialist service topilmadi" });
    }
    await pool.query(`DELETE FROM spec_service WHERE id = $1`, [id]);
    res.status(200).send(specService);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addSpecService,
  getAll,
  getById,
  updateById,
  deleteById,
};
