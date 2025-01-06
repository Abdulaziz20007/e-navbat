const { Pool } = require("pg");
const config = require("config");

const pool = new Pool({
  user: config.get("db_usermame"),
  password: config.get("db_password"),
  host: config.get("db_host"),
  port: config.get("db_port"),
  database: config.get("db_name"),
});

module.exports = pool;