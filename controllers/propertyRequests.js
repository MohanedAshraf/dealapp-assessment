const asyncHandler = require("../middlewares/async.js");
const PropertyRequest = require("../models/PropertyRequest.js");

module.exports = {
  // @desc      Create A Property Request
  // @route     POST /api/v1/property-requests
  // @access    Private - (Client,ADMIN)
  create: asyncHandler(async (req, res, next) => {
    const { propertyType, area, price, city, district, description } = req.body;
    const propertyRequest = new PropertyRequest({
      propertyType,
      area,
      price,
      city,
      district,
      description,
      user: req.user._id,
    });
    await propertyRequest.save();
    res.status(201).json(propertyRequest);
  }),

  // @desc      Update A Property Request
  // @route     PUT /api/v1/property-requests
  // @access    Private - (Client,ADMIN)
  update: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { description, area, price } = req.body;
    const propertyRequest = await PropertyRequest.findByIdAndUpdate(
      id,
      { description, area, price, refreshedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(propertyRequest);
  }),
};
