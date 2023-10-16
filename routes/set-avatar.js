const express = require("express");
const router = express.Router();
const asyncMySQL = require("../mysql/connection");

router.post("/:username", async (req, res) => {
  const username = req.params.username;
  const avatar = req.body.avatar;



  if (!avatar) {
    return res.status(400).send({ status: 0, error: "Avatar not provided." });
  }

  try {
    const result = await asyncMySQL(
      "UPDATE casino_users SET avatar = ? WHERE username = ?",
      [avatar, username]
    );

    if (result.affectedRows === 1) {
      res.send({ status: 1, message: "Avatar updated successfully." });
    } else {
      res.status(400).send({ status: 0, error: "Failed to update avatar." });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ status: 0, error: "Internal server error" });
  }
});

module.exports = router;
