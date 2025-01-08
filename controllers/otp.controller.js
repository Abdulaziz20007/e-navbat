const pool = require("../config/db");
const otpGenerator = require("otp-generator");
const { v4: uuidv4 } = require("uuid");
const { errorHandler } = require("../helpers/error_handler");
const config = require("config");
const { encode, decode } = require("../services/crypt");
const addMinutesToDate = require("../helpers/add_minutes");
const mailService = require("../services/mail.service");

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

    await mailService.sendMailActivationCode(phone_number, otp);

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

    if (result.otp != otp) {
      const response = {
        Status: "Failed",
        Details: "OTP not matched",
      };
      return res.status(400).send(response);
    }

    await pool.query(`UPDATE otp SET verified=$2 where id=$1`, [
      result.id,
      true,
    ]);

    const clientResult = await pool.query(
      `SELECT * FROM clients WHERE phone_number = $1`,
      [phone_number]
    );

    let client_id, client_status;
    if (clientResult.rows.length == 0) {
      const newClient = await pool.query(
        `INSERT INTO clients(phone_number, otp_id, is_active)
        VALUES ($1, $2, $3) RETURNING id`,
        [phone_number, result.id, true]
      );
      client_id = newClient.rows[0].id;
      client_status = "new";
    } else {
      client_id = clientResult.rows[0].id;
      client_status = "old";
      await pool.query(
        `UPDATE clients SET otp_id = $2, is_active=true where id = $1`,
        [client_id, result.id]
      );
    }

    const respone = {
      Status: "Success",
      ClientStatus: client_status,
      ClientId: client_id,
    };

    return res.status(200).send(respone);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteOtpById = async (req, res) => {
  try {
    const id = req.params.id;
    const otp = (await pool.query(`SELECT * FROM otp`)).rows[0];
    if (!otp) {
      return res.status(404).send({ msg: "otp not found" });
    }
    await pool.query(`DELETE FROM otp WHERE id = $1`, [id]);
    res.status(200).send({ msg: "Done", otp });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  createOtp,
  verifyOtpClient,
  deleteOtpById,
};
