const express = require("express");
const statistics = require("../controllers/statistics.js");

const { protect, authorize } = require("../middlewares/auth.js");

const router = express.Router({ mergeParams: true });
router.route("/overview").get(protect, authorize(), statistics.overview);

module.exports = router;
