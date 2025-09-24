import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  // console.log("Cookies:", req.cookies);
  const token = req.cookies["auth_token"];

  // console.log("TOKEN Auth", token);
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    // console.log(decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "not authorized" });
  }
};

export default authenticateJWT;
