const asyncHandler = require("../middlewares/async.js");
const Ad = require("../models/Ad.js");

module.exports = {
  // @desc      Get Users Overview
  // @route     GET /api/v1/stats/overview
  // @access    Private - ADMIN
  overview: asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const results = await User.aggregate([
      {
        $lookup: {
          from: "ads",
          localField: "_id",
          foreignField: "user",
          as: "ads",
        },
      },
      {
        $lookup: {
          from: "propertyrequests",
          localField: "_id",
          foreignField: "user",
          as: "requests",
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          role: 1,
          status: 1,
          adsCount: { $size: "$ads" },
          totalAdsAmount: { $sum: "$ads.price" },
          requestsCount: { $size: "$requests" },
          totalRequestsAmount: { $sum: "$requests.price" },
        },
      },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit, 10) },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const data = results[0].data;
    const total =
      results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;

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
