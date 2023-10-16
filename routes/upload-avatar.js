const express = require("express");
const asyncMySQL = require("../mysql/connection");
const router = express.Router();

router.put("/:username", async (req, res) => {
  const username = req.params.username;
  const avatarData = req.body.avatar;


  if (!avatarData) {
    return res.status(400).send({ status: 0, error: "Avatar data missing" });
  }

  try {
    await asyncMySQL("UPDATE casino_users SET avatar_blob = ? WHERE username = ?", [
      avatarData,
      username,
    ]);

    res.send({ status: 1, message: "Avatar updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ status: 0, error: "Internal server error" });
  }
});

module.exports = router;
