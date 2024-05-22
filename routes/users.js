const express = require("express");
const users = require("../controllers/users.js");

const User = require("../models/User.js");

const advancedResults = require("../middlewares/advancedResults.js");
const { protect, authorize } = require("../middlewares/auth.js");

const router = express.Router({ mergeParams: true });

module.exports = router;
