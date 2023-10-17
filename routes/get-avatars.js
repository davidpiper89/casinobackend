const express = require("express");
const router = express.Router();
const asyncMySQL = require("../mysql/connection");
const { selectAvatars } = require("../mysql/queries");

router.get("/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const avatars = await asyncMySQL(selectAvatars(), [username]);

    res.send({ success: true, avatars });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
