const errorHandler = (err, res) => {
  console.error(err);
  return res.status(400).send({ error: err.message });
};

module.exports = { errorHandler };
