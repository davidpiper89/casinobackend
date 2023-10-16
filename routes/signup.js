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
    if (await userExists(username)) {
      throw new Error("Duplicate user");
    }

    if (await emailExists(email)) {
      throw new Error("Duplicate email");
    }

    const hashedPassword = hashPassword(password);
    const isSuccess = await registerUser(username, hashedPassword, email);

    if (isSuccess) {
      return sendResponse(res, 1);
    } else {
      throw new Error("Registration did not affect any rows.");
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

async function userExists(username) {
  const query = "SELECT COUNT(*) as count FROM casino_users WHERE username = ?";
  const result = await asyncMySQL(query, [username]);
  return result[0].count > 0;
}

async function emailExists(email) {
  const query = "SELECT COUNT(*) as count FROM casino_users WHERE email = ?";
  const result = await asyncMySQL(query, [email]);
  return result[0].count > 0;
}

function handleRegistrationError(res, error) {
  console.log(error);
  if (error.code === "ER_DUP_ENTRY") {
    sendResponse(res, 0, "Duplicate user");
  } else if (error.message === "Duplicate user") {
    sendResponse(res, 0, "Duplicate user");
  } else if (error.message === "Duplicate email") {
    sendResponse(res, 0, "Email already registered");
  } else if (error.message === "Registration did not affect any rows.") {
    sendResponse(res, 0, "Unexpected error");
  } else {
    sendResponse(res, 0, "Database error");
  }
}

module.exports = router;
