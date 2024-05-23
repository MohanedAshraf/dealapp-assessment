const { check, validationResult } = require("express-validator");
const asyncHandler = require("../middlewares/async.js");
const Ad = require("../models/Ad.js");
const PropertyRequest = require("../models/PropertyRequest.js");

module.exports = {
  // @desc      Create An Ad
  // @route     POST /api/v1/ads
  // @access    Private - (AGENT,ADMIN)
  /**
   * @swagger
   * /api/v1/ads:
   *   post:
   *     summary: Create a new ad
   *     tags: [Ads]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               propertyType:
   *                 type: string
   *                 enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT']
   *                 example: 'APARTMENT'
   *               area:
   *                 type: number
   *                 example: 120
   *               price:
   *                 type: number
   *                 example: 500000
   *               city:
   *                 type: string
   *                 example: 'New York'
   *               district:
   *                 type: string
   *                 example: 'Manhattan'
   *               description:
   *                 type: string
   *                 example: 'Spacious apartment available'
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Bad Request
   */
  create: [
    // Validation middleware
    [
      check("propertyType").isIn(["VILLA", "HOUSE", "LAND", "APARTMENT"]),
      check("area").isNumeric(),
      check("price").isNumeric(),
      check("city").isString(),
      check("district").isString(),
      check("description").isString(),
    ],
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { propertyType, area, price, city, district, description } =
        req.body;
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
  ],

  // @desc      Match An Ad with requests
  // @route     GET /api/v1/ads/:id/matches
  // @access    Private - (AGENT,ADMIN)
  /**
   * @swagger
   * /api/v1/ads/{id}/matches:
   *   get:
   *     summary: Get matching property requests for an ad
   *     tags: [Ads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Ad ID
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
   *         description: Matching property requests
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                 page:
   *                   type: integer
   *                 limit:
   *                   type: integer
   *                 total:
   *                   type: integer
   *                 hasNextPage:
   *                   type: boolean
   *                 hasPreviousPage:
   *                   type: boolean
   *       401:
   *         description: Unauthorized
   */
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
