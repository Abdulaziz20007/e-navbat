const pool = require("../config/db");
const otpGenerator = require("otp-generator");
const { v4: uuidv4 } = require("uuid");
const { errorHandler } = require("../helpers/error_handler");
const config = require("config");
const { encode, decode } = require("../services/crypt");
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

const verifyOtpClient = async (req, res) => {
  try {
    const { verification_key, phone_number, otp } = req.body;
    const currentTime = new Date();

    const decodedData = await decode(verification_key);
    const parsedData = JSON.parse(decodedData);
    if (parsedData.phone_number !== phone_number) {
      const response = {
        Status: "Failed",
        Details: "OTP was not sent to this particular phone number",
      };
      return res.status(400).send(response);
    }
    const otpResult = await pool.query(`SELECT * FROM otp WHERE id = $1`, [
      parsedData.otp_id,
    ]);
    const result = otpResult.rows[0];

    if (result == null) {
      const response = {
        Status: "Failed",
        Details: "OTP not found",
      };
      return res.status(400).send(response);
    }

    if (result.verified == true) {
      const response = {
        Status: "Failed",
        Details: "OTP already verified",
      };
      return res.status(400).send(response);
    }

    if (result.expiration_time < currentTime) {
      const response = {
        Status: "Failed",
        Details: "OTP expired",
      };
      return res.status(400).send(response);
    }

    if (result.otp !== otp) {
      const response = {
        Status: "Failed",
        Details: "OTP not matched",
      };
      return res.status(400).send(response);
    }

    // res.send(decodedData);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  createOtp,
  verifyOtpClient,
};
