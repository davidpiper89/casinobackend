const express = require("express");
const asyncMySQL = require("../mysql/connection");
const sha256 = require("sha256");
const { insertUser } = require("../mysql/queries");

const router = express.Router();

router.post("/", handleUserRegistration);

async function handleUserRegistration(req, res) {
  const { email, username, password } = req.body;

  if (isInvalidData(email, username, password)) {
    return sendResponse(res, 0, "Incomplete data");
  }

  try {
    const hashedPassword = hashPassword(password);
    const isSuccess = await registerUser(username, hashedPassword, email);

    if (isSuccess) {
      return sendResponse(res, 1);
    } else {
      return sendResponse(res, 0, "Unexpected error");
    }
  } catch (error) {
    handleRegistrationError(res, error);
  }
}

function isInvalidData(email, username, password) {
  return !email || !username || !password;
}

function sendResponse(res, status, error = null) {
  if (error) {
    res.send({ status, error });
  } else {
    res.send({ status });
  }
}

function hashPassword(password) {
  return sha256(process.env.SALT + password);
}

async function registerUser(username, hashedPassword, email) {
  const result = await asyncMySQL(insertUser(), [
    username,
    hashedPassword,
    email,
    100,
  ]);
  return result.affectedRows === 1;
}

function handleRegistrationError(res, error) {
  if (error.code === "ER_DUP_ENTRY") {
    sendResponse(res, 0, "Duplicate user");
  } else {
    sendResponse(res, 0, "Database error");
  }
}

module.exports = router;
