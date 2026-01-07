import { Router } from "express";
import { db } from "./db";
import { signToken, verifyToken } from "./auth";
import crypto from "crypto";

export const router = Router();

/* LOGIN (frontend sends uid + name after Google/Firebase login) */
router.post("/login", (req, res) => {
  const { uid, name, email } = req.body;

  db.prepare(
    "INSERT OR IGNORE INTO users (id,name,email) VALUES (?,?,?)"
  ).run(uid, name, email);

  const token = signToken({ uid });
  res.json({ token });
});

/* GET DESKS */
router.get("/desks", verifyToken, (req, res) => {
  const desks = db.prepare("SELECT * FROM desks").all();
  res.json(desks);
});

/* CREATE DESK */
router.post("/desks", verifyToken, (req, res) => {
  const id = crypto.randomUUID();
  db.prepare(
    "INSERT INTO desks (id, ownerId) VALUES (?,?)"
  ).run(id, req.body.user.uid);
  res.sendStatus(200);
});

/* TOGGLE DESK LIGHT */
router.post("/desks/:id/light", verifyToken, (req, res) => {
  db.prepare(
    "UPDATE desks SET light = NOT light WHERE id=?"
  ).run(req.params.id);
  res.sendStatus(200);
});
