const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addSpecSocial = async (req, res) => {
  try {
    const { spec_id, social_id, link } = req.body;

    const newSpecSocial = await pool.query(
      `INSERT INTO spec_social (spec_id, social_id, link)
      VALUES ($1, $2, $3) RETURNING *`,
      [spec_id, social_id, link]
    );
    res.status(201).send(newSpecSocial.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const specSocials = await pool.query(`
      SELECT ss.*, s.social_name, sp.first_name as specialist_name 
      FROM spec_social ss 
      JOIN social s ON s.id = ss.social_id
      JOIN specialists sp ON sp.id = ss.spec_id
    `);
    res.status(200).send(specSocials.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const specSocial = await pool.query(
      `SELECT ss.*, s.social_name, sp.first_name as specialist_name 
      FROM spec_social ss 
      JOIN social s ON s.id = ss.social_id
      JOIN specialists sp ON sp.id = ss.spec_id
      WHERE ss.id = $1`,
      [id]
    );
    res.status(200).send(specSocial.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldSpecSocial = (
      await pool.query(`SELECT * FROM spec_social WHERE id = $1`, [id])
    ).rows[0];

    if (!oldSpecSocial) {
      return res.status(404).send({ msg: "Specialist social topilmadi" });
    }
    const { spec_id, social_id, link } = req.body;

    const updatedSpecSocial = await pool.query(
      `UPDATE spec_social SET spec_id = $1, social_id = $2, link = $3
      WHERE id = $4 RETURNING *`,
      [
        spec_id || oldSpecSocial.spec_id,
        social_id || oldSpecSocial.social_id,
        link || oldSpecSocial.link,
        id,
      ]
    );

    res.status(200).send(updatedSpecSocial.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const specSocial = (
      await pool.query(`SELECT * FROM spec_social WHERE id = $1`, [id])
    ).rows[0];
    if (!specSocial) {
      return res.status(404).send({ msg: "Specialist social topilmadi" });
    }
    await pool.query(`DELETE FROM spec_social WHERE id = $1`, [id]);
    res.status(200).send(specSocial);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addSpecSocial,
  getAll,
  getById,
  updateById,
  deleteById,
};
