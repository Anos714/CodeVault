import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      res.status(404);
      throw new Error("Access token required");
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_JWT_SECRET,
    );

    req.userInfo = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
