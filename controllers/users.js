const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middlewares/async.js");
const User = require("../models/User.js");

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

module.exports = {
  // @desc      Login user
  // @route     POST /api/v1/users/auth/login
  // @access    Public
  login: asyncHandler(async (req, res, next) => {
    const { phone, password } = req.body;

    // Validate emil & password
    if (!phone || !password) {
      return next(
        new ErrorResponse("Please provide phone number and password", 400)
      );
    }

    // Check for user
    const user = await User.findOne({ phone }).select("password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  }),
};
