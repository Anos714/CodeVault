import jwt from "jsonwebtoken";

export const optionalAuth = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      res.status(401);
      throw new Error("Please provide token");
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_JWT_SECRET,
    );

    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
