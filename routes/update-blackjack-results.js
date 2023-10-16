const express = require("express");
const asyncMySQL = require("../mysql/connection");
const router = express.Router();

router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { resultType } = req.body;

  if (["win", "lose", "draw"].includes(resultType)) {
    try {
      // Fetch the user_id corresponding to the provided username
      const userIdResult = await asyncMySQL(
        `SELECT user_id FROM casino_users WHERE username = ?`,
        [username]
      );

      if (!userIdResult || userIdResult.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const userId = userIdResult[0].user_id;

      const query = `
                INSERT INTO casino_results (username, user_id, casino_blackjack_${resultType}s)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE casino_blackjack_${resultType}s = casino_blackjack_${resultType}s + 1
            `;
      await asyncMySQL(query, [username, userId]);

      res
        .status(200)
        .send({ message: "Blackjack results updated successfully." });

    } catch (error) {
      console.error("Database error:", error);
      res.status(500).send({ status: 0, error: "Internal server error" });
    }
  } else {
    res.status(400).send({ error: "Invalid result type provided." });
  }
});

module.exports = router;
