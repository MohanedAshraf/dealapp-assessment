const express = require("express");
const propertyRequests = require("../controllers/propertyRequests.js");

const { protect, authorize } = require("../middlewares/auth.js");

const router = express.Router({ mergeParams: true });
router.route("/").post(protect, authorize("CLIENT"), propertyRequests.create);

router.route("/:id").put(protect, authorize("CLIENT"), propertyRequests.update);

module.exports = router;
