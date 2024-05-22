const asyncHandler = require("../middlewares/async.js");
const User = require("../models/User.js");

module.exports = {
  /**
   * @swagger
   * /api/v1/stats/overview:
   *   get:
   *     summary: Get statistics about ads and requests for users
   *     tags: [Admin]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of results per page
   *     responses:
   *       200:
   *         description: Statistics fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                         example: 'John Doe'
   *                       phone:
   *                         type: string
   *                         example: '123-456-7890'
   *                       role:
   *                         type: string
   *                         example: 'CLIENT'
   *                       status:
   *                         type: string
   *                         example: 'ACTIVE'
   *                       adsCount:
   *                         type: integer
   *                         example: 5
   *                       totalAdsAmount:
   *                         type: number
   *                         example: 1500000
   *                       requestsCount:
   *                         type: integer
   *                         example: 3
   *                       totalRequestsAmount:
   *                         type: number
   *                         example: 600000
   *                 page:
   *                   type: integer
   *                   example: 1
   *                 limit:
   *                   type: integer
   *                   example: 10
   *                 total:
   *                   type: integer
   *                   example: 100
   *                 hasNextPage:
   *                   type: boolean
   *                   example: true
   *                 hasPreviousPage:
   *                   type: boolean
   *                   example: false
   *       401:
   *         description: Unauthorized
   */
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
