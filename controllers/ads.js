const asyncHandler = require("../middlewares/async.js");
const Ad = require("../models/Ad.js");

module.exports = {
  // @desc      Create An Ad
  // @route     POST /api/v1/ads
  // @access    Private - (AGENT,ADMIN)
  create: asyncHandler(async (req, res, next) => {
    const { propertyType, area, price, city, district, description } = req.body;
    const ad = new Ad({
      propertyType,
      area,
      price,
      city,
      district,
      description,
      user: req.user._id,
    });
    await ad.save();
    res.status(201).json(ad);
  }),

  // @desc      Match An Ad with requests
  // @route     GET /api/v1/ads/:id/matches
  // @access    Private - (AGENT,ADMIN)
  match: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const ad = await Ad.findById(id);

    const matches = await PropertyRequest.aggregate([
      {
        $match: {
          district: ad.district,
          price: { $gte: ad.price - 10, $lte: ad.price + 10 },
          area: ad.area,
        },
      },
      { $sort: { refreshedAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit, 10) },
          ],
          total: [{ $count: "count" }],
        },
      },
      { $unwind: "$total" },
      { $addFields: { total: "$total.count" } },
    ]);

    const result = matches[0] || { data: [], total: 0 };
    const total = result.total;
    const data = result.data;

    res.json({
      data,
      page,
      limit,
      total,
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    });
  }),
};
