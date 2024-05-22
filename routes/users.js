const express = require("express");
const users = require("../controllers/users.js");

const router = express.Router({ mergeParams: true });

router.post("/auth/login", users.login);

module.exports = router;
