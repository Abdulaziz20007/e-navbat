const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addQueue = async (req, res) => {
  try {
    const { spec_service_id, client_id, queue_number } = req.body;

    const newQueue = await pool.query(
      `INSERT INTO queue (spec_service_id, client_id, queue_number)
      VALUES ($1, $2, $3) RETURNING *`,
      [spec_service_id, client_id, queue_number]
    );
    res.status(201).send(newQueue.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const queues = await pool.query(`
      SELECT queue.*, clients.first_name AS client_name, 
      service.service_name AS service_name, 
      specialists.first_name AS specialist_name
      FROM queue JOIN clients ON clients.id = queue.client_id
      JOIN spec_service ON spec_service.id = queue.spec_service_id
      JOIN service ON service.id = spec_service.service_id
      JOIN specialists ON specialists.id = spec_service.spec_id;
    `);
    res.status(200).send(queues.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const queue = (
      await pool.query(
        `SELECT queue.*, clients.first_name AS client_name, 
      service.service_name AS service_name, 
      specialists.first_name AS specialist_name
      FROM queue JOIN clients ON clients.id = queue.client_id
      JOIN spec_service ON spec_service.id = queue.spec_service_id
      JOIN service ON service.id = spec_service.service_id
      JOIN specialists ON specialists.id = spec_service.spec_id
      WHERE queue.id = $1;`,
        [id]
      )
    ).rows[0];

    if (!queue) {
      return res.status(404).send({ msg: "Navbat topilmadi" });
    }
    res.status(200).send(queue.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldQueue = (
      await pool.query(`SELECT * FROM queue WHERE id = $1`, [id])
    ).rows[0];

    if (!oldQueue) {
      return res.status(404).send({ msg: "Navbat topilmadi" });
    }
    const { spec_service_id, client_id, queue_number } = req.body;

    const updatedQueue = await pool.query(
      `UPDATE queue SET spec_service_id = $1, client_id = $2, queue_number = $3
      WHERE id = $4 RETURNING *`,
      [
        spec_service_id || oldQueue.spec_service_id,
        client_id || oldQueue.client_id,
        queue_number || oldQueue.queue_number,
        id,
      ]
    );

    res.status(200).send(updatedQueue.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const queue = (await pool.query(`SELECT * FROM queue WHERE id = $1`, [id]))
      .rows[0];
    if (!queue) {
      return res.status(404).send({ msg: "Navbat topilmadi" });
    }
    await pool.query(`DELETE FROM queue WHERE id = $1`, [id]);
    res.status(200).send(queue);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addQueue,
  getAll,
  getById,
  updateById,
  deleteById,
};
