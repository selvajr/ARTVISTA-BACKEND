import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "please SignIn,unauthorized user" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = decode.id;
   // console.log(req.body.userId);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invalid Token Internal Server Error" });
  }
};
