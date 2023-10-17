const express = require("express");
const asyncMySQL = require("../mysql/connection");
const sha256 = require("sha256");
const { generateToken } = require("../util");
const {
  selectUserIDChipsAvatar,
  insertUserToLogin,
  selectBJResults,
  selectAvatars,
} = require("../mysql/queries");
const admin = require("firebase-admin");

const router = express.Router();

router.post("/", handleUserLogin);

async function handleUserLogin(req, res) {
  const { username, password } = req.body;

  try {
    const hashedPassword = hashPassword(password);

    const users = await asyncMySQL(selectUserIDChipsAvatar(), [username, hashedPassword]);
    const results = await asyncMySQL(selectBJResults(), [username]);
    const avatars = await asyncMySQL(selectAvatars(), [username]);

    if (users.length === 0) {
      return sendResponse(res, 0);
    }

    const token = generateToken(50);
    const firebaseToken = await admin
      .auth()
      .createCustomToken(users[0].user_id.toString());

    const chips = users[0].chips;
    const avatar = users[0].avatar;

    const isSuccess = await loginUser(users[0].user_id, token);

    if (isSuccess) {
      return sendResponse(
        res,
        1,
        token,
        firebaseToken,
        chips,
        avatar,
        results,
        null,
        avatars
      );
    } else {
      return sendResponse(res, 0, null, null, "Did not work");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 0, error: "Internal Server Error" });
  }
}

function hashPassword(password) {
  return sha256(process.env.SALT + password);
}

function sendResponse(
  res,
  status,
  token = null,
  firebaseToken = null,
  chips,
  avatar,
  results,
  error = null,
  avatars = []
) {
  if (token && firebaseToken) {
    res.cookie("token", token, {
      // httpOnly: true,
      // secure: true,
      sameSite: "strict",
    });

    res.send({ status, firebaseToken, chips, avatar, results, avatars });
  } else {
    res.send({ status, error });
  }
}

async function loginUser(userId, token) {
  const result = await asyncMySQL(insertUserToLogin(), [userId, token]);
  return result.affectedRows === 1;
}

module.exports = router;
