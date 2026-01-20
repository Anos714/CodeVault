import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      res.status(401);
      throw new Error("Please login to access this resource");
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_JWT_SECRET,
    );

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401);
      const expiryError = new Error("Access token expired");
      return next(expiryError);
    }

    if (error.name === "JsonWebTokenError") {
      res.status(401);
      const invalidError = new Error("Invalid access token");
      return next(invalidError);
    }
    next(error);
  }
};
