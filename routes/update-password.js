const express = require("express");
const asyncMySQL = require("../mysql/connection");
const {} = require("../mysql/queries");
const sha256 = require("sha256");
const router = express.Router();

router.put("/", handleUpdatePassword);

async function handleUpdatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const bearerHeader = req.headers.authorization;
  const token = bearerHeader.split(" ")[1];

  const hashedPassword = hashPassword(currentPassword);
  try {
    const userId = await asyncMySQL(
      `SELECT user_id FROM casino_logins WHERE token = ? `,
      [token]
    );

    if (!userId.length) {
      return res.status(404).send("User not found.");
    }

    const storedPassword = await asyncMySQL(
      `SELECT password from casino_users WHERE user_id = ?`,
      [userId[0].user_id]
    );

    if (!storedPassword.length) {
      return res.status(404).send("Password not found.");
    }

    if (storedPassword[0].password !== hashedPassword) {
      return res.status(401).send("Incorrect current password.");
    }

    const hashedNewPassword = hashPassword(newPassword);
    await asyncMySQL(`UPDATE casino_users SET password = ? WHERE user_id = ?`, [
      hashedNewPassword,
      userId[0].user_id,
    ]);

    res.send("Password updated successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
}

function hashPassword(password) {
  return sha256(process.env.SALT + password);
}

module.exports = router;
