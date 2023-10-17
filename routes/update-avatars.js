const express = require("express");
const router = express.Router();
const asyncMySQL = require("../mysql/connection");
const { setUserAvatarCollection } = require("../mysql/queries");

router.post("/", async (req, res) => {
  const { avatarName, username } = req.body;
  const userId = req.user_id;

  try {
    await asyncMySQL(setUserAvatarCollection(), [userId, username, avatarName]);
    res.send({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
