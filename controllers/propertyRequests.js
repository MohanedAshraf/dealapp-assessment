const asyncHandler = require("../middlewares/async.js");
const PropertyRequest = require("../models/PropertyRequest.js");

module.exports = {
  // @desc      Create A Property Request
  // @route     POST /api/v1/property-requests
  // @access    Private - (Client,ADMIN)
  /**
   * @swagger
   * /api/v1/property-requests:
   *   post:
   *     summary: Create a new property request
   *     tags: [Property Requests]
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
   *                 example: 'Looking for a spacious apartment'
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Bad Request
   */
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
  // @route     PUT /api/v1/property-requests/{id}
  // @access    Private - (Client,ADMIN)
  /**
   * @swagger
   * /api/v1/property-requests/{id}:
   *   put:
   *     summary: Update a property request
   *     tags: [Property Requests]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Property request ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                 type: string
   *               area:
   *                 type: number
   *               price:
   *                 type: number
   *     responses:
   *       200:
   *         description: Updated
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   */
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
