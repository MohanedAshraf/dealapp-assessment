const express = require("express");
const ads = require("../controllers/ads.js");

const { protect, authorize } = require("../middlewares/auth.js");

const router = express.Router({ mergeParams: true });
router.route("/ads").post(protect, authorize("AGENT"), ads.create);
router.route("/ads/:id/matches").get(protect, authorize("AGENT"), ads.match);

module.exports = router;
