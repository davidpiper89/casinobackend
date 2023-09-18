const asyncMySQL = require("../mysql/connection");

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).send({ error: "Token not provided." });
  }

  try {
    const results = await asyncMySQL(
      `SELECT count(*) AS count, user_id FROM casino_logins WHERE token= ? ;`,
      [token]
    );

    req.user_id = results[0].user_id;

    if (results[0].count === 1) {
      next();
    } else {
      res.status(401).send({ status: 0, error: "The token was invalid" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ status: 0, error: "Internal server error" });
  }
};

module.exports = auth;
