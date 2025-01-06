const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");
const config = require("config");
const bcrypt = require("bcrypt");

const addAdmin = async (req, res) => {
  try {
    const { name, phone_number, email, password, is_active, is_creator } =
      req.body;

    const hashed_password = bcrypt.hashSync(
      password,
      config.get("bcrypt_round")
    );

    const newAdmin = await pool.query(
      `INSERT INTO admin (name, phone_number, email, hashed_password, is_active, is_creator)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, phone_number, email, hashed_password, is_active, is_creator]
    );
    res.status(201).send(newAdmin.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const admins = await pool.query(`SELECT * FROM admin`);
    res.status(200).send(admins.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await pool.query(`SELECT * FROM admin WHERE id = $1`, [id]);
    res.status(200).send(admin.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldAdmin = (
      await pool.query(`SELECT * FROM admin WHERE id = $1`, [id])
    ).rows[0];

    if (!oldAdmin) {
      return res.status(404).send({ msg: "Admin topilmadi" });
    }
    const {
      name,
      phone_number,
      email,
      hashed_password,
      is_active,
      is_creator,
    } = req.body;

    const updatedAdmin = await pool.query(
      `UPDATE admin SET name = $1, phone_number = $2, email = $3, hashed_password = $4, is_active = $5, is_creator = $6 WHERE id = $7 RETURNING *`,
      [
        name || oldAdmin.name,
        phone_number || oldAdmin.phone_number,
        email || oldAdmin.email,
        hashed_password || oldAdmin.hashed_password,
        is_active || oldAdmin.is_active,
        is_creator || oldAdmin.is_creator,
        id,
      ]
    );

    res.status(200).send(updatedAdmin.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = (await pool.query(`SELECT * FROM admin WHERE id = $1`, [id]))
      .rows[0];
    if (!admin) {
      return res.status(404).send({ msg: "Admin topilmadi" });
    }
    await pool.query(`DELETE FROM admin WHERE id = $1`, [id]);
    res.status(200).send(admin);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addAdmin,
  getAll,
  getById,
  updateById,
  deleteById,
};
