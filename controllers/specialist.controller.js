const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addSpecialist = async (req, res) => {
  try {
    const {
      position,
      last_name,
      first_name,
      middle_name,
      birth_day,
      photo,
      phone_number,
      info,
      show_position,
      show_last_name,
      show_first_name,
      show_middle_name,
      show_photo,
      show_social,
      show_info,
      show_birth_day,
      show_phone_number,
    } = req.body;

    const newSpecialist = await pool.query(
      `INSERT INTO specialists
      (position, last_name, first_name, middle_name, birth_day, photo, phone_number, info, show_position, show_last_name, show_first_name, show_middle_name, show_photo, show_social, show_info, show_birth_day, show_phone_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [
        position,
        last_name,
        first_name,
        middle_name,
        birth_day,
        photo,
        phone_number,
        info,
        show_position,
        show_last_name,
        show_first_name,
        show_middle_name,
        show_photo,
        show_social,
        show_info,
        show_birth_day,
        show_phone_number,
      ]
    );
    res.status(201).send(newSpecialist.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const specialists = await pool.query(`SELECT * FROM specialists`);
    res.status(200).send(specialists.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};
const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const specialist = await pool.query(
      `SELECT * FROM specialists WHERE id = $1`,
      [id]
    );
    res.status(200).send(specialist.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldSpecialist = (
      await pool.query(`SELECT * FROM specialists WHERE id = $1`, [id])
    ).rows[0];

    if (!oldSpecialist) {
      return res.status(404).send({ msg: "Specialist topilmadi" });
    }
    const {
      position,
      last_name,
      first_name,
      middle_name,
      birth_day,
      photo,
      phone_number,
      info,
      show_position,
      show_last_name,
      show_first_name,
      show_middle_name,
      show_photo,
      show_social,
      show_info,
      show_birth_day,
      show_phone_number,
    } = req.body;

    const updatedSpecialist = await pool.query(
      `UPDATE specialists SET
      position = $1,
      last_name = $2,
      first_name = $3,
      middle_name = $4,
      birth_day = $5,
      photo = $6,
      phone_number = $7,
      info = $8,
      show_position = $9,
      show_last_name = $10,
      show_first_name = $11,
      show_middle_name = $12,
      show_photo = $13,
      show_social = $14,
      show_info = $15,
      show_birth_day = $16,
      show_phone_number = $17
      WHERE id = $18 RETURNING *`,
      [
        position || oldSpecialist.position,
        last_name || oldSpecialist.last_name,
        first_name || oldSpecialist.first_name,
        middle_name || oldSpecialist.middle_name,
        birth_day || oldSpecialist.birth_day,
        photo || oldSpecialist.photo,
        phone_number || oldSpecialist.phone_number,
        info || oldSpecialist.info,
        show_position || oldSpecialist.show_position,
        show_last_name || oldSpecialist.show_last_name,
        show_first_name || oldSpecialist.show_first_name,
        show_middle_name || oldSpecialist.show_middle_name,
        show_photo || oldSpecialist.show_photo,
        show_social || oldSpecialist.show_social,
        show_info || oldSpecialist.show_info,
        show_birth_day || oldSpecialist.show_birth_day,
        show_phone_number || oldSpecialist.show_phone_number,
        id,
      ]
    );

    res.status(200).send(updatedSpecialist.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const specialist = (
      await pool.query(`SELECT * FROM specialists WHERE id = $1`, [id])
    ).rows[0];
    if (!specialist) {
      return res.status(404).send({ msg: "Specialist topilmadi" });
    }
    await pool.query(`DELETE FROM specialists WHERE id = $1`, [id]);
    res.status(200).send(specialist);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addSpecialist,
  getAll,
  getById,
  updateById,
  deleteById,
};
