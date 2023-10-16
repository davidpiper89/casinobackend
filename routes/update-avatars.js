const express = require("express");
const router = express.Router();
const asyncMySQL = require("../mysql/connection");

router.post("/", async (req, res) => {
  const { avatarName, username } = req.body;
  const userId = req.user_id;

  try {
    await asyncMySQL(
      `INSERT IGNORE INTO casino_user_collection (user_id, username, avatar_id) VALUES (?, ?, ?)`,
      [userId, username, avatarName]
    );
    res.send({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
