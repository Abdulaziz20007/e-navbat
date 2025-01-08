const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addService = async (req, res) => {
  try {
    const { service_name, service_price } = req.body;

    const newService = await pool.query(
      `INSERT INTO service (service_name, service_price)
      VALUES ($1, $2) RETURNING *`,
      [service_name, service_price]
    );
    res.status(201).send(newService.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const services = await pool.query(`SELECT * FROM service`);
    res.status(200).send(services.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const service = (
      await pool.query(`SELECT * FROM service WHERE id = $1`, [id])
    ).rows[0];
    if (!service) {
      return res.status(404).send({ msg: "Service topilmadi" });
    }
    res.status(200).send(service.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldService = (
      await pool.query(`SELECT * FROM service WHERE id = $1`, [id])
    ).rows[0];

    if (!oldService) {
      return res.status(404).send({ msg: "Service topilmadi" });
    }
    const { service_name, service_price } = req.body;

    const updatedService = await pool.query(
      `UPDATE service SET service_name = $1, service_price = $2 
      WHERE id = $3 RETURNING *`,
      [
        service_name || oldService.service_name,
        service_price || oldService.service_price,
        id,
      ]
    );

    res.status(200).send(updatedService.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const service = (
      await pool.query(`SELECT * FROM service WHERE id = $1`, [id])
    ).rows[0];
    if (!service) {
      return res.status(404).send({ msg: "Service topilmadi" });
    }
    await pool.query(`DELETE FROM service WHERE id = $1`, [id]);
    res.status(200).send(service);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addService,
  getAll,
  getById,
  updateById,
  deleteById,
};
