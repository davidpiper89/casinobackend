const express = require("express");
const { client_id } = require("../secrets/clientId");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client()
const { insertGoogleUser, selectGoogleUserID } = require("../mysql/queries");
const asyncMySQL = require("../mysql/connection");

const router = express.Router();

router.post("/", async (req, res) => {
  const { id_token } = req.body;


  if (!id_token) {
    return res.status(400).send({ status: 0, error: "ID token missing" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: client_id,
    });

    const payload = ticket.getPayload();
    const email = payload["email"];
    const username = payload["name"];

    let users = await asyncMySQL(selectGoogleUserID(), [email]);

    if (users.length === 0) {
      await registerUser(username, email);
    }

    const generatedToken = generateToken(50);

    // Send a successful response with your app's token and username
    res.send({ status: 1, token: generatedToken, username: username });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).send({ status: 0, error: "Internal Server Error" });
  }
});

async function registerUser(username, email) {
  const result = await asyncMySQL(insertGoogleUser(), [username, email]);
  return result.affectedRows === 1;
}

module.exports = router;
