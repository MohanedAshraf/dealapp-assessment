const mongoose = require("mongoose");

const propertyRequestSchema = new mongoose.Schema(
  {
    propertyType: {
      type: String,
      enum: ["VILLA", "HOUSE", "LAND", "APARTMENT"],
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    refreshedAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyRequest", propertyRequestSchema);
