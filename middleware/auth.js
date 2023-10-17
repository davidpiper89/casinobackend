const asyncMySQL = require("../mysql/connection");
const { selectUserCount } = require("../mysql/queries");

const auth = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res
      .status(400)
      .send({ error: "Authorization header not provided." });
  }

  const token = bearerHeader.split(" ")[1];

  if (!token) {
    return res.status(400).send({ error: "Token not provided." });
  }

  try {
    const results = await asyncMySQL(selectUserCount(), [token]);
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
