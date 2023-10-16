const express = require("express");
const asyncMySQL = require("../mysql/connection");
const router = express.Router();

router.put("/", handleUpdateUsername);

async function handleUpdateUsername(req, res) {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  const token = bearerHeader.split(" ")[1];
  const { username } = req.body;

  // Validate the new username
  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "Invalid username." });
  }

  try {
    // Get user_id from the token
    const userIdResult = await asyncMySQL(
      `SELECT user_id FROM casino_logins WHERE token = ? `,
      [token]
    );

    if (!userIdResult || userIdResult.length === 0) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const userId = userIdResult[0].user_id;

    // Fetch the old username using the user_id from the casino_users table
    const oldUsernameResult = await asyncMySQL(
      `SELECT username as oldUsername FROM casino_users WHERE user_id = ?`,
      [userId]
    );

    if (!oldUsernameResult || oldUsernameResult.length === 0) {
      return res.status(401).json({ message: "Invalid user_id." });
    }

    const oldUsername = oldUsernameResult[0].oldUsername;
    

    // Check if new username already exists
    const existingUsernameResult = await asyncMySQL(
      `SELECT username FROM casino_users WHERE username = ? AND user_id != ?`,
      [username, userId]
    );

    if (existingUsernameResult && existingUsernameResult.length > 0) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // Update username in the casino_users database
    await asyncMySQL(`UPDATE casino_users SET username = ? WHERE user_id = ?`, [
      username,
      userId,
    ]);

    // Update username in the casino_results and casino_user_collection databases
    await asyncMySQL(
      `UPDATE casino_results SET username = ? WHERE username = ?`,
      [username, oldUsername]
    );
    await asyncMySQL(
      `UPDATE casino_user_collection SET username = ? WHERE user_id = ?`,
      [username, userId]
    );

    res.status(200).json({ message: "Username updated successfully." });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
}

module.exports = router;
