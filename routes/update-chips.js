const express = require("express");
const asyncMySQL = require("../mysql/connection");
const { updateChipsByUser } = require("../mysql/queries");
const router = express.Router();

router.post("/", handleUpdateChips);

async function handleUpdateChips(req, res) {
  const { newChipCount, username } = req.body;
  console.log(newChipCount, username);


  if (isInvalidData(newChipCount, username)) {
    return sendResponse(res, 0, "Invalid Data");
  }
  try {
    await asyncMySQL(updateChipsByUser(), [newChipCount, username]);
    sendResponse(res, 1);
  } catch (error) {
    sendResponse(res, 0, error.message);
  }
}

function isInvalidData(chips, username) {
  return !chips || !username;
}

function sendResponse(res, status, error = null) {
  if (error) {
    res.send({ status, error });
  } else {
    res.send({ status });
  }
}

module.exports = router;
