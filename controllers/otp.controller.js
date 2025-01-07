const pool = require("../config/db");
const otpGenerator = require("otp-generator");
const { v4: uuidv4 } = require("uuid");
const { errorHandler } = require("../helpers/error_handler");
const config = require("config");
const { encode } = require("../services/crypt");
const addMinutesToDate = require("../helpers/add_minutes");

const createOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expiration_time = addMinutesToDate(now, config.get("otp_exp_time"));
    const newOtp = await pool.query(
      `INSERT INTO otp (id, otp, expiration_time)
      VALUES($1, $2, $3) returning id`,
      [uuidv4(), otp, expiration_time]
    );
    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtp.rows[0].id,
    };

    const encodedData = await encode(JSON.stringify(details));
    res.send({ verification_key: encodedData });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  createOtp,
};
