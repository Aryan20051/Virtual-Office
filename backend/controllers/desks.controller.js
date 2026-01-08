import { db } from "../db/database.js";

export const getDesks = async (_req, res) => {
  const desks = await db.all(`SELECT * FROM desks`);
  res.json(desks);
};
