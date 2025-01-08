const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addSocial = async (req, res) => {
  try {
    const { social_name, social_icon_file } = req.body;

    const newSocial = await pool.query(
      `INSERT INTO social (social_name, social_icon_file)
      VALUES ($1, $2) RETURNING *`,
      [social_name, social_icon_file]
    );
    res.status(201).send(newSocial.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const socials = await pool.query(`SELECT * FROM social`);
    res.status(200).send(socials.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const social = await pool.query(`SELECT * FROM social WHERE id = $1`, [id]);
    res.status(200).send(social.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldSocial = (
      await pool.query(`SELECT * FROM social WHERE id = $1`, [id])
    ).rows[0];

    if (!oldSocial) {
      return res.status(404).send({ msg: "Social topilmadi" });
    }
    const { social_name, social_icon_file } = req.body;

    const updatedSocial = await pool.query(
      `UPDATE social SET social_name = $1, social_icon_file = $2 
      WHERE id = $3 RETURNING *`,
      [
        social_name || oldSocial.social_name,
        social_icon_file || oldSocial.social_icon_file,
        id,
      ]
    );

    res.status(200).send(updatedSocial.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const social = (
      await pool.query(`SELECT * FROM social WHERE id = $1`, [id])
    ).rows[0];
    if (!social) {
      return res.status(404).send({ msg: "Social topilmadi" });
    }
    await pool.query(`DELETE FROM social WHERE id = $1`, [id]);
    res.status(200).send(social);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addSocial,
  getAll,
  getById,
  updateById,
  deleteById,
};
