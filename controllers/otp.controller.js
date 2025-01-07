const pool = require("../config/db");
const otpGenerator = require("otp-generator");
const { v4: uuidv4 } = require("uuid");
const { errorHandler } = require("../helpers/error_handler");

const createOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    res.send({ otp });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  createOtp,
};
