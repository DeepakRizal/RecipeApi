const AppError = require("./../utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

module.exports = (err, req, res, next) => {
  let error = JSON.parse(JSON.stringify(err));
  // Check and handle specific error types
  if (error.name === "CastError") {
    error = handleCastErrorDB(error);
  } else if (error.name === "ValidationError") {
    error = handleValidationErrorDB(error);
  } else if (error.name === "JsonWebTokenError") {
    error = handleJWTError();
  } else if (error.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }

  // Update statusCode and message after potential modifications
  statusCode = error.statusCode || 500;
  message = error.message || "Internal Server Error";

  // Send the response
  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};
