export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const msg = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    msg,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
