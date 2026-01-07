import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET = "SUPER_SECRET_KEY";

export const signToken = (payload: any) =>
  jwt.sign(payload, SECRET, { expiresIn: "7d" });

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    req.body.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};
