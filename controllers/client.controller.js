const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addClient = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, info, photo } = req.body;

    const newClient = await pool.query(
      `INSERT INTO clients (first_name, last_name, phone_number, info, photo)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, phone_number, info, photo]
    );
    res.status(201).send(newClient.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const clients = await pool.query(`SELECT * FROM clients`);
    res.status(200).send(clients.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};
const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await pool.query(`SELECT * FROM clients WHERE id = $1`, [
      id,
    ]);
    res.status(200).send(client.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldClient = (
      await pool.query(`SELECT * FROM clients WHERE id = $1`, [id])
    ).rows[0];

    if (!oldClient) {
      return res.status(404).send({ msg: "Client topilmadi" });
    }
    const { first_name, last_name, phone_number, info, photo } = req.body;

    const updatedClient = await pool.query(
      `UPDATE clients SET first_name = $1, last_name = $2, phone_number = $3, info = $4, photo = $5 WHERE id = $6 RETURNING *`,
      [
        first_name || oldClient.first_name,
        last_name || oldClient.last_name,
        phone_number || oldClient.phone_number,
        info || oldClient.info,
        photo || oldClient.photo,
        id,
      ]
    );

    res.status(200).send(updatedClient.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const client = (
      await pool.query(`SELECT * FROM clients WHERE id = $1`, [id])
    ).rows[0];
    if (!client) {
      return res.status(404).send({ msg: "Client topilmadi" });
    }
    await pool.query(`DELETE FROM clients WHERE id = $1`, [id]);
    res.status(200).send(client);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addClient,
  getAll,
  getById,
  updateById,
  deleteById,
};
